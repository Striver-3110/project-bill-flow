import React, { useState } from "react";
import { Search, Edit, Trash, Mail, Phone, Users, Building, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";
import { formatDate } from "@/utils/invoiceUtils";
import AddClientDialog from "@/components/clients/AddClientDialog";
import { EditClientDialog } from "@/components/clients/EditClientDialog";
import { DeleteClientDialog } from "@/components/clients/DeleteClientDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Client } from "@/types";

type SupabaseClient = {
  id: string;
  client_name: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string | null;
  address: string | null;
  payment_terms: string | null;
  contract_start_date: string;
  contract_end_date: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const mapSupabaseClientToClient = (client: SupabaseClient): Client => {
  return {
    id: client.id,
    client_id: client.id,
    name: client.client_name,
    client_name: client.client_name,
    email: client.contact_email,
    contact_email: client.contact_email,
    phone: client.contact_phone || "",
    contact_phone: client.contact_phone || "",
    address: client.address || "",
    city: "",
    state: "",
    zip: "",
    contact_person: client.contact_person,
    contract_start_date: client.contract_start_date,
    contract_end_date: client.contract_end_date || "",
    payment_terms: client.payment_terms || "",
    status: client.status || "active",
    created_at: client.created_at || "",
    updated_at: client.updated_at || ""
  };
};

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(mapSupabaseClientToClient);
    }
  });

  const handleClientUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['clients'] });
  };

  const filteredClients = clients?.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contact_person.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-billflow-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading clients</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-y-auto scrollbar-none">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-billflow-gray-900">Clients</h1>
          <p className="text-billflow-gray-500 mt-1">
            Manage your client relationships
          </p>
        </div>
        <AddClientDialog />
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-billflow-gray-500" />
            <Input
              type="search"
              placeholder="Search clients..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-billflow-gray-200 rounded-md text-billflow-gray-700 text-sm">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select className="px-3 py-2 border border-billflow-gray-200 rounded-md text-billflow-gray-700 text-sm">
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
        </div>
      </Card>

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
              {filteredClients.map((client) => (
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
                      onClientUpdated={handleClientUpdated}
                      trigger={
                        <Button variant="ghost" size="sm" className="text-billflow-blue-600 mr-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DeleteClientDialog
                      clientId={client.id}
                      clientName={client.name}
                      onClientDeleted={handleClientUpdated}
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
        {filteredClients.length === 0 && (
          <div className="text-center py-10">
            <Users className="h-10 w-10 text-billflow-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-billflow-gray-900">No clients found</h3>
            <p className="text-sm text-billflow-gray-500 mt-1">
              Try adjusting your search or add a new client
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;
