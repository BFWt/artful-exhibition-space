import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, User, Music, Coffee } from 'lucide-react';
import { Exhibition } from '@/lib/supabase';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface CurrentExhibitionProps {
  exhibition: Exhibition;
  isPast?: boolean;
}

const CurrentExhibition: React.FC<CurrentExhibitionProps> = ({ exhibition, isPast = false }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  
  const {
    title,
    subtitle,
    description,
    coverImage,
    artist,
    contributors,
    program,
    germanDate,
    germanEndDate
  } = exhibition;

  // Format date range
  const formattedDate = () => {
    if (germanEndDate && germanEndDate !== germanDate) {
      return `${germanDate} - ${germanEndDate}`;
    }
    return germanDate;
  };

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
            className={`tag text-xs mb-2 uppercase tracking-wider px-3 py-1 ${
              isPast ? 'bg-stone-200 text-stone-600' : 'bg-stone-100 text-stone-700'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {isPast ? 'Letzte Ausstellung' : 'Aktuelle Ausstellung'}
          </motion.span>
          <motion.h2 
            className="mt-2 font-serif text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {title}
          </motion.h2>
          <motion.p
            className="mt-2 text-lg text-stone-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {formattedDate()}
          </motion.p>
          {subtitle && (
            <motion.p
              className="mt-2 text-xl text-stone-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
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
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="flex flex-col text-white">
                <div className="flex items-center space-x-2 text-white/90 mb-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formattedDate()}</span>
                </div>
                {artist && (
                  <div className="flex items-center space-x-2 text-white/90">
                    <User className="h-4 w-4" />
                    <span>{artist}</span>
                  </div>
                )}
                {contributors && contributors.length > 0 && contributors.some(c => c.type === 'Music' || c.type === 'Musik') && (
                  <div className="flex items-center space-x-2 text-white/90 mt-1">
                    <Music className="h-4 w-4" />
                    <span>
                      {contributors
                        .filter(c => c.type === 'Music' || c.type === 'Musik')
                        .map(c => c.name)
                        .join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
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
            
            {program && program.length > 0 && (
              <div className="mt-4">
                <h3 className="font-serif text-xl font-medium text-stone-900 mb-2">
                  Programm
                </h3>
                <p className="text-sm text-stone-500 mb-2">
                  {formattedDate()}
                </p>
                <div className="space-y-4">
                  {program.map((event, index) => (
                    <div key={index} className="border-l-2 border-stone-200 pl-4 py-1">
                      <div className="flex flex-col">
                        <div className="flex items-center text-stone-700 font-medium">
                          <span>{event.timeframe}</span>
                        </div>
                        <div className="mt-1">
                          <h4 className="font-medium">{event.title}</h4>
                          {event.description && (
                            <div className="text-sm text-stone-600 mt-1">
                              {event.description.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {contributors && contributors.length > 0 && (
              <div className="mt-6">
                <h3 className="font-serif text-xl font-medium text-stone-900 mb-2">
                  Mitwirkende
                </h3>
                <div className="flex flex-wrap gap-3 mt-2">
                  {contributors.map((contributor, index) => (
                    <div 
                      key={index}
                      className="bg-stone-100 rounded-full px-3 py-1 text-sm flex items-center"
                    >
                      {contributor.icon === 'music' && <Music className="h-3 w-3 mr-1" />}
                      {contributor.icon === 'user' && <User className="h-3 w-3 mr-1" />}
                      {contributor.icon === 'coffee' && <Coffee className="h-3 w-3 mr-1" />}
                      <span className="mr-1 font-medium">{contributor.type}:</span>
                      <span>{contributor.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CurrentExhibition;
