
import React from "react";
import { 
  BarChart, 
  FileText, 
  DollarSign, 
  Clock, 
  FileIcon, 
  TrendingUp 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import StatsCard from "@/components/ui/stats-card";
import StatusBadge from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/utils/invoiceUtils";
import { dashboardStats, invoices } from "@/data/mockData";

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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-billflow-gray-900">Dashboard</h1>
        <p className="text-billflow-gray-500 mt-1">
          Overview of your billing and invoice status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Invoiced"
          value={formatCurrency(dashboardStats.totalInvoiced)}
          icon={DollarSign}
          variant="primary"
          trend={8}
        />
        <StatsCard
          title="Paid"
          value={formatCurrency(dashboardStats.totalPaid)}
          icon={FileText}
          variant="success"
          trend={12}
        />
        <StatsCard
          title="Overdue"
          value={formatCurrency(dashboardStats.totalOverdue)}
          icon={Clock}
          variant="danger"
          trend={-5}
        />
        <StatsCard
          title="Drafts"
          value={formatCurrency(dashboardStats.totalDraft)}
          icon={FileIcon}
          variant="warning"
        />
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
            {dashboardStats.recentInvoices.map((invoice) => (
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
            ))}
          </div>
        </Card>

        {/* Top Clients */}
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-billflow-gray-900">Top Clients</h2>
            <a href="/clients" className="text-sm text-billflow-blue-600 hover:text-billflow-blue-800 font-medium">
              View all
            </a>
          </div>
          <div className="space-y-4">
            {dashboardStats.topClients.map(({ client, totalBilled }) => (
              <div key={client.client_id} className="flex items-center justify-between border-b border-billflow-gray-100 pb-4 last:border-0">
                <div>
                  <p className="font-medium text-billflow-gray-900">{client.client_name}</p>
                  <p className="text-sm text-billflow-gray-500">{client.contact_person}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-billflow-gray-900">
                    {formatCurrency(totalBilled)}
                  </p>
                  <StatusBadge status={getValidStatus(client.status || 'active')} className="mt-1" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly Revenue Chart */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-billflow-gray-900">Monthly Revenue</h2>
          <div className="flex space-x-2">
            <select className="text-sm border border-billflow-gray-200 rounded-md px-2 py-1">
              <option>Last 6 Months</option>
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
        </div>
        <div className="h-64 w-full flex items-center justify-center bg-billflow-gray-50 rounded-lg border border-billflow-gray-200">
          <div className="flex flex-col items-center text-billflow-gray-500">
            <BarChart className="h-10 w-10 mb-2" />
            <p>Chart visualization will appear here</p>
          </div>
        </div>
      </Card>

      {/* Upcoming Invoices */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-billflow-gray-900">Upcoming Invoices</h2>
          <button className="text-sm text-white bg-billflow-blue-600 hover:bg-billflow-blue-700 font-medium px-3 py-1 rounded-md">
            Create Invoice
          </button>
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
              {dashboardStats.upcomingInvoices.map((invoice) => (
                <tr key={invoice.invoice_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-billflow-gray-900">
                    {invoice.invoice_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-billflow-gray-500">
                    {/* We would need to fetch the client name based on client_id */}
                    Client {invoice.client_id}
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
              ))}
              {dashboardStats.upcomingInvoices.length === 0 && (
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
