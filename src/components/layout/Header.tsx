import React from 'react';
import { Menu } from 'lucide-react';

type HeaderProps = {
  toggleSidebar: () => void;
};

const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 px-3 text-base sm:h-10 lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </button>
          
          {/* Desktop logo and text */}
          <div className="hidden lg:flex items-center gap-3">
            
            <div className="flex items-end">
              <span className="text-gray-500 mb-1 text-sm">Powered by</span>
              <img 
                src="https://i.ibb.co/Z6nDP1Fx/top.png" 
                alt="Incubyte Logo" 
                className="h-10 w-auto" 
              />
              {/* <span className="text-primary font-semibold ml-1 text-sm">Incubyte</span> */}
            </div>
          </div>
          
          {/* Mobile logo and text */}
          <div className="lg:hidden flex items-center gap-1">
            <img 
              src="https://i.ibb.co/Z6nDP1Fx/top.png" 
              alt="Incubyte Logo" 
              className="h-4 w-auto mr-1" 
            />
            <span className="text-xs text-gray-500">Powered by</span>
            <span className="text-primary font-semibold text-xs">Incubyte</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;