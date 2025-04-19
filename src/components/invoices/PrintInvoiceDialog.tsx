
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
import { Printer, LayoutTemplate } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/invoiceUtils";

interface PrintInvoiceDialogProps {
  invoice: Invoice;
  trigger?: React.ReactNode;
}

export function PrintInvoiceDialog({ invoice, trigger }: PrintInvoiceDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handlePrint = () => {
    // Open a new window for printing
    const printWindow = window.open('', '_blank');
    const clientName = invoice.client?.client_name || 'client';
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoice.invoice_number}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 40px;
                line-height: 1.6;
              }
              .invoice-header {
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #ddd;
                padding-bottom: 20px;
                margin-bottom: 20px;
              }
              .company-details {
                text-align: right;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              th, td {
                padding: 10px;
                border-bottom: 1px solid #ddd;
                text-align: left;
              }
              .total {
                text-align: right;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="invoice-header">
              <div>
                <h1>INVOICE</h1>
                <p>Invoice Number: ${invoice.invoice_number}</p>
                <p>Date: ${formatDate(invoice.invoice_date)}</p>
                <p>Due Date: ${formatDate(invoice.due_date)}</p>
              </div>
              <div class="company-details">
                <h2>BillFlow</h2>
                <p>Your Company Address</p>
                <p>City, State ZIP</p>
                <p>Phone: (123) 456-7890</p>
              </div>
            </div>
            
            <div>
              <h3>Bill To:</h3>
              <p>${clientName}</p>
              <p>Client Address</p>
              <p>Client City, State ZIP</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Services</td>
                  <td>1</td>
                  <td>${formatCurrency(invoice.total_amount, invoice.currency)}</td>
                  <td>${formatCurrency(invoice.total_amount, invoice.currency)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="total">Total:</td>
                  <td>${formatCurrency(invoice.total_amount, invoice.currency)}</td>
                </tr>
              </tfoot>
            </table>
            
            <div>
              <h3>Notes</h3>
              <p>${invoice.notes || 'Thank you for your business!'}</p>
            </div>
            
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                }
              }
            </script>
          </body>
        </html>
      `);
      setOpen(false);
      toast.success("Print preview opened");
    } else {
      toast.error("Could not open print preview");
    }
  };

  const handlePrintPreview = () => {
    setOpen(false);
    handlePrint();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="sm">Print</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Print Invoice {invoice.invoice_number}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-4 py-4">
          <Button onClick={handlePrintPreview} className="flex items-center justify-start" variant="outline">
            <Printer className="mr-2" size={20} />
            Print Invoice
          </Button>
          
          <Button className="flex items-center justify-start" variant="outline">
            <LayoutTemplate className="mr-2" size={20} />
            Layout Settings
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
