
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Employee } from "@/types";

export type CreateEmployeeInput = {
  first_name: string;
  last_name: string;
  email: string;
  hire_date: string;
  designation: string;
  department: string;
  status: 'active' | 'inactive';
  cost_rate: number;
};

export type UpdateEmployeeInput = {
  employee_id: string;
} & Partial<Omit<CreateEmployeeInput, 'email'>>;

export function useEmployees() {
  const queryClient = useQueryClient();

  const { data: employees, isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Employee[];
    }
  });

  const createEmployeeMutation = useMutation({
    mutationFn: async (input: CreateEmployeeInput) => {
      const { data, error } = await supabase
        .from('employees')
        .insert([input])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success("Employee created successfully");
    },
    onError: (error) => {
      console.error("Error creating employee:", error);
      toast.error("Failed to create employee");
    }
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: async (input: UpdateEmployeeInput) => {
      const { employee_id, ...updateData } = input;
      const { data, error } = await supabase
        .from('employees')
        .update(updateData)
        .eq('employee_id', employee_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success("Employee updated successfully");
    },
    onError: (error) => {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee");
    }
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (employeeId: string) => {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('employee_id', employeeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success("Employee deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee");
    }
  });

  return {
    employees,
    isLoading,
    error,
    createEmployee: createEmployeeMutation.mutate,
    updateEmployee: updateEmployeeMutation.mutate,
    deleteEmployee: deleteEmployeeMutation.mutate,
    isCreating: createEmployeeMutation.isPending,
    isUpdating: updateEmployeeMutation.isPending,
    isDeleting: deleteEmployeeMutation.isPending
  };
}
