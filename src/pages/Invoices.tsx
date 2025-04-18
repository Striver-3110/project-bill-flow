
import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Download, 
  Mail, 
  Filter, 
  FileText, 
  ArrowUpDown,
  Bell,
  Eye,
  Edit,
  Trash,
  Check,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import StatusBadge from "@/components/ui/status-badge";
import { invoices, clients } from "@/data/mockData";
import ReminderDialog from "@/components/ReminderDialog";
import { 
  formatCurrency, 
  formatDate, 
  daysUntilDue, 
  filterInvoicesByStatus,
  sortInvoices
} from "@/utils/invoiceUtils";

const Invoices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<'date' | 'dueDate' | 'amount' | 'status'>('date');
  const [sortAscending, setSortAscending] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);

  // Find client by ID for display
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.client_id === clientId);
    return client ? client.client_name : "Unknown Client";
  };

  // Filter and sort invoices
  const filteredInvoices = filterInvoicesByStatus(
    invoices.filter(invoice =>
      getClientName(invoice.client_id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    statusFilter as any
  );

  const sortedInvoices = sortInvoices(filteredInvoices, sortBy, sortAscending);

  // Toggle sort direction
  const handleSort = (column: 'date' | 'dueDate' | 'amount' | 'status') => {
    if (sortBy === column) {
      setSortAscending(!sortAscending);
    } else {
      setSortBy(column);
      setSortAscending(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-billflow-gray-900">Invoices</h1>
          <p className="text-billflow-gray-500 mt-1">
            Create, manage and track your invoices
          </p>
        </div>
        <Button className="bg-billflow-blue-600 hover:bg-billflow-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Invoice Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center space-x-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-billflow-gray-500">Total</p>
            <p className="text-xl font-bold text-billflow-gray-900">
              {invoices.length}
            </p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-billflow-gray-500">Paid</p>
            <p className="text-xl font-bold text-billflow-gray-900">
              {invoices.filter(inv => inv.status === 'paid').length}
            </p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Mail className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-billflow-gray-500">Sent</p>
            <p className="text-xl font-bold text-billflow-gray-900">
              {invoices.filter(inv => inv.status === 'sent').length}
            </p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-billflow-gray-500">Overdue</p>
            <p className="text-xl font-bold text-billflow-gray-900">
              {invoices.filter(inv => inv.status === 'overdue').length}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-billflow-gray-500" />
            <Input
              type="search"
              placeholder="Search invoices..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="px-3 py-2 border border-billflow-gray-200 rounded-md text-billflow-gray-700 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Invoices List */}
      <div className="bg-white rounded-lg shadow-sm border border-billflow-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-billflow-gray-200">
            <thead className="bg-billflow-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Issue Date
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('dueDate')}
                >
                  <div className="flex items-center">
                    Due Date
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    Amount
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-billflow-gray-200">
              {sortedInvoices.map((invoice) => {
                const dueInfo = daysUntilDue(invoice);
                return (
                  <tr key={invoice.invoice_id} className="hover:bg-billflow-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-billflow-gray-900">
                        {invoice.invoice_number}
                      </div>
                      <div className="text-xs text-billflow-gray-500">
                        {invoice.billing_period_start.split('-')[0]}-{invoice.billing_period_end.split('-')[0]}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-billflow-gray-900">
                        {getClientName(invoice.client_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-billflow-gray-900">
                        {formatDate(invoice.invoice_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-billflow-gray-900">
                        {formatDate(invoice.due_date)}
                      </div>
                      {invoice.status !== 'paid' && (
                        <div className={`text-xs ${dueInfo.overdue ? 'text-red-600' : 'text-billflow-gray-500'}`}>
                          {dueInfo.overdue 
                            ? `${dueInfo.days} days overdue` 
                            : `Due in ${dueInfo.days} days`}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-billflow-gray-900">
                        {formatCurrency(invoice.total_amount, invoice.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" className="text-billflow-blue-600 mr-1">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-billflow-blue-600 mr-1">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-billflow-gray-600 mr-1">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-billflow-gray-600 mr-1">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-billflow-gray-600"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setReminderOpen(true);
                        }}
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {sortedInvoices.length === 0 && (
          <div className="text-center py-10">
            <FileText className="h-10 w-10 text-billflow-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-billflow-gray-900">No invoices found</h3>
            <p className="text-sm text-billflow-gray-500 mt-1">
              Try adjusting your search or create a new invoice
            </p>
            <Button className="mt-3 bg-billflow-blue-600 hover:bg-billflow-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        )}
      </div>
      
      {/* Reminder Dialog */}
      {selectedInvoice && (
        <ReminderDialog
          open={reminderOpen}
          setOpen={setReminderOpen}
          invoice={selectedInvoice}
          clientName={getClientName(selectedInvoice.client_id)}
        />
      )}
    </div>
  );
};

export default Invoices;
