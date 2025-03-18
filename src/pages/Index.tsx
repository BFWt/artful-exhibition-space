
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import CurrentExhibition from '../components/CurrentExhibition';
import ExhibitionCard from '../components/ExhibitionCard';
import { useSupabase } from '@/lib/supabase';
import { Exhibition as LocalExhibition } from '../data/exhibitions';

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
  
  // Get current exhibition
  const currentExhibition = exhibitions?.find(e => e.state === 'current');
  
  // Get newest past exhibition if no current exhibition
  const newestPastExhibition = !currentExhibition ? 
    exhibitions?.filter(e => e.state === 'past')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0] : null;
  
  // Get upcoming exhibitions and sort by date
  const upcomingExhibitions = exhibitions?.filter(e => e.state === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];
  
  // Display exhibition will be current or the newest past
  const displayExhibition = currentExhibition || newestPastExhibition;
  
  // Convert Supabase Exhibition to LocalExhibition format for CurrentExhibition component
  const adaptExhibitionForUI = (exhibition: any): LocalExhibition => {
    if (!exhibition) return {} as LocalExhibition;
    
    return {
      id: String(exhibition.id), // Convert number to string
      title: exhibition.title || '',
      date: exhibition.date || '',
      germanDate: exhibition.germanDate || '',
      description: exhibition.description || '',
      coverImage: exhibition.coverImage || '',
      detailImages: exhibition.galleryImages || [],
      artist: exhibition.artist || '',
      djs: exhibition.contributors?.filter(c => c.type === 'DJ').map(c => c.name) || [],
      timeline: exhibition.program?.map(p => ({
        time: p.timeframe || `${p.startTime || ''} - ${p.endTime || ''}`,
        title: p.title || '',
        description: p.description || '',
        isKeyMoment: false
      })) || [],
      isCurrent: exhibition.state === 'current',
      isUpcoming: exhibition.state === 'upcoming'
    };
  };
  
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
      
      {/* Current Exhibition or Newest Past Exhibition */}
      {displayExhibition && (
        <Link to={`/ausstellung/${displayExhibition.id}`}>
          <CurrentExhibition 
            exhibition={adaptExhibitionForUI(displayExhibition)}
            isPast={displayExhibition.state === 'past'} 
          />
        </Link>
      )}
      
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
          
          {upcomingExhibitions.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingExhibitions.map((exhibition) => (
                <ExhibitionCard 
                  key={exhibition.id} 
                  exhibition={adaptExhibitionForUI(exhibition)} 
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
