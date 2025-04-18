
import React from "react";
import { Card } from "@/components/ui/card";
import { FileText, Check, Mail, AlertTriangle } from "lucide-react";

interface InvoiceStatsProps {
  total: number;
  paid: number;
  sent: number;
  overdue: number;
}

export function InvoiceStats({ total, paid, sent, overdue }: InvoiceStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4 flex items-center space-x-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-billflow-gray-500">Total</p>
          <p className="text-xl font-bold text-billflow-gray-900">{total}</p>
        </div>
      </Card>
      <Card className="p-4 flex items-center space-x-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <Check className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <p className="text-sm text-billflow-gray-500">Paid</p>
          <p className="text-xl font-bold text-billflow-gray-900">{paid}</p>
        </div>
      </Card>
      <Card className="p-4 flex items-center space-x-4">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <Mail className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <p className="text-sm text-billflow-gray-500">Sent</p>
          <p className="text-xl font-bold text-billflow-gray-900">{sent}</p>
        </div>
      </Card>
      <Card className="p-4 flex items-center space-x-4">
        <div className="p-2 bg-red-100 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <p className="text-sm text-billflow-gray-500">Overdue</p>
          <p className="text-xl font-bold text-billflow-gray-900">{overdue}</p>
        </div>
      </Card>
    </div>
  );
}
