import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTimeEntryMutations = () => {
  const queryClient = useQueryClient();

  const checkForDuplicateEntry = async (employeeId: string, date: string) => {
    const { data, error } = await supabase
      .from("time_entries")
      .select("time_entry_id")
      .eq("employee_id", employeeId)
      .eq("date", date);

    if (error) {
      console.error("Error checking for duplicate entries:", error);
      throw error;
    }

    return data && data.length > 0;
  };

  const addTimeEntry = useMutation({
    mutationFn: async (timeEntry: {
      project_id: string;
      employee_id: string;
      date: string;
      hours: number;
      description?: string;
      billable?: boolean;
    }) => {
      const hasDuplicate = await checkForDuplicateEntry(
        timeEntry.employee_id,
        timeEntry.date
      );

      if (hasDuplicate) {
        throw new Error("A time entry already exists for this employee on the selected date");
      }

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
      toast.success("Time entry added successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add time entry");
    },
  });

  const deleteTimeEntry = useMutation({
    mutationFn: async (timeEntryId: string) => {
      const { error } = await supabase
        .from("time_entries")
        .delete()
        .eq("time_entry_id", timeEntryId);

      if (error) {
        console.error("Time entry deletion error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time_entries"] });
      queryClient.invalidateQueries({ queryKey: ["project_statistics"] });
      toast.success("Time entry deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete time entry");
    },
  });

  const updateTimeEntry = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from("time_entries")
        .update(data)
        .eq("time_entry_id", id);

      if (error) {
        console.error("Time entry update error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time_entries"] });
      queryClient.invalidateQueries({ queryKey: ["project_statistics"] });
      toast.success("Time entry updated successfully");
    },
    onError: () => {
      toast.error("Failed to update time entry");
    },
  });

  return {
    addTimeEntry,
    deleteTimeEntry,
    updateTimeEntry,
  };
};
