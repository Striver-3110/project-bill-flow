
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { NewProjectDialog } from "@/components/projects/NewProjectDialog";
import { useProjects } from "@/hooks/use-projects";
import { toast } from "sonner";
import { TimeEntryDialog } from "@/components/ui/timeEntry";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectAnalytics } from "@/components/projects/ProjectAnalytics";
import { TeamUtilization } from "@/components/projects/TeamUtilization";
import { ProjectFinancials } from "@/components/projects/ProjectFinancials";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { 
    projects, 
    projectStats, 
    timeEntries,
    isLoadingProjects, 
    deleteProject
  } = useProjects();
  
  const filteredProjects = projects?.filter(
    project => 
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (project.client?.client_name && project.client.client_name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) ?? [];

  // Project status counts for analytics
  const activeProjects = projects?.filter(p => p.status === 'ACTIVE') ?? [];
  const completedProjects = projects?.filter(p => p.status === 'COMPLETED') ?? [];
  const onHoldProjects = projects?.filter(p => p.status === 'ON_HOLD') ?? [];

  const projectStatistics = {
    totalProjects: projects?.length ?? 0,
    activeProjects: activeProjects.length,
    completedProjects: completedProjects.length,
    onHoldProjects: onHoldProjects.length,
    totalEmployeesAssigned: projectStats?.reduce((acc, curr) => acc + (curr.team_size || 0), 0) ?? 0,
    totalHoursLogged: timeEntries?.reduce((acc, entry) => acc + (entry.hours || 0), 0) ?? 0,
    totalBudget: projects?.reduce((sum, p) => sum + (p.budget || 0), 0) ?? 0,
    billableAmount: timeEntries?.filter(e => e.billable)
      .reduce((sum, e) => sum + (e.hours || 0) * 100, 0) ?? 0,
  };

  const statusData = [
    { name: "Active", value: projectStatistics.activeProjects, color: "#10B981" },
    { name: "Completed", value: projectStatistics.completedProjects, color: "#6366F1" },
    { name: "On Hold", value: projectStatistics.onHoldProjects, color: "#F59E0B" },
  ];

  const monthlyHoursData = getMonthlyTimeData();

  const teamAssignmentData = [
    { name: "Engineering", value: 18, color: "#3B82F6" },
    { name: "Design", value: 12, color: "#EC4899" },
    { name: "QA", value: 8, color: "#10B981" },
    { name: "Management", value: 7, color: "#F59E0B" },
  ];

  const topEmployees = [
    { name: "David Anderson", hours: 168, utilization: 96, role: "Senior Developer" },
    { name: "Lisa Martinez", hours: 160, utilization: 92, role: "Project Manager" },
    { name: "James Wilson", hours: 155, utilization: 88, role: "UX Designer" },
    { name: "Emily Taylor", hours: 150, utilization: 86, role: "Business Analyst" },
  ];

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject.mutateAsync(projectId);
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Delete project error:", error);
      toast.error("Failed to delete project");
    }
  };

  if (isLoadingProjects) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects Dashboard</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px]"
          />
          <TimeEntryDialog />
          <NewProjectDialog />
        </div>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="team">Team Utilization</TabsTrigger>
          <TabsTrigger value="financials">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Project Portfolio</CardTitle>
              <CardDescription>
                Overview of all current and recent projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectList 
                projects={filteredProjects}
                projectStats={projectStats}
                handleDeleteProject={handleDeleteProject}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <ProjectAnalytics 
            statusData={statusData}
            monthlyHoursData={monthlyHoursData}
          />
        </TabsContent>

        <TabsContent value="team">
          <TeamUtilization 
            teamAssignmentData={teamAssignmentData}
            topEmployees={topEmployees}
          />
        </TabsContent>

        <TabsContent value="financials">
          <ProjectFinancials 
            projects={filteredProjects}
            timeEntries={timeEntries}
            projectStatistics={projectStatistics}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projects;
