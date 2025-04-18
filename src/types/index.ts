
export interface Invoice {
  id: string;
  invoice_id?: string; // For backward compatibility
  client_id: string;
  invoice_number: string; // Required for ReminderDialog
  invoice_date: string;
  due_date: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'sent'; // Updated to include 'pending'
  items: InvoiceItem[];
  total_amount: number;
  currency: string; // Required for ReminderDialog
  notes?: string;
  created_at?: string;
  updated_at?: string;
  payment_date?: string;
  billing_period_start?: string;
  billing_period_end?: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Client {
  id?: string;
  client_id: string;
  name: string;
  client_name?: string; // For backward compatibility
  email: string;
  contact_email?: string; // For backward compatibility
  phone: string;
  contact_phone?: string; // For backward compatibility
  address: string;
  city: string;
  state: string;
  zip: string;
  contact_person?: string; // For backward compatibility
  contract_start_date?: string; // For backward compatibility
  contract_end_date?: string; // For backward compatibility
  payment_terms?: string; // For backward compatibility
  status?: string; // For backward compatibility
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  project_id: string;
  client_id: string;
  name: string;
  project_name?: string; // For backward compatibility
  description?: string;
  project_description?: string; // For backward compatibility
  start_date: string;
  end_date?: string;
  status: 'active' | 'inactive' | 'completed' | 'on-hold';
  budget: number;
  project_manager_id?: string; // For backward compatibility
  created_at?: string;
  updated_at?: string;
}

export interface Employee {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string; // Added for compatibility with mock data
  hire_date: string;
  designation: string;
  department: string;
  status: 'active' | 'inactive';
  cost_rate: number;
  created_at?: string;
  updated_at?: string;
}

export interface Assignment {
  assignment_id: string;
  employee_id: string;
  project_id: string;
  start_date: string;
  end_date?: string;
  billing_rate: number;
  billing_currency: string;
  billing_frequency: string;
  status: string;
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

export interface Payment {
  payment_id: string;
  invoice_id: string;
  payment_date: string;
  payment_amount: number;
  payment_method: string;
  transaction_reference: string;
  notes: string | null;
}

export interface Rate {
  rate_id: string;
  employee_id: string;
  client_id: string;
  project_id: string;
  rate_type: string;
  effective_from: string;
  effective_to: string | null;
  rate_amount: number;
  currency: string;
}

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
