
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-serif text-3xl font-medium leading-tight text-stone-900 mb-8">
          Kontakt
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
          <div className="space-y-6">
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
                +49 179 1095619
              </a>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-stone-400" />
              <p className="text-stone-700">
              Grunewaldstr. 27, 12165 Berlin
              </p>
            </div>
            
            <div className="pt-4 mt-6 border-t border-stone-200">
              <p className="text-sm text-stone-500">
                Öffnungszeiten: Bei Veranstaltungen oder nach Vereinbarung
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
