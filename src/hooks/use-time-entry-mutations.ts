
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTimeEntryMutations = () => {
  const queryClient = useQueryClient();

  const addTimeEntry = useMutation({
    mutationFn: async (timeEntry: {
      project_id: string;
      employee_id: string;
      date: string;
      hours: number;
      description?: string;
      billable?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("time_entries")
        .insert(timeEntry)
        .select()
        .single();

      if (error) {
        console.error("Time entry creation error:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time_entries"] });
      queryClient.invalidateQueries({ queryKey: ["project_statistics"] });
    },
  });

  return {
    addTimeEntry,
  };
};
