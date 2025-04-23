
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import CurrentExhibition from '../components/CurrentExhibition';
import ExhibitionCard from '../components/ExhibitionCard';
import { useSupabase, getExhibitionState } from '@/lib/supabase';
import { Exhibition } from '@/lib/supabase';

const Index = () => {
  const { exhibitions, isLoading } = useSupabase();
  
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax effect
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  
  // Animate title
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };
  
  const charVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  const titleText = "Alter Kiosk Berlin";
  
  // Categorize exhibitions based on dates
  const categorizeExhibitions = () => {
    if (!exhibitions) return { current: [], upcoming: [], past: [] };
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const categorized = {
      current: [] as Exhibition[],
      upcoming: [] as Exhibition[],
      past: [] as Exhibition[]
    };
    
    exhibitions.forEach(exhibition => {
      const state = getExhibitionState(exhibition);
      if (state === 'current') {
        categorized.current.push(exhibition);
      } else if (state === 'upcoming') {
        categorized.upcoming.push(exhibition);
      } else if (state === 'past') {
        categorized.past.push(exhibition);
      }
    });
    
    // Sort current exhibitions by end date (ascending)
    categorized.current.sort((a, b) => {
      const aEndDate = a.endDate ? new Date(a.endDate) : new Date(a.date);
      const bEndDate = b.endDate ? new Date(b.endDate) : new Date(b.date);
      return aEndDate.getTime() - bEndDate.getTime();
    });
    
    // Sort upcoming exhibitions by start date (ascending)
    categorized.upcoming.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Sort past exhibitions by start date (descending)
    categorized.past.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return categorized;
  };
  
  const { current, upcoming, past } = categorizeExhibitions();
  
  // Display exhibitions will be all current ones or the newest upcoming if no current
  const displayExhibitions = current.length > 0 ? current : upcoming.length > 0 ? [upcoming[0]] : [];
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800"></div>
      </div>
    );
  }
  
  return (
    <>
      {/* Artistic Header */}
      <div className="relative h-[70vh] overflow-hidden" ref={headerRef}>
        <motion.div 
          className="header-art absolute inset-0 z-0"
          style={{ y, opacity }}
        />
        
        <div className="absolute inset-0 bg-stone-900/5 backdrop-blur-xs z-10" />
        
        <div className="relative flex h-full items-center justify-center z-20">
          <div className="text-center">
            <motion.h1 
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-stone-900"
              variants={titleVariants}
              initial="hidden"
              animate="visible"
            >
              {titleText.split('').map((char, index) => (
                <motion.span key={index} variants={charVariants} className="inline-block">
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-lg md:text-xl text-stone-700 max-w-xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              Kunstgalerie & Event-Location
            </motion.p>
          </div>
        </div>
      </div>
      
      {/* CURRENT/NEXT EXHIBITION SECTION HEADER ENTFERNT */}
      {/* {displayExhibitions.length > 0 && (
        <div className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-serif text-3xl font-medium tracking-tight text-stone-900">
                {displayExhibitions.length > 1 ? "Aktuelle Ausstellungen" : 
                  current.length > 0 ? "Aktuelle Ausstellung" : "Nächste Ausstellung"}
              </h2>
            </motion.div>
          </div>
        </div>
      )} */}
      
      {/* Current or Next Upcoming Exhibitions (ohne Label, Artist wird im Component angepasst) */}
      {displayExhibitions.map((exhibition) => (
        <Link key={exhibition.id} to={`/ausstellung/${exhibition.id}`}>
          <CurrentExhibition 
            exhibition={exhibition}
            isPast={getExhibitionState(exhibition) === 'past'} 
          />
        </Link>
      ))}
      
      {/* Upcoming Exhibitions */}
      <div className="bg-stone-50 py-12">
        <motion.div 
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-stone-900">
              Kommende Ausstellungen
            </h2>
            <p className="mt-2 text-stone-600">
              Entdecken Sie unsere bevorstehenden Ausstellungen und Veranstaltungen
            </p>
          </div>
          
          {upcoming.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((exhibition) => (
                <ExhibitionCard 
                  key={exhibition.id} 
                  exhibition={exhibition} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-stone-500">
              Momentan sind keine kommenden Ausstellungen geplant.
              <br />
              Besuchen Sie uns bald wieder für Updates.
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Index;
