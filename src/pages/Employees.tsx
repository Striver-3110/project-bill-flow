import React, { useState, useMemo } from "react";
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
  Filter,
  Download,
  FileText,
  Building,
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
  Legend,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmployeeList from "@/components/employees/EmployeeList";
import EmployeeDialog from "@/components/employees/EmployeeDialog";
import { useEmployees, CreateEmployeeInput, UpdateEmployeeInput } from "@/hooks/use-employees";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/hooks/use-projects";

const CHART_COLORS = [
  "#10B981", "#6366F1", "#F59E0B", "#EF4444", "#8B5CF6", 
  "#EC4899", "#0EA5E9", "#14B8A6", "#F97316", "#A855F7"
];

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { 
    employees, 
    isLoading, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee, 
    isCreating, 
    isUpdating, 
    isDeleting 
  } = useEmployees();
  const { projects } = useProjects();

  const handleCreateEmployee = (data: CreateEmployeeInput) => {
    createEmployee(data);
    setShowAddDialog(false);
  };

  const filteredEmployees = employees
    ?.filter(employee => 
      (employee.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       employee.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
       employee.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
       employee.department.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!departmentFilter || departmentFilter === "all" || employee.department.toLowerCase() === departmentFilter.toLowerCase()) &&
      (!statusFilter || statusFilter === "all" || employee.status === statusFilter)
    );

  const departmentData = useMemo(() => {
    if (!employees || employees.length === 0) return [];
    
    const departmentCounts: { [key: string]: number } = {};
    employees.forEach(emp => {
      if (emp.department) {
        departmentCounts[emp.department] = (departmentCounts[emp.department] || 0) + 1;
      }
    });
    
    return Object.entries(departmentCounts).map(([name, value], index) => ({
      name,
      value,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }));
  }, [employees]);

  const employeeStats = useMemo(() => ({
    totalEmployees: employees?.length || 0,
    activeEmployees: employees?.filter(e => e.status === 'active').length || 0,
    averageCostRate: employees?.length 
      ? employees.reduce((sum, e) => sum + e.cost_rate, 0) / employees.length 
      : 0,
    totalDepartments: departmentData.length,
    totalHours: 1640,
    totalProjects: 12,
    assignedEmployees: employees?.filter(emp => 
      projects?.some(project => 
        project.assignments?.some(assignment => 
          assignment.employee_id === emp.employee_id && assignment.status === 'ACTIVE'
        )
      )
    ).length || 0,
  }), [employees, departmentData.length, projects]);

  const costRateData = useMemo(() => {
    if (!employees || employees.length === 0) return [];
    
    return employees
      .slice(0, 8)
      .map(emp => ({
        name: `${emp.first_name.charAt(0)}. ${emp.last_name}`,
        rate: emp.cost_rate
      }))
      .sort((a, b) => b.rate - a.rate);
  }, [employees]);

  const handleExportEmployees = () => {
    const headers = ["First Name", "Last Name", "Email", "Phone", "Department", "Designation", "Status", "Cost Rate"];
    const csvContent = [
      headers.join(","),
      ...filteredEmployees.map(emp => [
        emp.first_name,
        emp.last_name,
        emp.email,
        emp.phone || "",
        emp.department,
        emp.designation,
        emp.status,
        emp.cost_rate,
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "employees.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 overflow-y-auto scrollbar-none">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportEmployees}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Add Employee</span>
          </Button>
        </div>
      </div>

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
          title="Project Assignments"
          value={`${employeeStats.assignedEmployees} / ${employeeStats.totalEmployees}`}
          icon={Briefcase}
          description="Employees assigned to projects"
          variant="primary"
        />
        <StatsCard
          title="Avg. Cost Rate"
          value={`$${employeeStats.averageCostRate.toFixed(2)}`}
          icon={DollarSign}
          description="Per hour/employee"
          variant="default"
        />
        <StatsCard
          title="Departments"
          value={employeeStats.totalDepartments}
          icon={Building}
          description="Active departments"
          variant="success"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="w-full sm:max-w-md flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search employees..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={departmentFilter || "all"}
            onValueChange={(value) => setDepartmentFilter(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {[...new Set(employees?.map(e => e.department))].map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={statusFilter || "all"}
            onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              setSearchQuery("");
              setDepartmentFilter(null);
              setStatusFilter(null);
            }}
            title="Clear Filters"
          >
            <Filter className="h-4 w-4" />
          </Button>
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

      <Tabs defaultValue="departments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="departments">Department Distribution</TabsTrigger>
          <TabsTrigger value="costRates">Cost Rates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {departmentData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">No department data available</p>
                </div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => 
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip formatter={(value) => [`${value} employees`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costRates">
          <Card>
            <CardHeader>
              <CardTitle>Employee Cost Rates</CardTitle>
            </CardHeader>
            <CardContent>
              {costRateData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">No cost rate data available</p>
                </div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, "Hourly Rate"]} />
                      <Bar dataKey="rate" fill="#6366F1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
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
