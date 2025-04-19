
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface Project {
  project_id: string;
  project_name: string;
  client?: { client_name: string };
  budget: number;
}

interface ProjectFinancialsProps {
  projects: Project[];
  timeEntries: any[];
  projectStatistics: {
    billableAmount: number;
  };
}

export const ProjectFinancials = ({
  projects,
  timeEntries,
  projectStatistics,
}: ProjectFinancialsProps) => {
  const getBillableData = (project: Project) => {
    const projectTimeEntries = timeEntries?.filter(e => e.project_id === project.project_id) || [];
    const billableHours = projectTimeEntries
      .filter(entry => entry.billable)
      .reduce((sum, entry) => sum + (entry.hours || 0), 0);
    const billableAmount = billableHours * 100; // Assuming $100/hour rate
    
    return {
      billableHours,
      billableAmount
    };
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Project Budget vs. Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            {projects.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={projects.slice(0, 5).map(project => {
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
          {projects.length > 0 ? (
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
                {projects.map((project) => {
                  const { billableHours, billableAmount } = getBillableData(project);
                  
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
  );
};
