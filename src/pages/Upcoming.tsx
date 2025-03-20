
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import ExhibitionCard from '../components/ExhibitionCard';
import { useSupabase, getExhibitionState } from '@/lib/supabase';

const Upcoming = () => {
  const { exhibitions, isLoading } = useSupabase();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter upcoming exhibitions using the date-based logic
  const upcomingExhibitions = exhibitions?.filter(exhibition => 
    getExhibitionState(exhibition) === 'upcoming'
  ) || [];
  
  // Sort upcoming exhibitions by date (closest first)
  const sortedUpcomingExhibitions = [...upcomingExhibitions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Filter exhibitions based on search term
  const filteredExhibitions = sortedUpcomingExhibitions.filter(exhibition => 
    exhibition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exhibition.artist && exhibition.artist.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (exhibition.description && exhibition.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-stone-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Kommende Ausstellungen
          </motion.h1>
          <motion.p 
            className="mt-4 text-stone-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Entdecken Sie die zukünftigen Ausstellungen und Events im Alter Kiosk Berlin
          </motion.p>
        </motion.div>
        
        {/* Search */}
        <motion.div 
          className="max-w-md mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-stone-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-stone-300 rounded-md leading-5 bg-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400 transition duration-150 ease-in-out sm:text-sm"
              placeholder="Suche nach Ausstellungen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>
        
        {/* Exhibitions Grid */}
        {filteredExhibitions.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredExhibitions.map((exhibition) => (
              <ExhibitionCard
                key={exhibition.id}
                exhibition={exhibition}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-stone-500">Keine kommenden Ausstellungen gefunden.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upcoming;
