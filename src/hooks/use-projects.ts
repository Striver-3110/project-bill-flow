
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
        .select("*");

      if (error) {
        console.error("Time entries fetch error:", error);
        throw error;
      }
      return data;
    },
  });

  const createProject = useMutation({
    mutationFn: async (newProject: Omit<Project, "project_id" | "created_at" | "updated_at">) => {
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
      projectData: Partial<Omit<Project, "project_id" | "created_at" | "updated_at">> 
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

  // Calculate project progress
  const calculateProjectProgress = (projectId: string) => {
    if (!projects || !timeEntries) return 0;
    
    const project = projects.find(p => p.project_id === projectId);
    if (!project) return 0;
    
    // Calculate progress based on time entries
    const projectTimeEntries = timeEntries.filter(entry => entry.project_id === projectId);
    const totalHoursLogged = projectTimeEntries.reduce((sum, entry) => sum + (entry.hours || 0), 0);
    
    // Simple progress calculation (can be improved with more sophisticated logic)
    // Assume 100 hours for completion if no budget or other metric is available
    const estimatedTotalHours = 100;
    const progress = Math.min(Math.round((totalHoursLogged / estimatedTotalHours) * 100), 100);
    
    return progress;
  };

  // Prepare chart data
  const getMonthlyTimeData = () => {
    if (!timeEntries) return [];
    
    // Group time entries by month
    const monthMap = new Map();
    
    timeEntries.forEach(entry => {
      if (!entry.date) return;
      
      const date = new Date(entry.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthMap.has(monthYear)) {
        monthMap.set(monthYear, {
          month: new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString('default', { month: 'short' }),
          hours: 0,
          billable: 0
        });
      }
      
      const monthData = monthMap.get(monthYear);
      monthData.hours += entry.hours || 0;
      if (entry.billable) {
        monthData.billable += entry.hours || 0;
      }
    });
    
    // Convert map to array and sort by date
    return Array.from(monthMap.values())
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Get last 6 months
  };

  return {
    projects,
    projectStats,
    timeEntries,
    isLoadingProjects,
    createProject,
    updateProject,
    addTimeEntry,
    calculateProjectProgress,
    getMonthlyTimeData
  };
};
