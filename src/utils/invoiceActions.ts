
import { Invoice } from "@/types";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
// Replace this with your actual EmailJS public key
emailjs.init("YOUR_PUBLIC_KEY");

// These functions are kept for backward compatibility
// but they're not used in the new dialog-based approach

export const viewInvoice = (invoice: Invoice) => {
  // For now, we'll just open a new window with invoice details
  window.open(`/invoices/${invoice.invoice_id || invoice.id}`, '_blank');
};

export const mailInvoice = async (invoice: Invoice, recipientEmail: string, subject: string, message: string) => {
  try {
    // Prepare the template parameters
    const templateParams = {
      to_email: recipientEmail,
      from_name: 'BillFlow',
      subject: subject,
      message: message,
      invoice_number: invoice.invoice_number,
      client_name: invoice.client?.client_name || 'client',
      invoice_date: invoice.invoice_date,
      due_date: invoice.due_date,
      amount: invoice.total_amount,
      currency: invoice.currency
    };

    // Send the email using EmailJS
    const response = await emailjs.send(
      'service_id', // Replace with your EmailJS service ID
      'template_id', // Replace with your EmailJS template ID
      templateParams
    );

    if (response.status === 200) {
      toast.success(`Invoice ${invoice.invoice_number} sent to ${recipientEmail}`);
      return true;
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Error sending invoice:', error);
    toast.error("Failed to send invoice");
    return false;
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
