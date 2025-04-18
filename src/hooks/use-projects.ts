
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type ProjectStatistics = Database["public"]["Views"]["project_statistics"]["Row"];

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

      if (error) throw error;
      return data;
    },
  });

  const { data: projectStats } = useQuery({
    queryKey: ["project_statistics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_statistics")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  const createProject = useMutation({
    mutationFn: async (newProject: Omit<Project, "project_id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("projects")
        .insert(newProject)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project_statistics"] });
    },
  });

  return {
    projects,
    projectStats,
    isLoadingProjects,
    createProject,
  };
};
