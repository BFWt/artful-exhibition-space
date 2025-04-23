
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { CalendarDays, User, Music } from 'lucide-react';
import { Exhibition, getExhibitionState } from '@/lib/supabase';

interface ExhibitionCardProps {
  exhibition: Exhibition;
  featured?: boolean;
}

const ExhibitionCard: React.FC<ExhibitionCardProps> = ({ exhibition, featured = false }) => {
  const { id, title, germanDate, germanEndDate, coverImage, artist, contributors } = exhibition;
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Determine the exhibition state based on dates
  const exhibitionState = getExhibitionState(exhibition);
  const isCurrent = exhibitionState === 'current';
  const isUpcoming = exhibitionState === 'upcoming';
  
  // Format date display
  const formattedDate = germanEndDate && germanEndDate !== germanDate
    ? `${germanDate} - ${germanEndDate}`
    : germanDate;
  
  // Handle mouseMove effect for cards
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = event;
    const { left, top } = currentTarget.getBoundingClientRect();
    
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };
  
  const maskImage = useMotionTemplate`radial-gradient(300px at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.15), transparent)`;
  
  // Get music contributors (formerly DJs)
  const musicContributors = contributors?.filter(c => c.icon === 'music').map(c => c.name) || [];
  
  return (
    <Link to={`/ausstellung/${id}`}>
      <motion.div 
        className={`group relative overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md ${featured ? 'aspect-video md:aspect-auto' : 'aspect-[4/3]'}`}
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 transition duration-300 group-hover:opacity-100"
          style={{ opacity: 0.05, backgroundImage: maskImage }}
        />
        
        {/* Image container */}
        <div className="relative h-full w-full overflow-hidden">
          {/* State badge */}
          {(isCurrent || isUpcoming) && (
            <div className="absolute top-2 right-2 z-20">
              <span 
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                  isCurrent 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {isCurrent ? 'Aktuell' : 'Kommend'}
              </span>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
          
          {/* Image */}
          <img
            src={coverImage || "/placeholder.svg"}
            alt={title}
            className={`h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 z-20">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 text-white/90">
                <CalendarDays className="h-3.5 w-3.5" />
                <span className="text-xs">{formattedDate}</span>
              </div>
              
              {artist && (
                <div className="flex items-center space-x-2 text-white/90 mb-1">
                  <User className="h-3.5 w-3.5" />
                  <span className="text-sm font-medium">{artist}</span>
                </div>
              )}

              <h3 className="font-serif text-lg font-medium text-white">
                {title}
              </h3>
              
              {musicContributors.length > 0 && (
                <div className="flex items-center space-x-2 text-white/90">
                  <Music className="h-3.5 w-3.5" />
                  <span className="text-xs">{musicContributors.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ExhibitionCard;
