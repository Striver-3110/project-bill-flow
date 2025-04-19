
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ProjectAssignment = {
  assignment_id?: string;
  project_id: string;
  employee_id: string;
  role: string; // Role property is required
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'COMPLETED';
};

export const useProjectAssignments = (projectId?: string) => {
  const queryClient = useQueryClient();
  
  const { data: projectAssignments, isLoading } = useQuery({
    queryKey: ['project-assignments', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from("project_assignments")
        .select(`
          *,
          employee:employees(employee_id, first_name, last_name, designation, department)
        `)
        .eq("project_id", projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Project assignments fetch error:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!projectId,
  });

  const addAssignment = useMutation({
    mutationFn: async (assignment: ProjectAssignment) => {
      // Check if assignment already exists
      const { data: existingAssignments, error: checkError } = await supabase
        .from("project_assignments")
        .select("assignment_id")
        .eq("project_id", assignment.project_id)
        .eq("employee_id", assignment.employee_id)
        .eq("status", "ACTIVE");
        
      if (checkError) {
        console.error("Error checking existing assignments:", checkError);
        throw checkError;
      }
      
      if (existingAssignments && existingAssignments.length > 0) {
        throw new Error("This employee is already assigned to this project");
      }
      
      // Ensure end_date is provided as per schema requirement
      if (!assignment.end_date) {
        throw new Error("End date is required for project assignments");
      }

      const { data, error } = await supabase
        .from("project_assignments")
        .insert(assignment)
        .select()
        .single();

      if (error) {
        console.error("Assignment creation error:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-assignments', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project_statistics'] });
      toast.success("Employee assigned to project successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to assign employee to project");
    },
  });

  const updateAssignment = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProjectAssignment> }) => {
      // Ensure end_date is provided if it's being updated
      if ('end_date' in data && !data.end_date) {
        throw new Error("End date is required for project assignments");
      }

      const { error } = await supabase
        .from("project_assignments")
        .update(data)
        .eq("assignment_id", id);

      if (error) {
        console.error("Assignment update error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-assignments', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project_statistics'] });
      toast.success("Assignment updated successfully");
    },
    onError: () => {
      toast.error("Failed to update assignment");
    },
  });

  const removeAssignment = useMutation({
    mutationFn: async (assignmentId: string) => {
      // Instead of deleting, we update the status to COMPLETED as per schema
      const { error } = await supabase
        .from("project_assignments")
        .update({ status: "COMPLETED" })
        .eq("assignment_id", assignmentId);

      if (error) {
        console.error("Assignment removal error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-assignments', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project_statistics'] });
      toast.success("Employee removed from project");
    },
    onError: () => {
      toast.error("Failed to remove employee from project");
    },
  });

  return {
    projectAssignments,
    isLoading,
    addAssignment,
    updateAssignment,
    removeAssignment,
  };
};
