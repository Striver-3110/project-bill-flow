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
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
            >
              <path
                d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Toggle Menu</span>
          </button>
          
          <div className="flex items-center gap-2 hidden lg:flex">
            <img 
              src="https://ibb.co/Y7zsMT1h" 
              alt="Incubyte Logo" 
              className="h-8 w-auto" 
            />
            <div className="font-medium text-lg flex items-center">
              <span className="text-gray-500">Powered by</span>
              <span className="text-primary font-bold ml-1">Incubyte</span>
            </div>
          </div>
          
          {/* Mobile logo and text */}
          <div className="lg:hidden flex items-center gap-1">
            <span className="text-sm text-gray-500">Powered by</span>
            <span className="text-primary font-bold text-sm">Incubyte</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;