
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Plus, X, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useInvoices } from "@/hooks/use-invoices";
import { InvoiceLineItem } from "@/types";

// Define the form input types
interface InvoiceFormInput {
  invoice_number: string;
  client_id: string;
  invoice_date: string;
  due_date: string;
  billing_period_start: string;
  billing_period_end: string;
  status: string;
  currency: string;
  line_items: {
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
  }[];
}

export function CreateInvoiceSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useState<{ id: string; client_name: string }[]>([]);
  const queryClient = useQueryClient();
  
  const form = useForm<InvoiceFormInput>({
    defaultValues: {
      invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      client_id: "",
      invoice_date: new Date().toISOString().slice(0, 10),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      billing_period_start: new Date().toISOString().slice(0, 10),
      billing_period_end: new Date().toISOString().slice(0, 10),
      status: "draft",
      currency: "USD",
      line_items: [
        {
          description: "",
          quantity: 1,
          unit_price: 0,
          tax_rate: 0,
        }
      ]
    }
  });

  // Load clients on component mount
  useEffect(() => {
    async function loadClients() {
      const { data, error } = await supabase
        .from("clients")
        .select("id, client_name")
        .order("client_name");

      if (error) {
        toast.error("Failed to load clients");
        console.error("Error loading clients:", error);
        return;
      }

      setClients(data || []);
      // Set first client as default if available
      if (data && data.length > 0) {
        form.setValue("client_id", data[0].id);
      }
    }

    if (isOpen) {
      loadClients();
    }
  }, [isOpen, form]);

  // Create invoice mutation
  const createInvoiceMutation = useMutation({
    mutationFn: async (data: InvoiceFormInput) => {
      // Calculate total amount from line items
      const lineItems = data.line_items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount: item.quantity * item.unit_price,
        tax_rate: item.tax_rate,
        tax_amount: (item.quantity * item.unit_price * item.tax_rate) / 100,
        total_amount: item.quantity * item.unit_price * (1 + item.tax_rate / 100)
      }));
      
      const total_amount = lineItems.reduce((sum, item) => sum + item.total_amount, 0);

      // Insert invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          invoice_number: data.invoice_number,
          client_id: data.client_id,
          invoice_date: data.invoice_date,
          due_date: data.due_date,
          billing_period_start: data.billing_period_start,
          billing_period_end: data.billing_period_end,
          status: data.status,
          currency: data.currency,
          total_amount: total_amount
        })
        .select("invoice_id")
        .single();

      if (invoiceError) throw invoiceError;

      // Insert line items
      for (const item of lineItems) {
        const { error: lineItemError } = await supabase
          .from("invoice_line_items")
          .insert({
            invoice_id: invoiceData.invoice_id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            amount: item.amount,
            tax_rate: item.tax_rate,
            tax_amount: item.tax_amount,
            total_amount: item.total_amount
          });

        if (lineItemError) throw lineItemError;
      }

      return invoiceData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success("Invoice created successfully");
      setIsOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    }
  });

  // Calculate line item totals
  const calculateLineItemTotal = (index: number) => {
    const lineItem = form.getValues().line_items[index];
    const quantity = lineItem.quantity || 0;
    const unitPrice = lineItem.unit_price || 0;
    const taxRate = lineItem.tax_rate || 0;
    
    const subtotal = quantity * unitPrice;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    
    return { subtotal, taxAmount, total };
  };

  // Add new line item
  const addLineItem = () => {
    const currentLineItems = form.getValues().line_items;
    form.setValue("line_items", [
      ...currentLineItems,
      { description: "", quantity: 1, unit_price: 0, tax_rate: 0 }
    ]);
  };

  // Remove line item
  const removeLineItem = (index: number) => {
    const currentLineItems = form.getValues().line_items;
    if (currentLineItems.length > 1) {
      form.setValue(
        "line_items",
        currentLineItems.filter((_, i) => i !== index)
      );
    }
  };

  // Calculate invoice total
  const calculateInvoiceTotal = () => {
    const lineItems = form.getValues().line_items;
    let subtotal = 0;
    let taxTotal = 0;
    
    lineItems.forEach((_, index) => {
      const { subtotal: itemSubtotal, taxAmount } = calculateLineItemTotal(index);
      subtotal += itemSubtotal;
      taxTotal += taxAmount;
    });
    
    return {
      subtotal,
      taxTotal,
      total: subtotal + taxTotal
    };
  };

  // Handle form submission
  const onSubmit = (data: InvoiceFormInput) => {
    createInvoiceMutation.mutate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="bg-billflow-blue-600 hover:bg-billflow-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90vw] sm:max-w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Invoice</SheetTitle>
          <SheetDescription>
            Create a new invoice for your client. Fill in all the required information below.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Invoice Details */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="invoice_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <FormControl>
                        <select
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          {...field}
                        >
                          <option value="">Select a client</option>
                          {clients.map(client => (
                            <option key={client.id} value={client.id}>
                              {client.client_name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <select
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          {...field}
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="CAD">CAD</option>
                          <option value="AUD">AUD</option>
                          <option value="INR">INR</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <select
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          {...field}
                        >
                          <option value="draft">Draft</option>
                          <option value="sent">Sent</option>
                          <option value="paid">Paid</option>
                          <option value="overdue">Overdue</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="invoice_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="billing_period_start"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Period Start</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="billing_period_end"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Period End</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Line Items</h3>
                <Button type="button" variant="outline" onClick={addLineItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
              
              {form.watch("line_items").map((_, index) => (
                <div key={index} className="border p-4 rounded-md space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeLineItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name={`line_items.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`line_items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0);
                              }} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`line_items.${index}.unit_price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Price</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0);
                              }} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`line_items.${index}.tax_rate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Rate (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0);
                              }} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-2 text-sm">
                    <div>
                      <span className="font-medium">Subtotal:</span>{" "}
                      {new Intl.NumberFormat('en-US', { 
                        style: 'currency', 
                        currency: form.getValues().currency 
                      }).format(calculateLineItemTotal(index).subtotal)}
                    </div>
                    <div>
                      <span className="font-medium">Tax:</span>{" "}
                      {new Intl.NumberFormat('en-US', { 
                        style: 'currency', 
                        currency: form.getValues().currency 
                      }).format(calculateLineItemTotal(index).taxAmount)}
                    </div>
                    <div>
                      <span className="font-medium">Total:</span>{" "}
                      {new Intl.NumberFormat('en-US', { 
                        style: 'currency', 
                        currency: form.getValues().currency 
                      }).format(calculateLineItemTotal(index).total)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Invoice Summary */}
            <div className="bg-gray-50 p-4 rounded-md space-y-2 mt-4">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>
                  {new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: form.getValues().currency 
                  }).format(calculateInvoiceTotal().subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tax:</span>
                <span>
                  {new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: form.getValues().currency 
                  }).format(calculateInvoiceTotal().taxTotal)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>
                  {new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: form.getValues().currency 
                  }).format(calculateInvoiceTotal().total)}
                </span>
              </div>
            </div>
            
            <SheetFooter className="pt-4">
              <Button
                type="submit"
                className="w-full md:w-auto bg-billflow-blue-600 hover:bg-billflow-blue-700"
                disabled={createInvoiceMutation.isPending}
              >
                {createInvoiceMutation.isPending ? (
                  "Creating..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Invoice
                  </>
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
