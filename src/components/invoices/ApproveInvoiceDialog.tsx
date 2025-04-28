
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

  const handleApprove = async () => {
    try {
      const { error: approvalError } = await supabase
        .from('invoice_approvals')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString(),
        })
        .eq('invoice_id', invoiceId);

      if (approvalError) throw approvalError;

      const { error: invoiceError } = await supabase
        .from('invoices')
        .update({ status: 'approved' })
        .eq('invoice_id', invoiceId);

      if (invoiceError) throw invoiceError;

      toast.success("Invoice approved successfully");
      onApproved();
      setOpen(false);
    } catch (error) {
      console.error('Error approving invoice:', error);
      toast.error("Failed to approve invoice");
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
          <p>Are you sure you want to approve this invoice? This will send the invoice to the client.</p>
          <div className="flex justify-end gap-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleApprove}>
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
