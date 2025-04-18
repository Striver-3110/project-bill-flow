
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  Clock,
  Briefcase,
  Calendar,
  DollarSign,
  UserPlus,
  Search,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmployeeList from "@/components/employees/EmployeeList";
import EmployeeDialog from "@/components/employees/EmployeeDialog";
import { useEmployees, CreateEmployeeInput, UpdateEmployeeInput } from "@/hooks/use-employees";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { employees, isLoading, createEmployee, updateEmployee, deleteEmployee, isCreating, isUpdating, isDeleting } = useEmployees();

  const handleCreateEmployee = (data: CreateEmployeeInput) => {
    createEmployee(data);
    setShowAddDialog(false);
  };

  const filteredEmployees = employees?.filter(
    (employee) =>
      employee.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Recalculate stats based on actual data
  const actualStats = employees ? {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'active').length,
    totalHours: 0, // This would come from time entries
    averageBillableHours: 0, // This would be calculated from time entries
    activeAssignments: 0, // This would come from assignments
    totalProjects: 0, // This would come from projects
  } : employeeStats;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Employees"
          value={actualStats.totalEmployees}
          icon={Users}
          description="All registered employees"
        />
        <StatsCard
          title="Active Employees"
          value={actualStats.activeEmployees}
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

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search employees..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-64 w-full rounded-md" />
        </div>
      ) : (
        <EmployeeList
          employees={filteredEmployees || []}
          onUpdateEmployee={updateEmployee}
          onDeleteEmployee={deleteEmployee}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      )}

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

      <EmployeeDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleCreateEmployee}
        isSubmitting={isCreating}
        mode="create"
      />
    </div>
  );
};

export default Employees;
