
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  Clock,
  Briefcase,
  Calendar,
  DollarSign,
} from "lucide-react";
import StatsCard from "@/components/ui/stats-card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data based on the schema
const employeeStats = {
  totalEmployees: 45,
  activeEmployees: 42,
  totalHours: 1640,
  averageBillableHours: 145,
  activeAssignments: 38,
  totalProjects: 12,
};

const timeEntryData = [
  { week: "Week 1", hours: 40 },
  { week: "Week 2", hours: 38 },
  { week: "Week 3", hours: 42 },
  { week: "Week 4", hours: 39 },
];

const projectDistributionData = [
  { name: "Project A", value: 30, color: "#10B981" },
  { name: "Project B", value: 25, color: "#6366F1" },
  { name: "Project C", value: 20, color: "#F59E0B" },
  { name: "Project D", value: 15, color: "#EF4444" },
];

const Employees = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Employees"
          value={employeeStats.totalEmployees}
          icon={Users}
          description="All registered employees"
        />
        <StatsCard
          title="Active Employees"
          value={employeeStats.activeEmployees}
          icon={UserCheck}
          description="Currently active"
          variant="success"
        />
        <StatsCard
          title="Monthly Hours"
          value={employeeStats.totalHours}
          icon={Clock}
          description="Total hours logged"
          variant="warning"
        />
        <StatsCard
          title="Active Assignments"
          value={employeeStats.activeAssignments}
          icon={Briefcase}
          description="Current assignments"
          variant="primary"
        />
        <StatsCard
          title="Avg. Billable Hours"
          value={employeeStats.averageBillableHours}
          icon={DollarSign}
          description="Per employee/month"
          variant="default"
        />
        <StatsCard
          title="Active Projects"
          value={employeeStats.totalProjects}
          icon={Calendar}
          description="Ongoing projects"
          variant="success"
        />
      </div>

      <Tabs defaultValue="timeEntries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeEntries">Time Entries</TabsTrigger>
          <TabsTrigger value="projectDistribution">Project Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeEntries">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Time Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeEntryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projectDistribution">
          <Card>
            <CardHeader>
              <CardTitle>Project Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectDistributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {projectDistributionData.map((entry, index) => (
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
      </Tabs>
    </div>
  );
};

export default Employees;
