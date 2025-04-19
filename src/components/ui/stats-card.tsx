import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: number;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
  className
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          card: "border-billflow-blue-200",
          icon: "bg-billflow-blue-100 text-billflow-blue-600"
        };
      case 'success':
        return {
          card: "border-green-200",
          icon: "bg-green-100 text-green-600"
        };
      case 'warning':
        return {
          card: "border-yellow-200",
          icon: "bg-yellow-100 text-yellow-600"
        };
      case 'danger':
        return {
          card: "border-red-200",
          icon: "bg-red-100 text-red-600"
        };
      default:
        return {
          card: "border-billflow-gray-200",
          icon: "bg-billflow-gray-100 text-billflow-gray-600"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={cn(
      "bg-white rounded-lg border p-3 sm:p-4 shadow-sm w-full", 
      styles.card, 
      className
    )}>
      <div className="flex items-start sm:items-center">
        {Icon && (
          <div className={cn("mr-3 sm:mr-4 rounded-full p-2", styles.icon)}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-billflow-gray-500 truncate">
            {title}
          </p>
          <h3 className="text-lg sm:text-2xl font-bold text-billflow-gray-900 mt-1 truncate">
            {value}
          </h3>
          {description && (
            <p className="text-xs sm:text-sm text-billflow-gray-500 mt-1 truncate">
              {description}
            </p>
          )}
          {trend !== undefined && (
            <div className="flex items-center mt-1">
              <span className={cn(
                "text-xs font-medium", 
                trend > 0 ? "text-green-600" : "text-red-600"
              )}>
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
              <span className="text-xs text-billflow-gray-500 ml-1">
                vs last month
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
