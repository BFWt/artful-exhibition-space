
import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, User, Music, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Exhibition, getExhibitionState } from '@/lib/supabase';
import TruncatedText from '@/components/TruncatedText';

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
    germanDate,
    germanEndDate
  } = exhibition;

  // Determine the exhibition state based on dates
  const exhibitionState = getExhibitionState(exhibition);

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
        <Link to={`/ausstellung/${exhibition.id}`} className="block">
          <div className="text-center mb-6 cursor-pointer hover:opacity-80 transition-opacity">
            <motion.span 
              className={`tag text-xs mb-2 uppercase tracking-wider px-3 py-1 ${
                exhibitionState === 'past' ? 'bg-stone-200 text-stone-600' : 
                exhibitionState === 'current' ? 'bg-green-100 text-green-700' :
                'bg-blue-100 text-blue-700'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {exhibitionState === 'past' ? 'Vergangene Ausstellung' : 
               exhibitionState === 'current' ? 'Aktuell' :
               'Kommend'}
            </motion.span>

            {artist && (
              <motion.p 
                className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-stone-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {artist}
              </motion.p>
            )}
            
            <motion.h2 
              className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-stone-900"
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
        </Link>
        
        {/* IMAGE NUR NOCH OHNE OVERLAY-TEXT */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Link to={`/ausstellung/${exhibition.id}`}>
            <motion.div 
              className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
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
            </motion.div>
          </Link>
          
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
              <TruncatedText text={description} />
            </div>
            
            {/* Program section removed */}
            
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
