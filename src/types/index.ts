export interface Invoice {
  id: string;
  client_id: string;
  invoice_date: string;
  due_date: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
  items: InvoiceItem[];
  total_amount: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Client {
  client_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  project_id: string;
  client_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'inactive' | 'completed';
  budget: number;
  created_at?: string;
  updated_at?: string;
}

// Update the Employee type to match our schema
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
