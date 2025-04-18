
import { Invoice, InvoiceLineItem } from "../types";

/**
 * Calculate the total amount for an invoice from its line items
 */
export const calculateInvoiceTotal = (lineItems: InvoiceLineItem[]): number => {
  return lineItems.reduce((total, item) => total + item.total_amount, 0);
};

/**
 * Format currency values for display
 */
export const formatCurrency = (amount: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

/**
 * Get status badge color based on invoice status
 */
export const getStatusColor = (status: Invoice['status']): string => {
  switch (status) {
    case 'draft':
      return 'bg-billflow-gray-400 text-white';
    case 'sent':
      return 'bg-billflow-blue-500 text-white';
    case 'paid':
      return 'bg-billflow-success text-white';
    case 'overdue':
      return 'bg-billflow-error text-white';
    default:
      return 'bg-billflow-gray-300 text-billflow-gray-700';
  }
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Check if an invoice is overdue
 */
export const isOverdue = (invoice: Invoice): boolean => {
  if (invoice.status === 'paid') return false;
  
  const today = new Date();
  const dueDate = new Date(invoice.due_date);
  return today > dueDate;
};

/**
 * Calculate days until due or days overdue
 */
export const daysUntilDue = (invoice: Invoice): { days: number; overdue: boolean } => {
  const today = new Date();
  const dueDate = new Date(invoice.due_date);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    days: Math.abs(diffDays),
    overdue: diffDays < 0
  };
};

/**
 * Generate a new invoice number based on the current date and sequence
 */
export const generateInvoiceNumber = (prefix: string = 'INV', sequence: number): string => {
  const year = new Date().getFullYear();
  const paddedSequence = String(sequence).padStart(3, '0');
  return `${prefix}-${year}-${paddedSequence}`;
};

/**
 * Filter invoices by status
 */
export const filterInvoicesByStatus = (invoices: Invoice[], status: Invoice['status'] | 'all'): Invoice[] => {
  if (status === 'all') return invoices;
  return invoices.filter(invoice => invoice.status === status);
};

/**
 * Get invoice statistics
 */
export const getInvoiceStats = (invoices: Invoice[]): { 
  total: number; 
  paid: number; 
  overdue: number; 
  draft: number; 
  sent: number;
} => {
  return {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    draft: invoices.filter(inv => inv.status === 'draft').length,
    sent: invoices.filter(inv => inv.status === 'sent').length,
  };
};

/**
 * Sort invoices by date, status, amount, etc.
 */
export const sortInvoices = (invoices: Invoice[], sortBy: 'date' | 'dueDate' | 'amount' | 'status', ascending: boolean = true): Invoice[] => {
  return [...invoices].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return ascending 
          ? new Date(a.invoice_date).getTime() - new Date(b.invoice_date).getTime() 
          : new Date(b.invoice_date).getTime() - new Date(a.invoice_date).getTime();
      
      case 'dueDate':
        return ascending 
          ? new Date(a.due_date).getTime() - new Date(b.due_date).getTime() 
          : new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
      
      case 'amount':
        return ascending 
          ? a.total_amount - b.total_amount 
          : b.total_amount - a.total_amount;
      
      case 'status':
        const statusOrder = { 'draft': 0, 'sent': 1, 'overdue': 2, 'paid': 3 };
        return ascending 
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status];
      
      default:
        return 0;
    }
  });
};
