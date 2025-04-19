
import jsPDF from 'jspdf';
import { Invoice } from '@/types';
import { formatCurrency, formatDate } from './invoiceUtils';

export const generateInvoicePDF = (invoice: Invoice): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Set up the invoice with a clean layout
  doc.setFontSize(20);
  doc.text('INVOICE', pageWidth / 2, 30, { align: 'center' });
  
  // Add invoice details
  doc.setFontSize(12);
  doc.text(`Invoice Number: ${invoice.invoice_number}`, 20, 50);
  doc.text(`Date: ${formatDate(invoice.invoice_date)}`, 20, 60);
  doc.text(`Due Date: ${formatDate(invoice.due_date)}`, 20, 70);
  
  // Add client details
  doc.text('Bill To:', 20, 90);
  doc.text(invoice.client?.client_name || 'Client', 20, 100);
  
  // Add amount
  doc.text('Amount:', 20, 120);
  doc.text(formatCurrency(invoice.total_amount, invoice.currency), 20, 130);
  
  // Add billing period if available
  if (invoice.billing_period_start && invoice.billing_period_end) {
    doc.text('Billing Period:', 20, 150);
    doc.text(`${formatDate(invoice.billing_period_start)} - ${formatDate(invoice.billing_period_end)}`, 20, 160);
  }
  
  // Add footer text
  doc.setFontSize(10);
  const today = new Date().toLocaleDateString();
  doc.text(`Generated on ${today}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
  
  return doc;
};
