import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, CheckCircle, Clock, AlertCircle, Users, Calendar } from "lucide-react";
import StatsCard from "@/components/ui/stats-card";
import StatusBadge from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
} from "recharts";

// Mock data based on the schema
const projectStats = {
  totalProjects: 24,
  completedProjects: 15,
  ongoingProjects: 7,
  onHoldProjects: 2,
  activeAssignments: 38,
  totalEmployeesAssigned: 45,
};

const statusData = [
  { name: "Active", value: 7, color: "#10B981" },
  { name: "Completed", value: 15, color: "#6366F1" },
  { name: "On Hold", value: 2, color: "#F59E0B" },
];

const recentProjects = [
  {
    id: "1",
    projectName: "Website Redesign",
    clientName: "Tech Corp",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    status: "active" as const,
    assignedEmployees: 5,
  },
  {
    id: "2",
    projectName: "Mobile App Development",
    clientName: "Startup Inc",
    startDate: "2024-02-01",
    endDate: "2024-08-15",
    status: "active" as const,
    assignedEmployees: 8,
  },
  {
    id: "3",
    projectName: "Data Migration",
    clientName: "Corp Solutions",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    status: "completed" as const,
    assignedEmployees: 4,
  },
];

const monthlyHoursData = [
  { month: "Jan", hours: 720 },
  { month: "Feb", hours: 680 },
  { month: "Mar", hours: 750 },
  { month: "Apr", hours: 800 },
  { month: "May", hours: 720 },
  { month: "Jun", hours: 840 },
];

const Projects = () => {
  return (
    <div className="space-y-6">
      {/* Project Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Projects"
          value={projectStats.totalProjects}
          icon={Briefcase}
          description="All projects"
        />
        <StatsCard
          title="Completed"
          value={projectStats.completedProjects}
          icon={CheckCircle}
          description="Successfully delivered"
          variant="success"
        />
        <StatsCard
          title="Active Projects"
          value={projectStats.ongoingProjects}
          icon={Clock}
          description="In progress"
          variant="primary"
        />
        <StatsCard
          title="On Hold"
          value={projectStats.onHoldProjects}
          icon={AlertCircle}
          description="Temporarily paused"
          variant="warning"
        />
        <StatsCard
          title="Active Assignments"
          value={projectStats.activeAssignments}
          icon={Users}
          description="Current assignments"
          variant="primary"
        />
        <StatsCard
          title="Team Members"
          value={projectStats.totalEmployeesAssigned}
          icon={Calendar}
          description="Assigned employees"
          variant="default"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Projects</TabsTrigger>
          <TabsTrigger value="hours">Hours Tracked</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
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
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Team Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        {project.projectName}
                      </TableCell>
                      <TableCell>{project.clientName}</TableCell>
                      <TableCell>{project.startDate}</TableCell>
                      <TableCell>{project.endDate}</TableCell>
                      <TableCell>
                        <StatusBadge status={project.status} />
                      </TableCell>
                      <TableCell>{project.assignedEmployees}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Hours Tracked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyHoursData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projects;
