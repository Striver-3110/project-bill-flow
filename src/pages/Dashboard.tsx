
import React, { useState, useEffect } from "react";
import { 
  BarChart as BarChartIcon, 
  FileText, 
  DollarSign, 
  Clock, 
  FileIcon, 
  TrendingUp,
  Users
} from "lucide-react";
import { Card } from "@/components/ui/card";
import StatsCard from "@/components/ui/stats-card";
import StatusBadge from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/utils/invoiceUtils";
import { useProjects } from "@/hooks/use-projects";
import { useInvoices } from "@/hooks/use-invoices";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

// Helper function to ensure status is of the correct type
const getValidStatus = (status: string): "draft" | "pending" | "sent" | "paid" | "overdue" | "active" | "inactive" | "completed" | "on-hold" => {
  switch(status) {
    case 'draft':
      return 'draft';
    case 'pending':
      return 'pending';
    case 'sent':
      return 'sent';
    case 'paid':
      return 'paid';
    case 'overdue':
      return 'overdue';
    case 'active':
      return 'active';
    case 'inactive':
      return 'inactive';
    case 'completed':
      return 'completed';
    case 'on-hold':
      return 'on-hold';
    default:
      // Fallback to draft if unknown status
      return 'draft';
  }
};

const Dashboard = () => {
  const { projects, projectStats, timeEntries, isLoadingProjects, getMonthlyTimeData } = useProjects();
  const { invoices, isLoading: isLoadingInvoices } = useInvoices();
  const [timeFrame, setTimeFrame] = useState('6months');

  // Filter project data
  const activeProjects = projects?.filter(p => p.status === 'ACTIVE') || [];
  const completedProjects = projects?.filter(p => p.status === 'COMPLETED') || [];
  const onHoldProjects = projects?.filter(p => p.status === 'ON_HOLD') || [];

  // Calculate project statistics
  const totalProjects = projects?.length || 0;
  const totalBudget = projects?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0;
  const totalHours = timeEntries?.reduce((sum, entry) => sum + (entry.hours || 0), 0) || 0;

  // Calculate invoice statistics
  const totalInvoiced = invoices?.reduce((sum, inv) => sum + inv.total_amount, 0) || 0;
  const totalPaid = invoices?.filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total_amount, 0) || 0;
  const totalOverdue = invoices?.filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total_amount, 0) || 0;
  const totalDraft = invoices?.filter(inv => inv.status === 'draft')
    .reduce((sum, inv) => sum + inv.total_amount, 0) || 0;

  // Get recent invoices (sorted by date)
  const recentInvoices = [...(invoices || [])]
    .sort((a, b) => new Date(b.invoice_date).getTime() - new Date(a.invoice_date).getTime())
    .slice(0, 5);

  // Get upcoming invoices (due soon but not paid)
  const upcomingInvoices = [...(invoices || [])]
    .filter(inv => 
      (inv.status === 'sent' || inv.status === 'pending') && 
      new Date(inv.due_date) > new Date()
    )
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  // Create top clients from invoice data
  const clientInvoiceMap = new Map();
  invoices?.forEach(invoice => {
    if (!invoice.client_id) return;
    
    if (!clientInvoiceMap.has(invoice.client_id)) {
      clientInvoiceMap.set(invoice.client_id, {
        client_id: invoice.client_id,
        client_name: invoice.client?.client_name || `Client ${invoice.client_id}`,
        total_billed: 0,
        status: 'active'
      });
    }
    
    const clientData = clientInvoiceMap.get(invoice.client_id);
    clientData.total_billed += invoice.total_amount;
  });
  
  const topClients = Array.from(clientInvoiceMap.values())
    .sort((a, b) => b.total_billed - a.total_billed)
    .slice(0, 5);

  // Revenue data for the monthly chart - use real data if available
  const revenueData = getMonthlyRevenueData();

  function getMonthlyRevenueData() {
    if (!invoices || invoices.length === 0) {
      // Fallback to sample data if no invoices
      return [
        { month: 'Jan', revenue: 12500 },
        { month: 'Feb', revenue: 18200 },
        { month: 'Mar', revenue: 22800 },
        { month: 'Apr', revenue: 19500 },
        { month: 'May', revenue: 24700 },
        { month: 'Jun', revenue: 32000 },
      ];
    }
    
    // Group invoices by month
    const monthMap = new Map();
    
    invoices.forEach(invoice => {
      if (!invoice.invoice_date) return;
      
      const date = new Date(invoice.invoice_date);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthMap.has(monthYear)) {
        monthMap.set(monthYear, {
          month: new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString('default', { month: 'short' }),
          revenue: 0
        });
      }
      
      const monthData = monthMap.get(monthYear);
      monthData.revenue += invoice.total_amount;
    });
    
    // Convert map to array and sort by date
    return Array.from(monthMap.values())
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Get last 6 months
  }

  // Project status data for pie chart - use real data
  const projectStatusData = [
    { name: 'Active', value: activeProjects.length, color: '#3B82F6' },
    { name: 'Completed', value: completedProjects.length, color: '#10B981' },
    { name: 'On Hold', value: onHoldProjects.length, color: '#F59E0B' },
  ];

  // Time tracking data from timeEntries
  const timeTrackingData = getMonthlyTimeData();

  // Custom color scheme for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const isLoading = isLoadingProjects || isLoadingInvoices;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-billflow-gray-900">Dashboard</h1>
        <p className="text-billflow-gray-500 mt-1">
          Overview of your projects, invoices and financial performance
        </p>
      </div>

      {/* Project Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Projects"
          value={totalProjects}
          icon={FileText}
          variant="primary"
          trend={8} // Sample trend data for UI display
        />
        <StatsCard
          title="Active Projects"
          value={activeProjects.length}
          icon={TrendingUp}
          variant="success"
          trend={12}
        />
        <StatsCard
          title="Total Budget"
          value={formatCurrency(totalBudget)}
          icon={DollarSign}
          variant="warning"
          trend={5}
        />
        <StatsCard
          title="Total Hours"
          value={`${totalHours.toLocaleString()} hrs`}
          icon={Clock}
          variant="danger"
          trend={3}
        />
      </div>

      {/* Invoice Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Invoiced"
          value={formatCurrency(totalInvoiced)}
          icon={DollarSign}
          variant="primary"
          trend={8}
        />
        <StatsCard
          title="Paid"
          value={formatCurrency(totalPaid)}
          icon={FileText}
          variant="success"
          trend={12}
        />
        <StatsCard
          title="Overdue"
          value={formatCurrency(totalOverdue)}
          icon={Clock}
          variant="danger"
          trend={-5}
        />
        <StatsCard
          title="Drafts"
          value={formatCurrency(totalDraft)}
          icon={FileIcon}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-billflow-gray-900">Monthly Revenue</h2>
            <select 
              className="text-sm border border-billflow-gray-200 rounded-md px-2 py-1"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
            >
              <option value="6months">Last 6 Months</option>
              <option value="year">This Year</option>
              <option value="lastyear">Last Year</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Project Status Distribution */}
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-billflow-gray-900">Project Status Distribution</h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Projects']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-billflow-gray-900">Recent Invoices</h2>
            <a href="/invoices" className="text-sm text-billflow-blue-600 hover:text-billflow-blue-800 font-medium">
              View all
            </a>
          </div>
          <div className="space-y-4">
            {recentInvoices.length > 0 ? (
              recentInvoices.map((invoice) => (
                <div key={invoice.invoice_id} className="flex items-center justify-between border-b border-billflow-gray-100 pb-4 last:border-0">
                  <div>
                    <p className="font-medium text-billflow-gray-900">{invoice.invoice_number}</p>
                    <p className="text-sm text-billflow-gray-500">Due {formatDate(invoice.due_date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-billflow-gray-900">
                      {formatCurrency(invoice.total_amount)}
                    </p>
                    <StatusBadge status={getValidStatus(invoice.status)} className="mt-1" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-billflow-gray-500">
                <p>No recent invoices</p>
              </div>
            )}
          </div>
        </Card>

        {/* Time Tracking */}
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-billflow-gray-900">Weekly Time Tracking</h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeTrackingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value} hrs`} />
                <Tooltip formatter={(value) => [`${value} hours`, '']} />
                <Legend />
                <Line type="monotone" dataKey="hours" stroke="#3B82F6" name="Total Hours" />
                <Line type="monotone" dataKey="billable" stroke="#F59E0B" name="Billable" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top Clients */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-billflow-gray-900">Top Clients</h2>
          <a href="/clients" className="text-sm text-billflow-blue-600 hover:text-billflow-blue-800 font-medium">
            View all
          </a>
        </div>
        <div className="space-y-4">
          {topClients.length > 0 ? (
            topClients.map((client) => (
              <div key={client.client_id} className="flex items-center justify-between border-b border-billflow-gray-100 pb-4 last:border-0">
                <div>
                  <p className="font-medium text-billflow-gray-900">{client.client_name}</p>
                  <p className="text-sm text-billflow-gray-500">Total billed: {formatCurrency(client.total_billed)}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={getValidStatus(client.status)} className="mt-1" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-billflow-gray-500">
              <p>No client data available</p>
            </div>
          )}
        </div>
      </Card>

      {/* Upcoming Invoices */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-billflow-gray-900">Upcoming Invoices</h2>
          <a href="/invoices" className="text-sm text-white bg-billflow-blue-600 hover:bg-billflow-blue-700 font-medium px-3 py-1 rounded-md">
            Create Invoice
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-billflow-gray-200">
            <thead className="bg-billflow-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-billflow-gray-200">
              {upcomingInvoices.length > 0 ? (
                upcomingInvoices.map((invoice) => (
                  <tr key={invoice.invoice_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-billflow-gray-900">
                      {invoice.invoice_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-billflow-gray-500">
                      {invoice.client?.client_name || `Client ${invoice.client_id}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-billflow-gray-500">
                      {formatDate(invoice.invoice_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-billflow-gray-500">
                      {formatDate(invoice.due_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-billflow-gray-900">
                      {formatCurrency(invoice.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={getValidStatus(invoice.status)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-billflow-gray-500">
                    No upcoming invoices
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
