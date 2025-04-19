
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types";
import { formatCurrency, formatDate } from "@/utils/invoiceUtils";

interface ViewInvoiceDialogProps {
  invoice: Invoice;
  trigger?: React.ReactNode;
}

export function ViewInvoiceDialog({ invoice, trigger }: ViewInvoiceDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}>
        {trigger || <Button variant="ghost" size="sm">View</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] z-[100]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Invoice {invoice.invoice_number}</DialogTitle>
          <DialogDescription>
            View the details of this invoice
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Client</h3>
              <p>{invoice.client?.client_name}</p>
            </div>
            <div>
              <h3 className="font-medium">Status</h3>
              <p className="capitalize">{invoice.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Invoice Date</h3>
              <p>{formatDate(invoice.invoice_date)}</p>
            </div>
            <div>
              <h3 className="font-medium">Due Date</h3>
              <p>{formatDate(invoice.due_date)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Billing Period</h3>
              <p>{formatDate(invoice.billing_period_start || '')} - {formatDate(invoice.billing_period_end || '')}</p>
            </div>
            <div>
              <h3 className="font-medium">Amount</h3>
              <p className="font-semibold">{formatCurrency(invoice.total_amount, invoice.currency)}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button variant="outline" onClick={(e) => e.stopPropagation()}>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
