
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProjectMutations = () => {
  const queryClient = useQueryClient();

  const createProject = useMutation({
    mutationFn: async (newProject: any) => {
      console.log("Creating project with data:", newProject);
      const { data, error } = await supabase
        .from("projects")
        .insert(newProject)
        .select()
        .single();

      if (error) {
        console.error("Project creation error:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project_statistics"] });
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ projectId, projectData }: { 
      projectId: string, 
      projectData: any
    }) => {
      const { data, error } = await supabase
        .from("projects")
        .update(projectData)
        .eq("project_id", projectId)
        .select()
        .single();

      if (error) {
        console.error("Project update error:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project_statistics"] });
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("project_id", projectId);

      if (error) {
        console.error("Project deletion error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project_statistics"] });
    },
  });

  return {
    createProject,
    updateProject,
    deleteProject,
  };
};
