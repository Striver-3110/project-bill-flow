
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, DollarSign, Calendar } from "lucide-react";
import StatsCard from "@/components/ui/stats-card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Mock data - replace with real data when connected to backend
const employeeStats = {
  totalEmployees: 45,
  activeEmployees: 42,
  avgCostRate: 75,
  recentHires: 3,
};

const departmentData = [
  { department: "Engineering", count: 15 },
  { department: "Design", count: 8 },
  { department: "Marketing", count: 6 },
  { department: "Sales", count: 10 },
  { department: "HR", count: 4 },
];

const Employees = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          title="Average Cost Rate"
          value={`$${employeeStats.avgCostRate}`}
          icon={DollarSign}
          description="Per hour"
          variant="warning"
        />
        <StatsCard
          title="Recent Hires"
          value={employeeStats.recentHires}
          icon={Calendar}
          description="Last 30 days"
          variant="primary"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employees by Department</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Employees;
