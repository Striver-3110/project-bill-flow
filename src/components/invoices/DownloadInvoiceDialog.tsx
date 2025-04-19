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
import { Invoice } from "@/types";
import { toast } from "sonner";
import { FileText, FileSpreadsheet } from "lucide-react";
import { saveAs } from "file-saver";
import { generateInvoicePDF } from "@/utils/pdfGenerator";

interface DownloadInvoiceDialogProps {
  invoice: Invoice;
  trigger?: React.ReactNode;
}

export function DownloadInvoiceDialog({ invoice, trigger }: DownloadInvoiceDialogProps) {
  const [open, setOpen] = React.useState(false);

  const downloadAsPDF = async () => {
    try {
      const doc = generateInvoicePDF(invoice);
      doc.save(`invoice-${invoice.invoice_number}.pdf`);
      toast.success("Invoice downloaded as PDF");
      setOpen(false);
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to download invoice");
    }
  };

  const downloadAsCSV = async () => {
    try {
      const clientName = invoice.client?.client_name || 'client';
      const content = `Invoice Number,Client,Date,Due Date,Amount\n${invoice.invoice_number},${clientName},${invoice.invoice_date},${invoice.due_date},${invoice.total_amount}`;
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `invoice-${invoice.invoice_number}.csv`);
      toast.success("Invoice downloaded as CSV");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to download invoice");
    }
  };

  const downloadAsText = async () => {
    try {
      const clientName = invoice.client?.client_name || 'client';
      const content = `Invoice ${invoice.invoice_number}\nClient: ${clientName}\nAmount: ${invoice.total_amount}`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `invoice-${invoice.invoice_number}.txt`);
      toast.success("Invoice downloaded as text");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to download invoice");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="sm">Download</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Download Invoice {invoice.invoice_number}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-4 py-4">
          <Button onClick={downloadAsPDF} className="flex items-center justify-start" variant="outline">
            <FileText className="mr-2" size={20} />
            Download as PDF
          </Button>
          
          <Button onClick={downloadAsCSV} className="flex items-center justify-start" variant="outline">
            <FileSpreadsheet className="mr-2" size={20} />
            Download as CSV
          </Button>
          
          <Button onClick={downloadAsText} className="flex items-center justify-start" variant="outline">
            <FileText className="mr-2" size={20} />
            Download as Text
          </Button>
        </div>
        
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
