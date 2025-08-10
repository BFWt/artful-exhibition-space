import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';
import AnimatedTransition from './AnimatedTransition';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16">
        <AnimatedTransition location={location.pathname}>
          {children}
        </AnimatedTransition>
      </main>
      
      <footer className="bg-stone-100 border-t border-stone-200 mt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-stone-500">
                &copy; {new Date().getFullYear()} Alter Kiosk Berlin
              </p>
            </div>
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-stone-400 italic">
                Built with Lovable AI Prompting Art
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                to="/kontakt"
                className="text-sm text-stone-500 hover:text-stone-800 hover-link transition-colors"
              >
                Kontakt
              </Link>
              <Link
                to="/impressum"
                className="text-sm text-stone-500 hover:text-stone-800 hover-link transition-colors"
              >
                Impressum
              </Link>
              <Link
                to="/datenschutz"
                className="text-sm text-stone-500 hover:text-stone-800 hover-link transition-colors"
              >
                Datenschutz
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
