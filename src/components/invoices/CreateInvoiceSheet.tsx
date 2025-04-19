
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
import { Plus, X, Save, RefreshCw, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useInvoices, CreateInvoiceInput, ClientProjectData } from "@/hooks/use-invoices";
import { generateInvoiceNumber, calculateLineItemTotal } from "@/utils/invoiceUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
    project_id?: string;
    employee_id?: string;
  }[];
  notes?: string;
}

export function CreateInvoiceSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useState<{ id: string; client_name: string }[]>([]);
  const { createInvoice, isCreating, getClientProjectDataForInvoice } = useInvoices();
  const [isLoadingProjectData, setIsLoadingProjectData] = useState(false);
  const [clientProjectData, setClientProjectData] = useState<ClientProjectData | null>(null);
  const [selectedTimeEntries, setSelectedTimeEntries] = useState<{
    [projectId: string]: {
      [employeeId: string]: boolean;
    };
  }>({});
  
  const form = useForm<InvoiceFormInput>({
    defaultValues: {
      invoice_number: generateInvoiceNumber(),
      client_id: "",
      invoice_date: new Date().toISOString().slice(0, 10),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      billing_period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
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
      ],
      notes: ""
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

  // Handle client change to load project data
  const handleClientChange = async (clientId: string) => {
    if (!clientId) return;
    
    try {
      setIsLoadingProjectData(true);
      const startDate = form.getValues().billing_period_start;
      const endDate = form.getValues().billing_period_end;
      
      const data = await getClientProjectDataForInvoice(clientId, startDate, endDate);
      setClientProjectData(data);
      
      // Initialize selectedTimeEntries structure
      const initialSelected: {[projectId: string]: {[employeeId: string]: boolean}} = {};
      
      data?.projects.forEach(project => {
        initialSelected[project.project_id] = {};
        project.employees.forEach(employee => {
          // Default to selected
          initialSelected[project.project_id][employee.employee_id] = true;
        });
      });
      
      setSelectedTimeEntries(initialSelected);
    } catch (error) {
      console.error("Error fetching project data:", error);
      toast.error("Failed to load project data");
    } finally {
      setIsLoadingProjectData(false);
    }
  };

  // Refresh project data when date range changes
  const refreshProjectData = async () => {
    const clientId = form.getValues().client_id;
    if (!clientId) return;
    
    await handleClientChange(clientId);
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

  // Calculate line item totals
  const getLineItemTotal = (index: number) => {
    const lineItem = form.getValues().line_items[index];
    const quantity = lineItem.quantity || 0;
    const unitPrice = lineItem.unit_price || 0;
    const taxRate = lineItem.tax_rate || 0;
    
    return calculateLineItemTotal(quantity, unitPrice, taxRate);
  };

  // Calculate invoice total
  const calculateInvoiceTotal = () => {
    const lineItems = form.getValues().line_items;
    let subtotal = 0;
    let taxTotal = 0;
    
    lineItems.forEach((_, index) => {
      const { subtotal: itemSubtotal, taxAmount } = getLineItemTotal(index);
      subtotal += itemSubtotal;
      taxTotal += taxAmount;
    });
    
    return {
      subtotal,
      taxTotal,
      total: subtotal + taxTotal
    };
  };

  // Generate line items from selected time entries
  const generateLineItemsFromTimeEntries = () => {
    if (!clientProjectData) return;
    
    const newLineItems: InvoiceFormInput['line_items'] = [];
    
    clientProjectData.projects.forEach(project => {
      project.employees.forEach(employee => {
        if (selectedTimeEntries[project.project_id]?.[employee.employee_id]) {
          newLineItems.push({
            description: `${employee.full_name} (${employee.role}) - ${project.project_name} - ${employee.total_hours} hours`,
            quantity: employee.total_hours,
            unit_price: employee.cost_rate,
            tax_rate: 0,
            project_id: project.project_id,
            employee_id: employee.employee_id
          });
        }
      });
    });
    
    // If no line items were generated, add a default empty one
    if (newLineItems.length === 0) {
      newLineItems.push({
        description: "",
        quantity: 1,
        unit_price: 0,
        tax_rate: 0
      });
    }
    
    form.setValue("line_items", newLineItems);
  };

  // Toggle selection of an employee's time entries
  const toggleEmployeeSelection = (projectId: string, employeeId: string) => {
    setSelectedTimeEntries(prev => {
      const updated = { ...prev };
      if (!updated[projectId]) updated[projectId] = {};
      updated[projectId][employeeId] = !updated[projectId][employeeId];
      return updated;
    });
  };

  // Toggle selection of all employees in a project
  const toggleProjectSelection = (projectId: string, selected: boolean) => {
    setSelectedTimeEntries(prev => {
      const updated = { ...prev };
      if (!updated[projectId]) updated[projectId] = {};
      
      clientProjectData?.projects.find(p => p.project_id === projectId)?.employees.forEach(emp => {
        updated[projectId][emp.employee_id] = selected;
      });
      
      return updated;
    });
  };

  // Calculate total selected hours and amount
  const calculateSelectedTotals = () => {
    if (!clientProjectData) return { hours: 0, amount: 0 };
    
    let totalHours = 0;
    let totalAmount = 0;
    
    clientProjectData.projects.forEach(project => {
      project.employees.forEach(employee => {
        if (selectedTimeEntries[project.project_id]?.[employee.employee_id]) {
          totalHours += employee.total_hours;
          totalAmount += employee.total_billable_amount;
        }
      });
    });
    
    return { hours: totalHours, amount: totalAmount };
  };

  // Handle form submission
  const onSubmit = (data: InvoiceFormInput) => {
    // Prepare line items with calculated totals
    const lineItems = data.line_items.map(item => {
      const { subtotal, taxAmount, total } = calculateLineItemTotal(
        item.quantity || 0,
        item.unit_price || 0,
        item.tax_rate || 0
      );

      return {
        description: item.description,
        quantity: item.quantity || 0,
        unit_price: item.unit_price || 0,
        amount: subtotal,
        tax_rate: item.tax_rate || 0,
        tax_amount: taxAmount,
        total_amount: total,
        project_id: item.project_id,
        employee_id: item.employee_id
      };
    });

    // Create the invoice input object
    const invoiceInput: CreateInvoiceInput = {
      ...data,
      total_amount: calculateInvoiceTotal().total,
      line_items: lineItems
    };

    // Submit the invoice
    createInvoice(invoiceInput, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset({
          invoice_number: generateInvoiceNumber(),
          client_id: data.client_id,
          invoice_date: new Date().toISOString().slice(0, 10),
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          billing_period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
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
        });
        setClientProjectData(null);
        setSelectedTimeEntries({});
      }
    });
  };

  const selectedTotals = calculateSelectedTotals();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="bg-billflow-blue-600 hover:bg-billflow-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[95vw] sm:max-w-[1000px] overflow-hidden p-0">
        <SheetHeader className="p-6 bg-white border-b">
          <SheetTitle>Create New Invoice</SheetTitle>
          <SheetDescription>
            Create a detailed invoice for your client based on project time entries.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-160px)] p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            onChange={(e) => {
                              field.onChange(e);
                              handleClientChange(e.target.value);
                            }}
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
                            <Input 
                              type="date" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                            />
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
                            <Input 
                              type="date" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={refreshProjectData}
                      disabled={isLoadingProjectData || !form.getValues().client_id}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingProjectData ? 'animate-spin' : ''}`} />
                      Refresh Project Data
                    </Button>
                  </div>
                </div>
              </div>

              {/* Client Project Data */}
              {isLoadingProjectData && (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-billflow-blue-600 mr-2" />
                  <p>Loading project data...</p>
                </div>
              )}

              {!isLoadingProjectData && clientProjectData && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Billable Time Entries</CardTitle>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={generateLineItemsFromTimeEntries}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Line Items
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {clientProjectData.projects.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No billable time entries found for the selected period.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-sm text-muted-foreground">
                            Client: <span className="font-medium text-foreground">{clientProjectData.client_name}</span>
                          </div>
                          <div className="text-sm font-medium">
                            Selected: {selectedTotals.hours.toFixed(2)} hours (
                            {new Intl.NumberFormat('en-US', { 
                              style: 'currency', 
                              currency: form.getValues().currency 
                            }).format(selectedTotals.amount)}
                            )
                          </div>
                        </div>
                        
                        <Accordion type="multiple" className="w-full">
                          {clientProjectData.projects.map((project) => (
                            <AccordionItem key={project.project_id} value={project.project_id}>
                              <AccordionTrigger className="hover:bg-gray-50 px-3">
                                <div className="flex justify-between items-center w-full pr-4">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      checked={project.employees.every(emp => 
                                        selectedTimeEntries[project.project_id]?.[emp.employee_id]
                                      )}
                                      onCheckedChange={(checked) => {
                                        toggleProjectSelection(project.project_id, !!checked);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <span>{project.project_name}</span>
                                    <Badge variant="outline">{project.status}</Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {project.employees.reduce((total, emp) => total + emp.total_hours, 0).toFixed(2)} hours
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-3">
                                <div className="space-y-2">
                                  {project.employees.map((employee) => (
                                    <div key={employee.employee_id} className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-50">
                                      <div className="flex items-center space-x-2">
                                        <Checkbox 
                                          checked={selectedTimeEntries[project.project_id]?.[employee.employee_id] || false}
                                          onCheckedChange={() => toggleEmployeeSelection(project.project_id, employee.employee_id)}
                                        />
                                        <div>
                                          <div className="font-medium">{employee.full_name}</div>
                                          <div className="text-sm text-muted-foreground">
                                            {employee.department} • {employee.role}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div>{employee.total_hours.toFixed(2)} hours</div>
                                        <div className="text-sm text-muted-foreground">
                                          Rate: {new Intl.NumberFormat('en-US', { 
                                            style: 'currency', 
                                            currency: form.getValues().currency 
                                          }).format(employee.cost_rate)} / hour
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

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
                        }).format(getLineItemTotal(index).subtotal)}
                      </div>
                      <div>
                        <span className="font-medium">Tax:</span>{" "}
                        {new Intl.NumberFormat('en-US', { 
                          style: 'currency', 
                          currency: form.getValues().currency 
                        }).format(getLineItemTotal(index).taxAmount)}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span>{" "}
                        {new Intl.NumberFormat('en-US', { 
                          style: 'currency', 
                          currency: form.getValues().currency 
                        }).format(getLineItemTotal(index).total)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Invoice Notes */}
              <div className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any additional notes or payment instructions..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Separator className="my-2" />
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
            </form>
          </Form>
        </ScrollArea>
        
        <div className="p-6 bg-white border-t flex justify-end">
          <Button
            type="button"
            className="bg-billflow-blue-600 hover:bg-billflow-blue-700"
            disabled={isCreating}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isCreating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Invoice
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
