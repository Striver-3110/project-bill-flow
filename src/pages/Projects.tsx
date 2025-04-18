
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, CheckCircle, Clock, AlertCircle, Users, Calendar, 
  DollarSign, PieChartIcon, BarChart2, FileText, Timer, UserCheck 
} from "lucide-react";
import StatsCard from "@/components/ui/stats-card";
import StatusBadge from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

// Mock data based on the schema
const projectStats = {
  totalProjects: 24,
  completedProjects: 15,
  ongoingProjects: 7,
  onHoldProjects: 2,
  activeAssignments: 38,
  totalEmployeesAssigned: 45,
  totalHoursLogged: 4280,
  totalBillableAmount: 427600,
};

const statusData = [
  { name: "Active", value: 7, color: "#10B981" },
  { name: "Completed", value: 15, color: "#6366F1" },
  { name: "On Hold", value: 2, color: "#F59E0B" },
];

// Update project statuses to match the expected types in StatusBadge
const recentProjects = [
  {
    id: "1",
    projectName: "Website Redesign",
    clientName: "Tech Solutions Inc.",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    status: "active" as const,
    assignedEmployees: 5,
    budget: 75000,
    hoursLogged: 720,
    percentComplete: 45,
  },
  {
    id: "2",
    projectName: "Mobile App Development",
    clientName: "Startup Inc",
    startDate: "2024-02-01",
    endDate: "2024-08-15",
    status: "active" as const,
    assignedEmployees: 8,
    budget: 120000,
    hoursLogged: 840,
    percentComplete: 35,
  },
  {
    id: "3",
    projectName: "Data Migration",
    clientName: "Corp Solutions",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    status: "completed" as const,
    assignedEmployees: 4,
    budget: 45000,
    hoursLogged: 620,
    percentComplete: 100,
  },
  {
    id: "4",
    projectName: "Security Audit",
    clientName: "Global Services Ltd.",
    startDate: "2024-02-15",
    endDate: "2024-04-15",
    status: "on-hold" as const,
    assignedEmployees: 3,
    budget: 35000,
    hoursLogged: 210,
    percentComplete: 60,
  },
];

const monthlyHoursData = [
  { month: "Jan", hours: 720, billable: 680, target: 800 },
  { month: "Feb", hours: 680, billable: 650, target: 800 },
  { month: "Mar", hours: 750, billable: 720, target: 800 },
  { month: "Apr", hours: 800, billable: 780, target: 800 },
  { month: "May", hours: 720, billable: 700, target: 800 },
  { month: "Jun", hours: 840, billable: 820, target: 800 },
];

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

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredProjects = recentProjects.filter(
    project => project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
              project.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Button>
            <Briefcase className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Project Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Projects"
          value={projectStats.totalProjects}
          icon={Briefcase}
          description="All projects"
        />
        <StatsCard
          title="Active Projects"
          value={projectStats.ongoingProjects}
          icon={Clock}
          description="In progress"
          variant="primary"
        />
        <StatsCard
          title="Completed"
          value={projectStats.completedProjects}
          icon={CheckCircle}
          description="Successfully delivered"
          variant="success"
        />
        <StatsCard
          title="On Hold"
          value={projectStats.onHoldProjects}
          icon={AlertCircle}
          description="Temporarily paused"
          variant="warning"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Team Members"
          value={projectStats.totalEmployeesAssigned}
          icon={Users}
          description="Assigned employees"
          variant="default"
        />
        <StatsCard
          title="Active Assignments"
          value={projectStats.activeAssignments}
          icon={UserCheck}
          description="Current assignments"
          variant="primary"
        />
        <StatsCard
          title="Total Hours"
          value={projectStats.totalHoursLogged.toLocaleString()}
          icon={Timer}
          description="Hours logged"
          variant="default"
        />
        <StatsCard
          title="Billable Amount"
          value={`$${projectStats.totalBillableAmount.toLocaleString()}`}
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Team Size</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        {project.projectName}
                      </TableCell>
                      <TableCell>{project.clientName}</TableCell>
                      <TableCell>
                        {project.startDate} to {project.endDate}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={project.status} />
                      </TableCell>
                      <TableCell>{project.assignedEmployees}</TableCell>
                      <TableCell>${project.budget.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              project.status === "completed" 
                                ? "bg-green-600" 
                                : project.status === "on-hold" 
                                ? "bg-yellow-500" 
                                : "bg-blue-600"
                            }`}
                            style={{ width: `${project.percentComplete}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{project.percentComplete}%</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                        label
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
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
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyHoursData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="hours" stroke="#6366F1" name="Total Hours" />
                      <Line type="monotone" dataKey="billable" stroke="#10B981" name="Billable Hours" />
                      <Line type="monotone" dataKey="target" stroke="#F59E0B" name="Target Hours" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Utilization Tab */}
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
                        label
                      >
                        {teamAssignmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
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
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Website Redesign", budget: 75000, actual: 38000 },
                        { name: "Mobile App", budget: 120000, actual: 42000 },
                        { name: "Data Migration", budget: 45000, actual: 45000 },
                        { name: "Security Audit", budget: 35000, actual: 22000 },
                      ]}
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billable Hours Summary</CardTitle>
              </CardHeader>
              <CardContent>
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
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.projectName}</TableCell>
                        <TableCell>{project.clientName}</TableCell>
                        <TableCell>{project.hoursLogged}</TableCell>
                        <TableCell>${(project.hoursLogged * 100).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <tfoot>
                    <tr className="font-medium text-primary">
                      <td className="p-4">Total</td>
                      <td></td>
                      <td className="p-4">
                        {recentProjects.reduce((sum, p) => sum + p.hoursLogged, 0)}
                      </td>
                      <td className="p-4">
                        ${recentProjects.reduce((sum, p) => sum + p.hoursLogged * 100, 0).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projects;
