
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { ClientsFilters } from "@/components/clients/ClientsFilters";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { useClients } from "@/hooks/use-clients";

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { data: clients, isLoading, error } = useClients();

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
      <ClientsHeader />
      <ClientsFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ClientsTable clients={filteredClients} onClientUpdated={handleClientUpdated} />
    </div>
  );
};

export default Clients;
