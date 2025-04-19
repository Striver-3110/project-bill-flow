
import { Invoice } from "@/types";
import { saveAs } from "file-saver";
import { toast } from "sonner";

// These functions are kept for backward compatibility
// but they're not used in the new dialog-based approach

export const viewInvoice = (invoice: Invoice) => {
  // For now, we'll just open a new window with invoice details
  window.open(`/invoices/${invoice.invoice_id || invoice.id}`, '_blank');
};

export const mailInvoice = async (invoice: Invoice) => {
  try {
    // In a real app, you would call your email service here
    // For now, we'll just show a success message
    const clientName = invoice.client?.client_name || 'client';
    toast.success(`Invoice ${invoice.invoice_number} sent to ${clientName}`);
  } catch (error) {
    toast.error("Failed to send invoice");
  }
};

export const downloadInvoice = async (invoice: Invoice) => {
  try {
    // In a real app, you would generate a PDF here
    // For now, we'll create a simple text file
    const clientName = invoice.client?.client_name || 'client';
    const content = `Invoice ${invoice.invoice_number}\nClient: ${clientName}\nAmount: ${invoice.total_amount}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `invoice-${invoice.invoice_number}.txt`);
    toast.success("Invoice downloaded successfully");
  } catch (error) {
    toast.error("Failed to download invoice");
  }
};

export const printInvoice = (invoice: Invoice) => {
  // Open a new window for printing
  const printWindow = window.open('', '_blank');
  const clientName = invoice.client?.client_name || 'client';
  
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.invoice_number}</title>
        </head>
        <body>
          <h1>Invoice ${invoice.invoice_number}</h1>
          <p>Client: ${clientName}</p>
          <p>Amount: ${invoice.total_amount}</p>
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
  } else {
    toast.error("Could not open print preview");
  }
};
