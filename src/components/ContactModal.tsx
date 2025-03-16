
import React, { useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactModal: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const handleClose = () => {
    setIsVisible(false);
    document.getElementById('contact-modal')?.classList.add('hidden');
  };
  
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    
    // Custom event listener for opening the modal
    const handleCustomEvent = () => {
      setIsVisible(true);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    document.getElementById('contact-modal')?.addEventListener('click', handleCustomEvent);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      document.getElementById('contact-modal')?.removeEventListener('click', handleCustomEvent);
    };
  }, []);

  return (
    <div id="contact-modal" className="hidden fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-stone-900/75 transition-opacity" />
        
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-6 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6 sm:align-middle"
              ref={modalRef}
            >
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="rounded-md bg-white text-stone-400 hover:text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500"
                  onClick={handleClose}
                >
                  <span className="sr-only">Schließen</span>
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="font-serif text-xl font-medium leading-6 text-stone-900 mb-6">
                    Kontakt
                  </h3>
                  
                  <div className="space-y-6 mt-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-stone-400" />
                      <a 
                        href="mailto:info@alterkiosk.berlin" 
                        className="text-stone-700 hover:text-stone-900 hover-link"
                      >
                        info@alterkiosk.berlin
                      </a>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-stone-400" />
                      <a 
                        href="tel:+4930123456789" 
                        className="text-stone-700 hover:text-stone-900 hover-link"
                      >
                        +49 30 123 456 789
                      </a>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-stone-400" />
                      <p className="text-stone-700">
                        Musterstraße 42, 10123 Berlin
                      </p>
                    </div>
                    
                    <div className="pt-4 mt-6 border-t border-stone-200">
                      <p className="text-sm text-stone-500">
                        Öffnungszeiten: Bei Veranstaltungen oder nach Vereinbarung
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContactModal;
