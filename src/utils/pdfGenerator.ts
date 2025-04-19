
import jsPDF from 'jspdf';
import { Invoice } from '@/types';
import { formatCurrency, formatDate } from './invoiceUtils';

export const generateInvoicePDF = (invoice: Invoice): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add top logo image
  const topLogoUrl = 'https://i.ibb.co/Z6nDP1Fx/top.png';
  doc.addImage(topLogoUrl, 'PNG', 20, 10, 60, 20);
  
  // Set up the invoice with a clean layout
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
  
  // Add bottom curvy image
  const bottomImageUrl = 'https://i.ibb.co/N6RsxmgB/bottom.png';
  doc.addImage(bottomImageUrl, 'PNG', 0, pageHeight - 40, pageWidth, 40);
  
  // Add footer text above the bottom image
  doc.setFontSize(10);
  const today = new Date().toLocaleDateString();
  doc.text(`Generated on ${today}`, pageWidth / 2, pageHeight - 45, { align: 'center' });
  
  return doc;
};
