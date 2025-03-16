
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star } from 'lucide-react';
import { TimelineEvent } from '../data/exhibitions';

interface ExhibitionTimelineProps {
  events: TimelineEvent[];
  compact?: boolean;
}

const ExhibitionTimeline: React.FC<ExhibitionTimelineProps> = ({ 
  events,
  compact = false
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="mt-6"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="relative">
        {events.map((event, index) => (
          <motion.div 
            key={index}
            variants={item}
            className={`timeline-item ${event.isKeyMoment ? 'key-moment' : ''} ${compact ? 'pb-4' : 'pb-8'}`}
          >
            <div className={`${event.isKeyMoment ? 'bg-stone-50' : ''} pl-0 ${compact ? 'space-y-0.5' : 'space-y-2'}`}>
              <div className="flex items-center">
                <Clock className={`h-4 w-4 ${event.isKeyMoment ? 'text-stone-700' : 'text-stone-400'} mr-2`} />
                <h4 className={`font-medium ${event.isKeyMoment ? 'text-stone-900' : 'text-stone-700'}`}>
                  {event.time}
                </h4>
                {event.isKeyMoment && (
                  <span className="ml-2">
                    <Star className="h-3.5 w-3.5 text-stone-700" />
                  </span>
                )}
              </div>
              
              <h3 className={`font-serif ${event.isKeyMoment ? 'text-lg font-medium' : 'text-base'} ${compact ? 'text-sm' : ''}`}>
                {event.title}
              </h3>
              
              {!compact && event.description && (
                <p className="text-stone-600 text-sm">{event.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExhibitionTimeline;
