
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { mailInvoice } from "@/utils/invoiceActions";
import { Invoice } from "@/types";

interface ApproveInvoiceDialogProps {
  invoiceId: string;
  invoiceNumber: string;
  onApproved: () => void;
  trigger?: React.ReactNode;
}

export function ApproveInvoiceDialog({ 
  invoiceId, 
  invoiceNumber,
  onApproved,
  trigger 
}: ApproveInvoiceDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);

  const handleApprove = async () => {
    try {
      setIsSending(true);

      // Update the invoice approval record
      const { error: approvalError } = await supabase
        .from('invoice_approvals')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString(),
        })
        .eq('invoice_id', invoiceId);

      if (approvalError) throw approvalError;

      // Update the invoice status to 'approved' instead of 'paid'
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .update({ status: 'approved' })
        .eq('invoice_id', invoiceId)
        .select('*, client:clients(*)')
        .single();

      if (invoiceError) throw invoiceError;

      // Send email notification if we have client data
      if (invoiceData?.client?.contact_email) {
        try {
          // Create a properly formatted Invoice object
          const formattedInvoice: Invoice = {
            id: invoiceData.invoice_id,
            invoice_id: invoiceData.invoice_id,
            client_id: invoiceData.client_id,
            invoice_number: invoiceData.invoice_number,
            invoice_date: invoiceData.invoice_date,
            due_date: invoiceData.due_date,
            status: invoiceData.status as Invoice['status'],
            items: [], // Empty array since we don't have items in this context
            total_amount: invoiceData.total_amount,
            currency: invoiceData.currency,
            client: invoiceData.client,
            billing_period_start: invoiceData.billing_period_start,
            billing_period_end: invoiceData.billing_period_end,
            created_at: invoiceData.created_at,
            updated_at: invoiceData.updated_at,
            payment_date: invoiceData.payment_date
          };
          
          await mailInvoice(
            formattedInvoice,
            invoiceData.client.contact_email,
            `Invoice ${invoiceNumber} Approved`,
            `Your invoice ${invoiceNumber} has been approved. Thank you for your business.`
          );
          toast.success("Approval notification email sent successfully");
        } catch (emailError) {
          console.error('Failed to send approval email:', emailError);
          toast.error("Could not send approval notification email");
          // Continue with the process even if the email fails
        }
      }

      toast.success("Invoice approved successfully");
      onApproved();
      setOpen(false);
    } catch (error) {
      console.error('Error approving invoice:', error);
      toast.error("Failed to approve invoice");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="sm">Approve</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Invoice {invoiceNumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p>Are you sure you want to approve this invoice? This will mark the invoice as approved and send a notification email to the client.</p>
          <div className="flex justify-end gap-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleApprove} disabled={isSending}>
              <Check className="mr-2 h-4 w-4" />
              {isSending ? "Approving..." : "Approve"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
