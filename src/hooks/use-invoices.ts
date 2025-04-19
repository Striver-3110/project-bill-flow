
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Invoice } from "@/types";

export type CreateInvoiceInput = {
  invoice_number: string;
  client_id: string;
  invoice_date: string;
  due_date: string;
  billing_period_start: string;
  billing_period_end: string;
  status: string;
  currency: string;
  total_amount: number;
  line_items: {
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    amount: number;
    tax_amount: number;
    total_amount: number;
    project_id?: string;
    employee_id?: string;
  }[];
};

export type ClientProjectData = {
  client_id: string;
  client_name: string;
  projects: {
    project_id: string;
    project_name: string;
    status: string;
    employees: {
      employee_id: string;
      full_name: string;
      department: string;
      role: string;
      time_entries: {
        hours: number;
        billable: boolean;
        date: string;
        description: string;
      }[];
      total_hours: number;
      total_billable_amount: number;
      cost_rate: number;
    }[];
  }[];
};

export function useInvoices() {
  const queryClient = useQueryClient();

  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          client:clients(client_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const getClientProjectDataForInvoice = async (
    clientId: string, 
    startDate: string, 
    endDate: string
  ): Promise<ClientProjectData | null> => {
    try {
      // Get client info with more detailed error handling
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, client_name')
        .eq('id', clientId)
        .single();
      
      if (clientError) {
        console.error("Error fetching client data:", clientError);
        toast.error("Failed to fetch client data");
        throw clientError;
      }
      
      // Get projects with detailed status
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          project_id,
          project_name,
          status,
          budget
        `)
        .eq('client_id', clientId);
      
      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
        toast.error("Failed to fetch project data");
        throw projectsError;
      }
      
      if (!projectsData.length) {
        return {
          client_id: clientData.id,
          client_name: clientData.client_name,
          projects: []
        };
      }

      // Enhanced project data fetching
      const projects = await Promise.all(projectsData.map(async (project) => {
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('project_assignments')
          .select(`
            assignment_id,
            employee_id,
            role,
            employee:employees(
              employee_id,
              first_name,
              last_name,
              department,
              cost_rate,
              designation
            )
          `)
          .eq('project_id', project.project_id)
          .eq('status', 'ACTIVE');
        
        if (assignmentsError) {
          console.error("Error fetching assignments:", assignmentsError);
          throw assignmentsError;
        }
        
        // Enhanced employee data processing
        const employees = await Promise.all(assignmentsData.map(async (assignment) => {
          const { data: timeEntriesData, error: timeEntriesError } = await supabase
            .from('time_entries')
            .select('hours, billable, date, description')
            .eq('project_id', project.project_id)
            .eq('employee_id', assignment.employee_id)
            .gte('date', startDate)
            .lte('date', endDate);
          
          if (timeEntriesError) {
            console.error("Error fetching time entries:", timeEntriesError);
            throw timeEntriesError;
          }
          
          // Calculate detailed metrics for each employee
          const billableHours = timeEntriesData.reduce((sum, entry) => 
            sum + (entry.billable ? entry.hours : 0), 0);
          
          const nonBillableHours = timeEntriesData.reduce((sum, entry) => 
            sum + (!entry.billable ? entry.hours : 0), 0);
          
          const totalHours = billableHours + nonBillableHours;
          const costRate = assignment.employee?.cost_rate || 0;
          const totalBillableAmount = billableHours * costRate;
          
          return {
            employee_id: assignment.employee_id,
            full_name: `${assignment.employee.first_name} ${assignment.employee.last_name}`,
            department: assignment.employee.department,
            designation: assignment.employee.designation,
            role: assignment.role,
            time_entries: timeEntriesData.map(entry => ({
              ...entry,
              amount: entry.billable ? entry.hours * costRate : 0
            })),
            total_hours: totalHours,
            billable_hours: billableHours,
            non_billable_hours: nonBillableHours,
            total_billable_amount: totalBillableAmount,
            cost_rate: costRate
          };
        }));
        
        // Calculate project totals
        const projectTotals = employees.reduce((totals, emp) => ({
          totalHours: totals.totalHours + emp.total_hours,
          billableHours: totals.billableHours + emp.billable_hours,
          totalAmount: totals.totalAmount + emp.total_billable_amount
        }), { totalHours: 0, billableHours: 0, totalAmount: 0 });

        return {
          ...project,
          employees: employees.filter(emp => emp.total_hours > 0),
          project_totals: projectTotals
        };
      }));

      return {
        client_id: clientData.id,
        client_name: clientData.client_name,
        projects: projects.filter(p => p.employees.length > 0),
        total_billable_amount: projects.reduce((sum, p) => sum + p.project_totals.totalAmount, 0),
        total_hours: projects.reduce((sum, p) => sum + p.project_totals.totalHours, 0),
        total_billable_hours: projects.reduce((sum, p) => sum + p.project_totals.billableHours, 0)
      };
    } catch (error) {
      console.error("Error fetching client project data:", error);
      toast.error("Failed to fetch project data");
      return null;
    }
  };

  const createInvoiceMutation = useMutation({
    mutationFn: async (input: CreateInvoiceInput) => {
      // Insert invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          invoice_number: input.invoice_number,
          client_id: input.client_id,
          invoice_date: input.invoice_date,
          due_date: input.due_date,
          billing_period_start: input.billing_period_start,
          billing_period_end: input.billing_period_end,
          status: input.status,
          currency: input.currency,
          total_amount: input.total_amount
        })
        .select("invoice_id")
        .single();

      if (invoiceError) throw invoiceError;

      // Insert line items
      for (const item of input.line_items) {
        const { error: lineItemError } = await supabase
          .from("invoice_line_items")
          .insert({
            invoice_id: invoiceData.invoice_id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            amount: item.amount,
            tax_rate: item.tax_rate,
            tax_amount: item.tax_amount,
            total_amount: item.total_amount
          });

        if (lineItemError) throw lineItemError;
      }

      return invoiceData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success("Invoice created successfully");
    },
    onError: (error) => {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    }
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('invoice_id', invoiceId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success("Invoice deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete invoice");
    }
  });

  return {
    invoices,
    isLoading,
    error,
    deleteInvoice: deleteInvoiceMutation.mutate,
    createInvoice: createInvoiceMutation.mutate,
    isCreating: createInvoiceMutation.isPending,
    getClientProjectDataForInvoice
  };
}
