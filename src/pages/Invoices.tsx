
import React, { useState } from "react";
import { 
  Search, 
  Eye,
  Edit,
  Trash,
  Mail,
  Download,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import StatusBadge from "@/components/ui/status-badge";
import { CreateInvoiceSheet } from "@/components/invoices/CreateInvoiceSheet";
import { InvoiceStats } from "@/components/invoices/InvoiceStats";
import { useInvoices } from "@/hooks/use-invoices";
import { formatCurrency, formatDate } from "@/utils/invoiceUtils";
import { Invoice } from "@/types";
import { EditInvoiceDialog } from "@/components/invoices/EditInvoiceDialog";
import { ViewInvoiceDialog } from "@/components/invoices/ViewInvoiceDialog";
import { MailInvoiceDialog } from "@/components/invoices/MailInvoiceDialog";
import { DownloadInvoiceDialog } from "@/components/invoices/DownloadInvoiceDialog";
import { PrintInvoiceDialog } from "@/components/invoices/PrintInvoiceDialog";

const Invoices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { invoices, isLoading, error, deleteInvoice, refetch } = useInvoices();

  const filteredInvoices = invoices?.filter(invoice => 
    invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.client.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  const stats = {
    total: filteredInvoices.length,
    paid: filteredInvoices.filter(inv => inv.status === 'paid').length,
    sent: filteredInvoices.filter(inv => inv.status === 'sent').length,
    overdue: filteredInvoices.filter(inv => inv.status === 'overdue').length,
  };

  const getValidStatus = (status: string): "paid" | "sent" | "overdue" | "draft" | "active" | "inactive" | "completed" | "on-hold" => {
    switch(status) {
      case 'paid':
        return 'paid';
      case 'sent':
        return 'sent';
      case 'overdue':
        return 'overdue';
      case 'draft':
        return 'draft';
      default:
        return 'draft';
    }
  };
  
  const mapToInvoiceType = (dbInvoice: any): Invoice => {
    return {
      id: dbInvoice.invoice_id,
      invoice_id: dbInvoice.invoice_id,
      client_id: dbInvoice.client_id,
      invoice_number: dbInvoice.invoice_number,
      invoice_date: dbInvoice.invoice_date,
      due_date: dbInvoice.due_date,
      status: dbInvoice.status,
      items: [],
      total_amount: dbInvoice.total_amount,
      currency: dbInvoice.currency,
      client: dbInvoice.client,
      notes: dbInvoice.notes,
      created_at: dbInvoice.created_at,
      updated_at: dbInvoice.updated_at,
      payment_date: dbInvoice.payment_date,
      billing_period_start: dbInvoice.billing_period_start,
      billing_period_end: dbInvoice.billing_period_end,
    };
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading invoices: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-y-auto scrollbar-none">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-billflow-gray-900">Invoices</h1>
          <p className="text-billflow-gray-500 mt-1">
            Manage and track your invoices
          </p>
        </div>
        <CreateInvoiceSheet />
      </div>

      <InvoiceStats {...stats} />

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
        </div>
      </Card>

      <div className="bg-white rounded-lg shadow-sm border border-billflow-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-billflow-gray-200">
            <thead className="bg-billflow-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                  Invoice Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-billflow-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    Loading invoices...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((dbInvoice) => {
                  const invoice = mapToInvoiceType(dbInvoice);
                  return (
                    <tr key={invoice.invoice_id} className="hover:bg-billflow-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-billflow-gray-900">
                          {invoice.invoice_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-billflow-gray-900">
                          {invoice.client?.client_name}
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-billflow-gray-900">
                          {formatCurrency(invoice.total_amount, invoice.currency)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={getValidStatus(invoice.status)} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <ViewInvoiceDialog 
                          invoice={invoice}
                          trigger={
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-billflow-blue-600 mr-1"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          }
                        />
                        
                        <EditInvoiceDialog 
                          invoice={invoice} 
                          onInvoiceUpdated={refetch}
                          trigger={
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-billflow-blue-600 mr-1"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          }
                        />
                        
                        <MailInvoiceDialog 
                          invoice={invoice}
                          trigger={
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-billflow-gray-600 mr-1"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          }
                        />
                        
                        <DownloadInvoiceDialog 
                          invoice={invoice}
                          trigger={
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-billflow-gray-600 mr-1"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          }
                        />
                        
                        <PrintInvoiceDialog 
                          invoice={invoice}
                          trigger={
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-billflow-gray-600 mr-1"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          }
                        />
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => deleteInvoice(invoice.invoice_id || invoice.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
