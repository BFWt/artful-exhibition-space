
import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from '../hooks/useTranslation';
import { headerTranslations } from '../translations/header';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { scrollY } = useScroll();
  const headerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const t = useTranslation(headerTranslations);
  
  // Transform header opacity and backdrop blur based on scroll position
  const headerOpacity = useTransform(scrollY, [0, 50], [1, 0.9]);
  const headerBlur = useTransform(scrollY, [0, 50], [0, 8]);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle scroll lock when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <motion.header
      ref={headerRef}
      style={{
        opacity: headerOpacity,
        backdropFilter: `blur(${headerBlur.get()}px)`,
      }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-stone-200/80 bg-background/80"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-between">
            <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
              <span className="sr-only">Alter Kiosk Berlin</span>
              <h1 className="text-lg font-serif font-medium tracking-tight">Alter Kiosk Berlin</h1>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:items-center md:space-x-8">
              <Link 
                to="/" 
                className={`hover-link text-sm font-medium transition-colors hover:text-stone-600 ${location.pathname === '/' ? 'text-stone-900' : 'text-stone-600'}`}
              >
                {t.home}
              </Link>
              <Link 
                to="/kommende" 
                className={`hover-link text-sm font-medium transition-colors hover:text-stone-600 ${location.pathname === '/kommende' ? 'text-stone-900' : 'text-stone-600'}`}
              >
                {t.upcoming}
              </Link>
              <Link 
                to="/archiv" 
                className={`hover-link text-sm font-medium transition-colors hover:text-stone-600 ${location.pathname === '/archiv' ? 'text-stone-900' : 'text-stone-600'}`}
              >
                {t.archive}
              </Link>
              <Link 
                to="/kontakt" 
                className={`hover-link text-sm font-medium transition-colors hover:text-stone-600 ${location.pathname === '/kontakt' ? 'text-stone-900' : 'text-stone-600'}`}
              >
                {t.contact}
              </Link>
              <LanguageToggle />
            </nav>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-stone-500"
              >
                <span className="sr-only">Menü öffnen</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <motion.div 
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMenuOpen ? 1 : 0,
          height: isMenuOpen ? 'auto' : 0
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="space-y-1 px-4 pb-3 pt-2 bg-white border-t border-stone-200">
          <Link
            to="/"
            className={`block py-2 text-base font-medium hover:bg-stone-50 hover:text-stone-700 ${location.pathname === '/' ? 'text-stone-900' : 'text-stone-600'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            {t.home}
          </Link>
          <Link
            to="/kommende"
            className={`block py-2 text-base font-medium hover:bg-stone-50 hover:text-stone-700 ${location.pathname === '/kommende' ? 'text-stone-900' : 'text-stone-600'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            {t.upcoming}
          </Link>
          <Link
            to="/archiv"
            className={`block py-2 text-base font-medium hover:bg-stone-50 hover:text-stone-700 ${location.pathname === '/archiv' ? 'text-stone-900' : 'text-stone-600'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            {t.archive}
          </Link>
          <Link
            to="/kontakt"
            className={`block py-2 text-base font-medium hover:bg-stone-50 hover:text-stone-700 ${location.pathname === '/kontakt' ? 'text-stone-900' : 'text-stone-600'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            {t.contact}
          </Link>
          <div className="py-2">
            <LanguageToggle />
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
