import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, DollarSign, BarChart3 } from "lucide-react";
import { ProjectTeam } from "./ProjectTeam";
import { TimeEntryDialog } from "../ui/timeEntry";
import { TimeEntriesTable } from "./TimeEntriesTable";
import { useTimeEntryMutations } from "@/hooks/use-time-entry-mutations";
import { useEmployees } from "@/hooks/use-employees";
import StatusBadge from "../ui/status-badge";
import { useProjects } from "@/hooks/use-projects";
import { format } from "date-fns";

export function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [editTimeEntry, setEditTimeEntry] = React.useState(null);
  const { projects, getProjectTimeEntries } = useProjects();
  const { deleteTimeEntry } = useTimeEntryMutations();
  const { employees } = useEmployees();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project-details', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          client:clients(client_name)
        `)
        .eq("project_id", projectId)
        .single();

      if (error) {
        console.error("Project fetch error:", error);
        throw error;
      }
      
      return data;
    },
    enabled: !!projectId,
  });

  const { data: projectStats } = useQuery({
    queryKey: ['project-stats', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .from("project_statistics")
        .select("*")
        .eq("project_id", projectId)
        .single();

      if (error) {
        console.error("Project stats fetch error:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!projectId,
  });

  const projectTimeEntries = getProjectTimeEntries(projectId || '');

  const handleDeleteTimeEntry = async (timeEntryId: string) => {
    try {
      await deleteTimeEntry.mutateAsync(timeEntryId);
    } catch (error) {
      console.error("Delete time entry error:", error);
    }
  };

  const handleEditTimeEntry = (timeEntry: any) => {
    setEditTimeEntry(timeEntry);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <Button onClick={() => navigate("/projects")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/projects")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{project.project_name}</h1>
          <StatusBadge status={project.status.toLowerCase() as any} className="ml-3" />
        </div>
        <div className="flex items-center gap-2">
          <TimeEntryDialog 
            editEntry={editTimeEntry} 
            onClose={() => setEditTimeEntry(null)} 
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.client?.client_name || "N/A"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                {format(new Date(project.start_date), "dd MMM yyyy")} - {project.end_date ? format(new Date(project.end_date), "dd MMM yyyy") : "Ongoing"}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-2xl font-bold">${project.budget.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {projectStats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{projectStats.progress_percentage || 0}%</span>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${projectStats.progress_percentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectStats.team_size || 0} members</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-2xl font-bold">{projectStats.total_hours || 0} hours</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-6">
        <ProjectTeam projectId={project.project_id} projectName={project.project_name} />
      
        <Card>
          <CardHeader>
            <CardTitle>Time Entries</CardTitle>
            <CardDescription>Time logged on this project</CardDescription>
          </CardHeader>
          <CardContent>
            <TimeEntriesTable 
              timeEntries={projectTimeEntries}
              projects={[project]}
              employees={employees || []}
              onDelete={handleDeleteTimeEntry}
              onEdit={handleEditTimeEntry}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
