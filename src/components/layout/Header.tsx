
import React from "react";
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white border-b border-billflow-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden h-9 w-9 mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="relative md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-billflow-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 h-9 md:w-full bg-billflow-gray-50 border-billflow-gray-200 focus-visible:ring-billflow-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 relative"
          >
            <Bell className="h-5 w-5 text-billflow-gray-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-billflow-blue-500 rounded-full"></span>
          </Button>
          
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-billflow-blue-600 text-white flex items-center justify-center text-sm font-medium">
              JD
            </div>
            <span className="ml-2 text-sm font-medium text-billflow-gray-700 hidden md:block">
              John Doe
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
