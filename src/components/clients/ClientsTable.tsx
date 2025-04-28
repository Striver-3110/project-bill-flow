
import React from "react";
import { Building, Edit, Mail, Phone, Trash, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";
import { formatDate } from "@/utils/invoiceUtils";
import { EditClientDialog } from "./EditClientDialog";
import { DeleteClientDialog } from "./DeleteClientDialog";
import { Client } from "@/types";

interface ClientsTableProps {
  clients: Client[];
  onClientUpdated: () => void;
}

export function ClientsTable({ clients, onClientUpdated }: ClientsTableProps) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-10">
        <Users className="h-10 w-10 text-billflow-gray-400 mx-auto mb-3" />
        <h3 className="text-sm font-medium text-billflow-gray-900">No clients found</h3>
        <p className="text-sm text-billflow-gray-500 mt-1">
          Try adjusting your search or add a new client
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-billflow-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-billflow-gray-200">
          <thead className="bg-billflow-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                Contract Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-billflow-gray-500 uppercase tracking-wider">
                Payment Terms
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
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-billflow-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-billflow-blue-100 flex items-center justify-center">
                      <Building className="h-5 w-5 text-billflow-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-billflow-gray-900">{client.name}</div>
                      <div className="text-sm text-billflow-gray-500 flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        {client.address?.split(',')[0] || 'No address'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-billflow-gray-900">{client.contact_person}</div>
                  <div className="text-sm text-billflow-gray-500 flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    {client.email}
                  </div>
                  <div className="text-sm text-billflow-gray-500 flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {client.phone || 'No phone'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-billflow-gray-900">
                    {formatDate(client.contract_start_date)}
                  </div>
                  {client.contract_end_date && (
                    <div className="text-sm text-billflow-gray-500">
                      to {formatDate(client.contract_end_date)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-billflow-gray-900">{client.payment_terms || 'Not specified'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={(client.status as "active" | "inactive") || 'active'} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <EditClientDialog
                    client={client}
                    onClientUpdated={onClientUpdated}
                    trigger={
                      <Button variant="ghost" size="sm" className="text-billflow-blue-600 mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DeleteClientDialog
                    clientId={client.id}
                    clientName={client.name}
                    onClientDeleted={onClientUpdated}
                    trigger={
                      <Button variant="ghost" size="sm" className="text-billflow-gray-600">
                        <Trash className="h-4 w-4" />
                      </Button>
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
