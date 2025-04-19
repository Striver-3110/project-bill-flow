
import jsPDF from 'jspdf';
import { Invoice } from '@/types';
import { formatCurrency, formatDate } from './invoiceUtils';

export const generateInvoicePDF = (invoice: Invoice): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add Incubyte logo at the top
  const logoPath = '/lovable-uploads/478a8236-90f4-4556-9864-849ccd83c233.png';
  doc.addImage(logoPath, 'PNG', 20, 10, 60, 20); // Adjust size and position as needed
  
  // Add invoice title
  doc.setFontSize(20);
  doc.text('INVOICE', pageWidth / 2, 50, { align: 'center' });
  
  // Add invoice details
  doc.setFontSize(12);
  doc.text(`Invoice Number: ${invoice.invoice_number}`, 20, 70);
  doc.text(`Date: ${formatDate(invoice.invoice_date)}`, 20, 80);
  doc.text(`Due Date: ${formatDate(invoice.due_date)}`, 20, 90);
  
  // Add client details
  doc.text('Bill To:', 20, 110);
  doc.text(invoice.client?.client_name || 'Client', 20, 120);
  
  // Add amount
  doc.text('Amount:', 20, 140);
  doc.text(formatCurrency(invoice.total_amount, invoice.currency), 20, 150);
  
  // Add billing period if available
  if (invoice.billing_period_start && invoice.billing_period_end) {
    doc.text('Billing Period:', 20, 170);
    doc.text(`${formatDate(invoice.billing_period_start)} - ${formatDate(invoice.billing_period_end)}`, 20, 180);
  }
  
  // Add curvy image at the bottom
  const curvyPath = '/lovable-uploads/7f90ab5b-860e-4c02-b869-5a553d24ae56.png';
  doc.addImage(curvyPath, 'PNG', 0, pageHeight - 40, pageWidth, 40); // Adjust size as needed
  
  // Add footer text above the curvy image
  doc.setFontSize(10);
  const today = new Date().toLocaleDateString();
  doc.text(`Generated on ${today}`, pageWidth / 2, pageHeight - 45, { align: 'center' });
  
  return doc;
};

