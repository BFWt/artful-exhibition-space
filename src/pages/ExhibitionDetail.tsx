
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, User, Music, ArrowLeft } from 'lucide-react';
import { getExhibitionById } from '../data/exhibitions';
import ExhibitionTimeline from '../components/ExhibitionTimeline';
import MasonryGallery from '../components/MasonryGallery';

const ExhibitionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const exhibition = getExhibitionById(id || '');
  
  useEffect(() => {
    if (!exhibition) {
      navigate('/archiv', { replace: true });
    }
  }, [exhibition, navigate]);
  
  if (!exhibition) {
    return null;
  }
  
  const {
    title,
    germanDate,
    description,
    coverImage,
    detailImages,
    artist,
    djs,
    timeline,
  } = exhibition;

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <motion.button
          className="group flex items-center space-x-2 text-stone-600 hover:text-stone-900 mb-6 transition-colors"
          onClick={() => navigate('/archiv')}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Zurück zum Archiv</span>
        </motion.button>
        
        {/* Exhibition Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4">
            <motion.span 
              className="tag text-xs mb-2 uppercase tracking-wider"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Vergangene Ausstellung
            </motion.span>
            <motion.h1 
              className="font-serif text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {title}
            </motion.h1>
            
            <div className="flex flex-wrap items-center gap-4 text-stone-600">
              <div className="flex items-center space-x-1">
                <CalendarDays className="h-4 w-4" />
                <span>{germanDate}</span>
              </div>
              
              {artist && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{artist}</span>
                </div>
              )}
              
              {djs && djs.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Music className="h-4 w-4" />
                  <span>{djs.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-stone-600 max-w-prose">{description}</p>
        </motion.div>
        
        {/* Exhibition Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="font-serif text-xl font-medium text-stone-900 mb-4">
              Programm
            </h2>
            <p className="text-sm text-stone-500 mb-2">
              {germanDate}
            </p>
            <ExhibitionTimeline events={timeline} />
          </motion.div>
          
          {/* Gallery */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="font-serif text-xl font-medium text-stone-900 mb-4">
              Impressionen
            </h2>
            
            {detailImages && detailImages.length > 0 ? (
              <MasonryGallery 
                images={[coverImage, ...detailImages]} 
                alt={title} 
              />
            ) : (
              <div className="bg-stone-100 rounded-lg p-8 text-center">
                <p className="text-stone-500">Keine Bilder verfügbar</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionDetail;
