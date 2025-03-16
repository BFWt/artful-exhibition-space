
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
          Vorname Nachname<br />
          Alter Kiosk Berlin<br />
          Musterstraße 42<br />
          10123 Berlin
        </p>
        
        <h2>Kontakt</h2>
        <p>
          Telefon: +49 30 123 456 789<br />
          E-Mail: info@alterkiosk.berlin
        </p>
        
        <h2>Umsatzsteuer-ID</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
          DE123456789
        </p>
        
        <h2>Redaktionell verantwortlich</h2>
        <p>
          Vorname Nachname<br />
          Musterstraße 42<br />
          10123 Berlin
        </p>
        
        <h2>Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </motion.div>
    </div>
  );
};

export default Impressum;
