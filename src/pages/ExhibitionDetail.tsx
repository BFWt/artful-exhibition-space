import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, User, Music, Utensils, Clock } from 'lucide-react';
import ExhibitionGallery from '../components/ExhibitionGallery';
import { useSupabase, getExhibitionState } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ProgramByDate {
  date: string;
  events: {
    title: string;
    startTime: string;
    endTime?: string;
    description?: string;
  }[];
}

const ExhibitionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { exhibitions, isLoading, error } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Fehler",
        description: "Die Ausstellung konnte nicht geladen werden.",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  const exhibition = exhibitions?.find(e => e.id === Number(id));
  
  if (isLoading) {
    return (
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800"></div>
        </div>
      </div>
    );
  }
  
  if (!exhibition) {
    return (
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-medium text-stone-900 mb-4">Ausstellung nicht gefunden</h1>
          <p className="text-stone-600 mb-8">Die gesuchte Ausstellung existiert nicht oder wurde entfernt.</p>
          <Link to="/" className="text-stone-800 hover:text-stone-600 font-medium">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    );
  }
  
  const { 
    title, 
    description, 
    germanDate, 
    germanEndDate,
    coverImage, 
    galleryImages, 
    artist, 
    contributors, 
    program,
    subtitle
  } = exhibition;
  
  const exhibitionState = getExhibitionState(exhibition);
  
  const formattedDate = germanEndDate && germanEndDate !== germanDate
    ? `${germanDate} - ${germanEndDate}`
    : germanDate;
  
  const handleBack = () => {
    if (exhibitionState === 'current' || exhibitionState === 'upcoming') {
      navigate('/');
    } else {
      navigate('/archiv');
    }
  };
  
  const allImages = [coverImage, ...(galleryImages || [])].filter(Boolean) as string[];

  const parseGermanDate = (germanDate: string): Date => {
    const parts = germanDate.split(/[\s\.]+/);
    if (parts.length >= 3) {
      const monthNames = [
        'januar', 'februar', 'märz', 'april', 'mai', 'juni',
        'juli', 'august', 'september', 'oktober', 'november', 'dezember'
      ];
      const day = parseInt(parts[0], 10);
      const monthName = parts[1].toLowerCase();
      const month = monthNames.indexOf(monthName);
      const year = parseInt(parts[2], 10);
      
      if (month !== -1) {
        return new Date(year, month, day);
      }
    }
    
    return new Date();
  };

  const groupProgramByDate = (): ProgramByDate[] => {
    if (!program || program.length === 0) return [];

    const dateMap: Record<string, ProgramByDate['events']> = {};
    
    program.forEach(event => {
      if (!event.germanDate) return;
      
      if (!dateMap[event.germanDate]) {
        dateMap[event.germanDate] = [];
      }
      
      dateMap[event.germanDate].push({
        title: event.title,
        startTime: event.startTime || '',
        endTime: event.endTime,
        description: event.description
      });
    });
    
    let result = Object.entries(dateMap).map(([date, events]) => {
      const sortedEvents = [...events].sort((a, b) => {
        if (!a.startTime) return 1;
        if (!b.startTime) return -1;
        return a.startTime.localeCompare(b.startTime);
      });
      
      return { date, events: sortedEvents };
    });
    
    result.sort((a, b) => {
      const dateA = parseGermanDate(a.date);
      const dateB = parseGermanDate(b.date);
      return dateA.getTime() - dateB.getTime();
    });
    
    return result;
  };
  
  const programByDate = groupProgramByDate();
  
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button 
            onClick={handleBack}
            className="inline-flex items-center text-stone-600 hover:text-stone-900"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Zurück</span>
          </button>
        </div>
        
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span 
            className={`tag text-xs inline-block mb-2 uppercase tracking-wider px-3 py-1 ${
              exhibitionState === 'past' ? 'bg-stone-200 text-stone-600' : 
              exhibitionState === 'current' ? 'bg-green-100 text-green-700' :
              'bg-blue-100 text-blue-700'
            }`}
          >
            {exhibitionState === 'past' ? 'Vergangene Ausstellung' : 
             exhibitionState === 'current' ? 'Aktuelle Ausstellung' :
             'Kommende Ausstellung'}
          </span>
          
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-stone-900">
            {title}
          </h1>
          
          {subtitle && (
            <p className="mt-3 text-xl text-stone-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
          
          <p className="mt-4 text-stone-600">
            {formattedDate}
          </p>
          
          <div className="mt-4 flex justify-center space-x-6">
            {artist && (
              <div className="flex items-center text-stone-600">
                <User className="h-4 w-4 mr-1" />
                <span>{artist}</span>
              </div>
            )}
            
            {contributors && contributors.filter(c => c.icon === 'music').length > 0 && (
              <div className="flex items-center text-stone-600">
                <Music className="h-4 w-4 mr-1" />
                <span>
                  {contributors
                    .filter(c => c.icon === 'music')
                    .map(c => c.name)
                    .join(', ')}
                </span>
              </div>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="aspect-[16/9] overflow-hidden rounded-lg">
            <img 
              src={coverImage} 
              alt={title} 
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <motion.div 
            className="md:col-span-2 order-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h2 className="text-2xl font-serif font-medium mb-6 pb-2 border-b border-stone-200">
              Über die Ausstellung
            </h2>
            
            <div className="prose prose-stone prose-lg max-w-none">
              {description.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
          
          {contributors && contributors.length > 0 && (
            <motion.div 
              className="order-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <h2 className="text-2xl font-serif font-medium mb-6 pb-2 border-b border-stone-200">
                Mitwirkende
              </h2>
              
              <div className="flex flex-wrap gap-2">
                {contributors.map((contributor, index) => (
                  <div 
                    key={index}
                    className="bg-stone-100 rounded-full px-3 py-1 text-sm flex items-center"
                  >
                    {contributor.icon === 'music' && <Music className="h-3 w-3 mr-1" />}
                    {contributor.icon === 'user' && <User className="h-3 w-3 mr-1" />}
                    {contributor.icon === 'food' && <Utensils className="h-3 w-3 mr-1" />}
                    <span>{contributor.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        
        {allImages.length > 1 && (
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <h2 className="text-2xl font-serif font-medium mb-6 pb-2 border-b border-stone-200">
              Galerie
            </h2>
            
            <ExhibitionGallery images={allImages} title={title} />
          </motion.div>
        )}
        
        {programByDate.length > 0 && (
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programByDate.map((dayGroup, dayIndex) => (
                <div
                  key={dayIndex}
                  className="bg-white rounded-lg border-2 border-stone-200 shadow-sm p-6 space-y-4"
                >
                  <h3 className="text-lg font-medium text-stone-800 border-b border-stone-200 pb-2 mb-4">
                    {dayGroup.date}
                  </h3>
                  <div className="space-y-6">
                    {dayGroup.events.map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className="border-l-2 border-stone-300 pl-4 py-2"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center text-stone-700 font-medium">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>
                              {event.startTime}
                              {event.endTime ? ` - ${event.endTime}` : ""}
                            </span>
                          </div>
                          <div className="mt-2">
                            <h3 className="text-lg font-medium">
                              {event.title}
                            </h3>
                            {event.description && (
                              <div className="mt-1 text-stone-600">
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
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExhibitionDetail;
