
import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, User, Music } from 'lucide-react';
import { Exhibition } from '../data/exhibitions';
import ExhibitionTimeline from './ExhibitionTimeline';

interface CurrentExhibitionProps {
  exhibition: Exhibition;
}

const CurrentExhibition: React.FC<CurrentExhibitionProps> = ({ exhibition }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  
  const {
    title,
    germanDate,
    description,
    coverImage,
    artist,
    djs,
    timeline,
  } = exhibition;

  return (
    <div className="overflow-hidden py-8 md:py-12">
      <motion.div 
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-center mb-6">
          <motion.span 
            className="tag text-xs mb-2 uppercase tracking-wider bg-stone-100 text-stone-700 px-3 py-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Aktuelle Ausstellung
          </motion.span>
          <motion.h2 
            className="mt-2 font-serif text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {title}
          </motion.h2>
        </div>
        
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Exhibition Image */}
          <motion.div 
            className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <img
              src={coverImage || "/placeholder.svg"}
              alt={title}
              className={`h-full w-full object-cover object-center transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Image caption overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="flex flex-col text-white">
                <div className="flex items-center space-x-2 text-white/90 mb-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{germanDate}</span>
                </div>
                {artist && (
                  <div className="flex items-center space-x-2 text-white/90">
                    <User className="h-4 w-4" />
                    <span>{artist}</span>
                  </div>
                )}
                {djs && djs.length > 0 && (
                  <div className="flex items-center space-x-2 text-white/90 mt-1">
                    <Music className="h-4 w-4" />
                    <span>{djs.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Exhibition Details */}
          <motion.div 
            className="flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="mb-4">
              <h3 className="font-serif text-xl font-medium text-stone-900 mb-2">
                Über die Ausstellung
              </h3>
              <p className="text-stone-600">{description}</p>
            </div>
            
            <div className="mt-4">
              <h3 className="font-serif text-xl font-medium text-stone-900 mb-2">
                Programm
              </h3>
              <p className="text-sm text-stone-500 mb-2">
                {germanDate}
              </p>
              <ExhibitionTimeline events={timeline} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CurrentExhibition;
