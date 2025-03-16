
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { CalendarDays, User, Music } from 'lucide-react';
import { Exhibition } from '../data/exhibitions';

interface ExhibitionCardProps {
  exhibition: Exhibition;
  featured?: boolean;
}

const ExhibitionCard: React.FC<ExhibitionCardProps> = ({ exhibition, featured = false }) => {
  const { id, title, germanDate, coverImage, artist, djs } = exhibition;
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Handle mouseMove effect for cards
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };
  
  const maskImage = useMotionTemplate`radial-gradient(300px at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.15), transparent)`;
  
  return (
    <Link to={exhibition.isCurrent || exhibition.isUpcoming ? '/' : `/ausstellung/${id}`}>
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
                <span className="text-xs">{germanDate}</span>
              </div>
              
              <h3 className="font-serif text-lg font-medium text-white">
                {title}
              </h3>
              
              {artist && (
                <div className="flex items-center space-x-2 text-white/90">
                  <User className="h-3.5 w-3.5" />
                  <span className="text-xs">{artist}</span>
                </div>
              )}
              
              {djs && djs.length > 0 && (
                <div className="flex items-center space-x-2 text-white/90">
                  <Music className="h-3.5 w-3.5" />
                  <span className="text-xs">{djs.join(', ')}</span>
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
