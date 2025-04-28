
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface ClientsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ClientsFilters({ searchQuery, setSearchQuery }: ClientsFiltersProps) {
  return (
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
  );
}
