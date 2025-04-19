import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { NewProjectDialog } from "@/components/projects/NewProjectDialog";
import { useProjects } from "@/hooks/use-projects";
import { toast } from "sonner";
import { TimeEntryDialog } from "@/components/ui/timeEntry";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { ProjectAnalytics } from "@/components/projects/ProjectAnalytics";
import { TeamUtilization } from "@/components/projects/TeamUtilization";
import { ProjectFinancials } from "@/components/projects/ProjectFinancials";
import { TimeEntriesTable } from "@/components/projects/TimeEntriesTable";
import { useTimeEntryMutations } from "@/hooks/use-time-entry-mutations";
import { useEmployees } from "@/hooks/use-employees";

const ProjectsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTimeEntry, setEditingTimeEntry] = useState(null);
  const { 
    projects, 
    projectStats, 
    timeEntries,
    isLoadingProjects, 
    deleteProject,
    getMonthlyTimeData
  } = useProjects();
  const { deleteTimeEntry } = useTimeEntryMutations();
  const { employees } = useEmployees();
  
  const filteredProjects = projects?.filter(
    project => 
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (project.client?.client_name && project.client.client_name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) ?? [];

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

  const teamAssignmentData = React.useMemo(() => {
    const departmentCounts: Record<string, number> = {};
    const departments = new Set<string>();
    
    employees?.forEach(emp => {
      if (emp.department) {
        departments.add(emp.department);
      }
    });
    
    departments.forEach(dept => {
      departmentCounts[dept] = 0;
    });
    
    projects?.forEach(project => {
      project.assignments?.forEach(assignment => {
        if (assignment.employee_id && assignment.status === "ACTIVE") {
          const employee = employees?.find(e => e.employee_id === assignment.employee_id);
          if (employee?.department) {
            departmentCounts[employee.department] = (departmentCounts[employee.department] || 0) + 1;
          }
        }
      });
    });
    
    const departmentColors: Record<string, string> = {
      "Engineering": "#3B82F6",
      "Design": "#EC4899",
      "Development": "#10B981",
      "QA": "#F59E0B",
      "Management": "#6366F1",
      "Business": "#8B5CF6",
    };
    
    return Object.entries(departmentCounts).map(([name, value]) => ({
      name,
      value,
      color: departmentColors[name] || "#64748B"
    }));
  }, [projects, employees]);

  const topEmployees = React.useMemo(() => {
    const employeeHours: Record<string, number> = {};
    
    timeEntries?.forEach(entry => {
      if (entry.employee_id) {
        employeeHours[entry.employee_id] = (employeeHours[entry.employee_id] || 0) + entry.hours;
      }
    });
    
    const sortedEmployees = Object.entries(employeeHours)
      .map(([employeeId, hours]) => {
        const employee = employees?.find(e => e.employee_id === employeeId);
        return {
          id: employeeId,
          name: employee ? `${employee.first_name} ${employee.last_name}` : "Unknown Employee",
          hours,
          utilization: Math.min(Math.round((hours / 160) * 100), 100),
          role: employee?.designation || "Unknown Role"
        };
      })
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);
      
    return sortedEmployees;
  }, [timeEntries, employees]);

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject.mutateAsync(projectId);
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Delete project error:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleDeleteTimeEntry = async (timeEntryId: string) => {
    try {
      await deleteTimeEntry.mutateAsync(timeEntryId);
    } catch (error) {
      console.error("Delete time entry error:", error);
    }
  };

  const handleEditTimeEntry = (timeEntry: any) => {
    setEditingTimeEntry(timeEntry);
  };

  if (isLoadingProjects) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-y-auto scrollbar-none">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects Dashboard</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px]"
          />
          <TimeEntryDialog 
            editEntry={editingTimeEntry} 
            onClose={() => setEditingTimeEntry(null)} 
          />
          <NewProjectDialog />
        </div>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="time-entries">Time Entries</TabsTrigger>
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

        <TabsContent value="time-entries">
          <Card>
            <CardHeader>
              <CardTitle>Time Entries</CardTitle>
              <CardDescription>
                View and manage all time entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TimeEntriesTable
                timeEntries={timeEntries || []}
                projects={projects || []}
                employees={employees || []}
                onDelete={handleDeleteTimeEntry}
                onEdit={handleEditTimeEntry}
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

const Projects = () => {
  return (
    <Routes>
      <Route path="/" element={<ProjectsDashboard />} />
      <Route path="/:projectId" element={<ProjectDetails />} />
    </Routes>
  );
};

export default Projects;
