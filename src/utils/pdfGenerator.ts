
import jsPDF from 'jspdf';
import { Invoice } from '@/types';
import { formatCurrency, formatDate } from './invoiceUtils';

export const generateInvoicePDF = (invoice: Invoice): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add company header
  doc.setFontSize(20);
  doc.text('INVOICE', pageWidth / 2, 20, { align: 'center' });
  
  // Add invoice details
  doc.setFontSize(12);
  doc.text(`Invoice Number: ${invoice.invoice_number}`, 20, 40);
  doc.text(`Date: ${formatDate(invoice.invoice_date)}`, 20, 50);
  doc.text(`Due Date: ${formatDate(invoice.due_date)}`, 20, 60);
  
  // Add client details
  doc.text('Bill To:', 20, 80);
  doc.text(invoice.client?.client_name || 'Client', 20, 90);
  
  // Add amount
  doc.text('Amount:', 20, 110);
  doc.text(formatCurrency(invoice.total_amount, invoice.currency), 20, 120);
  
  // Add billing period if available
  if (invoice.billing_period_start && invoice.billing_period_end) {
    doc.text('Billing Period:', 20, 140);
    doc.text(`${formatDate(invoice.billing_period_start)} - ${formatDate(invoice.billing_period_end)}`, 20, 150);
  }
  
  // Add footer
  doc.setFontSize(10);
  const today = new Date().toLocaleDateString();
  doc.text(`Generated on ${today}`, pageWidth / 2, 280, { align: 'center' });
  
  return doc;
};
