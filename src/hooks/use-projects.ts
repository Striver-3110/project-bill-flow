
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProjectMutations } from "./use-project-mutations";
import { useTimeEntryMutations } from "./use-time-entry-mutations";
import { getMonthlyTimeData } from "@/utils/projectCalculations";

export const useProjects = () => {
  const queryClient = useQueryClient();
  
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          client:clients(client_name),
          assignments:project_assignments(
            employee_id,
            role,
            status
          )
        `);

      if (error) {
        console.error("Projects fetch error:", error);
        throw error;
      }
      return data;
    },
  });

  const { data: projectStats } = useQuery({
    queryKey: ["project_statistics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_statistics")
        .select("*");

      if (error) {
        console.error("Project stats fetch error:", error);
        throw error;
      }
      return data;
    },
  });

  const { data: timeEntries } = useQuery({
    queryKey: ["time_entries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("time_entries")
        .select(`
          *,
          employee:employees(first_name, last_name)
        `);

      if (error) {
        console.error("Time entries fetch error:", error);
        throw error;
      }
      return data;
    },
  });

  const { createProject, updateProject, deleteProject } = useProjectMutations();
  const { addTimeEntry } = useTimeEntryMutations();

  const getProjectTimeEntries = (projectId: string) => {
    return timeEntries?.filter(entry => entry.project_id === projectId) || [];
  };

  return {
    projects,
    projectStats,
    timeEntries,
    isLoadingProjects,
    createProject,
    updateProject,
    deleteProject,
    addTimeEntry,
    getProjectTimeEntries,
    getMonthlyTimeData: () => getMonthlyTimeData(timeEntries || []),
    queryClient,
  };
};

