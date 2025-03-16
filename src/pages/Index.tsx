
import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CurrentExhibition from '../components/CurrentExhibition';
import ExhibitionCard from '../components/ExhibitionCard';
import { getCurrentExhibition, getUpcomingExhibitions } from '../data/exhibitions';

const Index = () => {
  const currentExhibition = getCurrentExhibition();
  const upcomingExhibitions = getUpcomingExhibitions();
  
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
      
      {/* Current Exhibition */}
      {currentExhibition && (
        <CurrentExhibition exhibition={currentExhibition} />
      )}
      
      {/* Upcoming Exhibitions */}
      {upcomingExhibitions.length > 0 && (
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
            
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingExhibitions.map((exhibition) => (
                <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Index;
