
import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'draft' | 'pending' | 'sent' | 'paid' | 'overdue' | 'active' | 'inactive' | 'completed' | 'on-hold';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'draft':
        return "bg-billflow-gray-200 text-billflow-gray-700";
      case 'pending':
        return "bg-yellow-100 text-yellow-700";
      case 'sent':
        return "bg-billflow-blue-100 text-billflow-blue-700";
      case 'paid':
        return "bg-green-100 text-green-700";
      case 'overdue':
        return "bg-red-100 text-red-700";
      case 'active':
        return "bg-green-100 text-green-700";
      case 'inactive':
        return "bg-billflow-gray-200 text-billflow-gray-700";
      case 'completed':
        return "bg-purple-100 text-purple-700";
      case 'on-hold':
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-billflow-gray-200 text-billflow-gray-700";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        getStatusStyles(),
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
