
import React from "react";
import AddClientDialog from "./AddClientDialog";

export function ClientsHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-billflow-gray-900">Clients</h1>
        <p className="text-billflow-gray-500 mt-1">
          Manage your client relationships
        </p>
      </div>
      <AddClientDialog />
    </div>
  );
}
