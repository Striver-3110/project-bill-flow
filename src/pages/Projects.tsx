import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, CheckCircle, Clock, AlertCircle, Users, Calendar, 
  DollarSign, PieChartIcon, BarChart2, FileText, Timer, UserCheck 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import StatsCard from "@/components/ui/stats-card";
import StatusBadge from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NewProjectDialog } from "@/components/projects/NewProjectDialog";
import { useProjects } from "@/hooks/use-projects";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { toast } from "sonner";
import { TimeEntryDialog } from "@/components/ui/timeEntry";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { 
    projects, 
    projectStats, 
    timeEntries,
    isLoadingProjects, 
    deleteProject,
    calculateProjectProgress,
    getMonthlyTimeData
  } = useProjects();
  
  const filteredProjects = projects?.filter(
    project => 
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (project.client?.client_name && project.client.client_name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) ?? [];

  // Project status counts
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
      .reduce((sum, e) => sum + (e.hours || 0) * 100, 0) ?? 0, // Assuming $100/hour rate
  };

  // Status data for pie chart
  const statusData = [
    { name: "Active", value: projectStatistics.activeProjects, color: "#10B981" },
    { name: "Completed", value: projectStatistics.completedProjects, color: "#6366F1" },
    { name: "On Hold", value: projectStatistics.onHoldProjects, color: "#F59E0B" },
  ];

  // Monthly hours data from timeEntries
  const monthlyHoursData = getMonthlyTimeData();

  // Assignment data - will use sample until we have real team data
  const teamAssignmentData = [
    { name: "Engineering", value: 18, color: "#3B82F6" },
    { name: "Design", value: 12, color: "#EC4899" },
    { name: "QA", value: 8, color: "#10B981" },
    { name: "Management", value: 7, color: "#F59E0B" },
  ];

  // Sample top employees until we have real data
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
      {/* Page Header */}
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

      {/* Project Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Projects"
          value={projectStatistics.totalProjects}
          icon={Briefcase}
          description="All projects"
        />
        <StatsCard
          title="Active Projects"
          value={projectStatistics.activeProjects}
          icon={Clock}
          description="In progress"
          variant="primary"
        />
        <StatsCard
          title="Completed"
          value={projectStatistics.completedProjects}
          icon={CheckCircle}
          description="Successfully delivered"
          variant="success"
        />
        <StatsCard
          title="On Hold"
          value={projectStatistics.onHoldProjects}
          icon={AlertCircle}
          description="Temporarily paused"
          variant="warning"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Team Members"
          value={projectStatistics.totalEmployeesAssigned}
          icon={Users}
          description="Assigned employees"
          variant="default"
        />
        <StatsCard
          title="Active Assignments"
          value={activeProjects.reduce((sum, p) => sum + (p.assignments?.length || 0), 0)}
          icon={UserCheck}
          description="Current assignments"
          variant="primary"
        />
        <StatsCard
          title="Total Hours"
          value={projectStatistics.totalHoursLogged.toLocaleString()}
          icon={Timer}
          description="Hours logged"
          variant="default"
        />
        <StatsCard
          title="Billable Amount"
          value={`$${projectStatistics.billableAmount.toLocaleString()}`}
          icon={DollarSign}
          description="Billable revenue"
          variant="success"
        />
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="team">Team Utilization</TabsTrigger>
          <TabsTrigger value="financials">Financial</TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Project Portfolio</CardTitle>
              <CardDescription>
                Overview of all current and recent projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredProjects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Team Size</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => {
                      const stats = projectStats?.find(s => s.project_id === project.project_id);
                      const teamSize = stats?.team_size || project.assignments?.length || 0;

                      return (
                        <TableRow key={project.project_id}>
                          <TableCell className="font-medium">
                            {project.project_name}
                          </TableCell>
                          <TableCell>{project.client?.client_name || "N/A"}</TableCell>
                          <TableCell>
                            {new Date(project.start_date).toLocaleDateString()} to {project.end_date ? new Date(project.end_date).toLocaleDateString() : "N/A"}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={project.status.toLowerCase() as any} />
                          </TableCell>
                          <TableCell>{teamSize}</TableCell>
                          <TableCell>${project.budget.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => toast.info("Edit functionality coming soon!")}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this project? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteProject(project.project_id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? (
                    <p>No projects found matching "{searchTerm}". Try a different search term.</p>
                  ) : (
                    <div className="space-y-3">
                      <p>No projects found. Get started by creating your first project.</p>
                      <NewProjectDialog />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} projects`, 'Count']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Hours Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {monthlyHoursData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyHoursData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} hours`, '']} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="hours" 
                          name="Total Hours" 
                          stroke="#6366F1" 
                          activeDot={{ r: 8 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="billable" 
                          name="Billable Hours" 
                          stroke="#10B981" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <p>No time data available yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Utilization Tab - using sample data since we don't have employee time tracking yet */}
        <TabsContent value="team">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Team Allocation by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={teamAssignmentData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {teamAssignmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} team members`, '']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Utilization</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topEmployees.map((employee, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.role}</TableCell>
                        <TableCell>{employee.hours}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="mr-2">{employee.utilization}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  employee.utilization > 90 
                                    ? "bg-green-600" 
                                    : employee.utilization > 80 
                                    ? "bg-blue-600" 
                                    : "bg-yellow-500"
                                }`}
                                style={{ width: `${employee.utilization}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financials">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Budget vs. Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {filteredProjects.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredProjects.slice(0, 5).map(project => {
                          // Calculate actual spend based on time entries
                          const projectTimeEntries = timeEntries?.filter(e => e.project_id === project.project_id) || [];
                          const actualSpend = projectTimeEntries.reduce((sum, entry) => sum + (entry.hours || 0) * 100, 0);
                          
                          return {
                            name: project.project_name.length > 15 
                              ? project.project_name.substring(0, 15) + '...' 
                              : project.project_name,
                            budget: project.budget,
                            actual: actualSpend
                          };
                        })}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                        <Legend />
                        <Bar dataKey="budget" fill="#6366F1" name="Budget" />
                        <Bar dataKey="actual" fill="#10B981" name="Actual Spend" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <p>No project data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billable Hours Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredProjects.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Billable Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.map((project) => {
                        const projectTimeEntries = timeEntries?.filter(e => e.project_id === project.project_id) || [];
                        const billableHours = projectTimeEntries
                          .filter(entry => entry.billable)
                          .reduce((sum, entry) => sum + (entry.hours || 0), 0);
                        const billableAmount = billableHours * 100; // Assuming $100/hour rate
                        
                        return (
                          <TableRow key={project.project_id}>
                            <TableCell className="font-medium">{project.project_name}</TableCell>
                            <TableCell>{project.client?.client_name || "N/A"}</TableCell>
                            <TableCell>{billableHours.toFixed(1)}</TableCell>
                            <TableCell>${billableAmount.toLocaleString()}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                    <tfoot>
                      <tr className="font-medium text-primary">
                        <td className="p-4">Total</td>
                        <td></td>
                        <td className="p-4">
                          {(timeEntries?.filter(e => e.billable)
                            .reduce((sum, entry) => sum + (entry.hours || 0), 0) || 0).toFixed(1)}
                        </td>
                        <td className="p-4">
                          ${projectStatistics.billableAmount.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No billable hours data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projects;
