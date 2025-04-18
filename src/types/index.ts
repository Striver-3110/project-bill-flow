
// Client Types
export interface Client {
  client_id: string;
  client_name: string;
  address: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  contract_start_date: string;
  contract_end_date: string | null;
  payment_terms: string;
  status: 'active' | 'inactive';
}

// Employee Types
export interface Employee {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  hire_date: string;
  designation: string;
  department: string;
  status: 'active' | 'inactive';
  cost_rate: number;
  created_at?: string;
  updated_at?: string;
}

// Project Types
export interface Project {
  project_id: string;
  client_id: string;
  project_name: string;
  project_description: string;
  start_date: string;
  end_date: string | null;
  status: 'active' | 'completed' | 'on-hold';
  project_manager_id: string;
}

// Assignment Types
export interface Assignment {
  assignment_id: string;
  employee_id: string;
  project_id: string;
  start_date: string;
  end_date: string | null;
  billing_rate: number;
  billing_currency: string;
  billing_frequency: 'monthly' | 'hourly';
  status: 'active' | 'completed';
}

// Invoice Types
export interface Invoice {
  invoice_id: string;
  client_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  payment_date: string | null;
  billing_period_start: string;
  billing_period_end: string;
}

export interface InvoiceLineItem {
  line_item_id: string;
  invoice_id: string;
  assignment_id: string;
  employee_id: string;
  project_id: string;
  service_description: string;
  quantity: number;
  rate: number;
  amount: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
}

// Payment Types
export interface Payment {
  payment_id: string;
  invoice_id: string;
  payment_date: string;
  payment_amount: number;
  payment_method: string;
  transaction_reference: string;
  notes: string | null;
}

// Rate Types
export interface Rate {
  rate_id: string;
  employee_id: string;
  client_id: string;
  project_id: string;
  rate_type: 'standard' | 'overtime' | 'weekend';
  effective_from: string;
  effective_to: string | null;
  rate_amount: number;
  currency: string;
}

// Dashboard Statistics Type
export interface DashboardStats {
  totalInvoiced: number;
  totalPaid: number;
  totalOverdue: number;
  totalDraft: number;
  recentInvoices: Invoice[];
  upcomingInvoices: Invoice[];
  topClients: {
    client: Client;
    totalBilled: number;
  }[];
}
