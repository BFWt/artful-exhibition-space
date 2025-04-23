
import React from 'react';
import { motion } from 'framer-motion';

const Impressum = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="prose prose-stone max-w-none"
      >
        <h1 className="font-serif text-3xl font-medium leading-tight text-stone-900 mb-8">
          Impressum
        </h1>
        
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>
          Ronald Korsch<br />
          Alter Kiosk Berlin<br />
          Grunewaldstr. 27<br />
          12165 Berlin
        </p>
        
        <h2>Kontakt</h2>
        <p>
          Telefon: +49 179 1095619<br />
        </p>
      </motion.div>
    </div>
  );
};

export default Impressum;
