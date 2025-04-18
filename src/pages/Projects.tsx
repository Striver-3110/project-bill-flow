
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, CheckCircle, Clock, AlertCircle } from "lucide-react";
import StatsCard from "@/components/ui/stats-card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

// Mock data - replace with real data when connected to backend
const projectStats = {
  totalProjects: 24,
  completedProjects: 15,
  ongoingProjects: 7,
  onHoldProjects: 2,
};

const statusData = [
  { name: "Active", value: 7, color: "#10B981" },
  { name: "Completed", value: 15, color: "#6366F1" },
  { name: "On Hold", value: 2, color: "#F59E0B" },
];

const Projects = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          title="Ongoing"
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
      </div>

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
    </div>
  );
};

export default Projects;
