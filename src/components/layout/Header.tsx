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
            <div className="flex items-center">
              {/* Logo container with proper sizing */}
              <div className="relative h-10 w-32 flex items-center">
                {/* Bottom logo image */}
                <img 
                  src="/api/placeholder/120/40" 
                  alt="Bottom logo" 
                  className="object-contain h-8 w-auto"
                /> 
                {/* Top logo image */}
                <img 
                  src="/api/placeholder/120/40" 
                  alt="Top logo" 
                  className="object-contain h-8 w-auto absolute top-1/2 transform -translate-y-1/2 left-0"
                />
              </div>
            </div>
            <div className="font-medium text-lg flex items-center">
              <span className="text-gray-500">Powered by</span>
              <span className="text-primary font-bold ml-1">Incubyte</span>
            </div>
          </div>
          
          {/* Mobile logo and text */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile logo - simplified version */}
            <div className="relative h-8 w-8">
              <img 
                src="https://i.ibb.co/Z6nDP1Fx/top.png" 
                alt="Incubyte Logo" 
                className="h-6 w-auto mr-1" 
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Powered by</span>
              <span className="text-primary font-bold text-sm ml-1">Incubyte</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;