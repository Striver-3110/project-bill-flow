
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Function to get unique departments from employees
export function useDepartments() {
  const queryClient = useQueryClient();

  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('department')
        .order('department', { ascending: true });

      if (error) {
        console.error("Error fetching departments:", error);
        throw error;
      }

      // Extract unique departments
      const uniqueDepartments = [...new Set(data.map(emp => emp.department))];
      return uniqueDepartments.filter(Boolean); // Filter out null or empty values
    }
  });

  return {
    departments: departments || [],
    isLoading
  };
}
