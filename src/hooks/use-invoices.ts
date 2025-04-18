
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Invoice } from "@/types";

export type CreateInvoiceInput = {
  invoice_number: string;
  client_id: string;
  invoice_date: string;
  due_date: string;
  billing_period_start: string;
  billing_period_end: string;
  status: string;
  currency: string;
  total_amount: number;
  line_items: {
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    amount: number;
    tax_amount: number;
    total_amount: number;
  }[];
};

export function useInvoices() {
  const queryClient = useQueryClient();

  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          client:clients(client_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async (input: CreateInvoiceInput) => {
      // Insert invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          invoice_number: input.invoice_number,
          client_id: input.client_id,
          invoice_date: input.invoice_date,
          due_date: input.due_date,
          billing_period_start: input.billing_period_start,
          billing_period_end: input.billing_period_end,
          status: input.status,
          currency: input.currency,
          total_amount: input.total_amount
        })
        .select("invoice_id")
        .single();

      if (invoiceError) throw invoiceError;

      // Insert line items
      for (const item of input.line_items) {
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
    },
    onError: (error) => {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    }
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('invoice_id', invoiceId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success("Invoice deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete invoice");
    }
  });

  return {
    invoices,
    isLoading,
    error,
    deleteInvoice: deleteInvoiceMutation.mutate,
    createInvoice: createInvoiceMutation.mutate,
    isCreating: createInvoiceMutation.isPending
  };
}
