
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  UserCircle, 
  Settings,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen, toggleSidebar }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Clients", path: "/clients", icon: Users },
    { name: "Projects", path: "/projects", icon: Briefcase },
    { name: "Invoices", path: "/invoices", icon: FileText },
    { name: "Employees", path: "/employees", icon: UserCircle },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  if (isMobile && !isOpen) return null;

  return (
    <div 
      className={cn(
        "bg-white border-r border-billflow-gray-200 h-screen flex flex-col",
        isMobile ? "fixed top-0 left-0 z-50 w-64 shadow-lg" : "w-64"
      )}
    >
      {isMobile && (
        <div className="flex justify-end p-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      <div className="px-6 py-6 flex items-center border-b border-billflow-gray-200">
        <h1 className="text-2xl font-bold text-billflow-blue-600">InvoiceGenius</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
                isActive(item.path)
                  ? "bg-billflow-blue-50 text-billflow-blue-600"
                  : "text-billflow-gray-700 hover:bg-billflow-gray-100"
              )}
            >
              <Icon
                className={cn(
                  "mr-3 h-5 w-5",
                  isActive(item.path)
                    ? "text-billflow-blue-500"
                    : "text-billflow-gray-500"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
