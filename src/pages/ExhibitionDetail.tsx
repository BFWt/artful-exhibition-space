
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, User, Music, Clock, Utensils } from 'lucide-react';
import ExhibitionGallery from '../components/ExhibitionGallery';
import { useSupabase, getExhibitionState } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Helper type for grouped program events
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
  
  // Find the exhibition by ID - convert string id to number for comparison
  const exhibition = exhibitions?.find(e => e.id === Number(id));
  
  // If loading
  if (isLoading) {
    return (
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800"></div>
        </div>
      </div>
    );
  }
  
  // If exhibition not found
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
  
  // Determine exhibition state based on dates
  const exhibitionState = getExhibitionState(exhibition);
  
  // Format date display
  const formattedDate = germanEndDate && germanEndDate !== germanDate
    ? `${germanDate} - ${germanEndDate}`
    : germanDate;
  
  // Handle back button
  const handleBack = () => {
    // If it's a current or upcoming exhibition, go back to homepage
    if (exhibitionState === 'current' || exhibitionState === 'upcoming') {
      navigate('/');
    } else {
      // If it's a past exhibition, go to archive
      navigate('/archiv');
    }
  };
  
  // All images for the gallery (cover image + gallery images)
  const allImages = [coverImage, ...(galleryImages || [])].filter(Boolean) as string[];

  // Group program events by date and sort by time
  const groupProgramByDate = (): ProgramByDate[] => {
    if (!program || program.length === 0) return [];

    // Create a map of date -> events
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
    
    // Convert map to array and sort each day's events by start time
    const result = Object.entries(dateMap).map(([date, events]) => {
      // Sort events by start time
      const sortedEvents = [...events].sort((a, b) => {
        if (!a.startTime) return 1;
        if (!b.startTime) return -1;
        return a.startTime.localeCompare(b.startTime);
      });
      
      return { date, events: sortedEvents };
    });
    
    // Sort days chronologically
    result.sort((a, b) => a.date.localeCompare(b.date));
    
    return result;
  };
  
  const programByDate = groupProgramByDate();
  
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8">
          <button 
            onClick={handleBack}
            className="inline-flex items-center text-stone-600 hover:text-stone-900"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Zurück</span>
          </button>
        </div>
        
        {/* Header */}
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
        
        {/* Featured Image */}
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
        
        {/* Content Sections - All displayed in a single vertical layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Left Column: About Exhibition */}
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
          
          {/* Right Column: Contributors */}
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
        
        {/* Gallery Section */}
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
        
        {/* Program Section */}
        {programByDate.length > 0 && (
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <div className="space-y-10 max-w-3xl">
              {programByDate.map((dayGroup, dayIndex) => (
                <div key={dayIndex} className="space-y-4">
                  <h3 className="text-lg font-medium text-stone-800 border-b border-stone-200 pb-2 mb-4">
                    {dayGroup.date}
                  </h3>
                  
                  <div className="space-y-6 pl-2">
                    {dayGroup.events.map((event, eventIndex) => (
                      <div key={eventIndex} className="border-l-2 border-stone-300 pl-4 py-2">
                        <div className="flex flex-col">
                          <div className="flex items-center text-stone-700 font-medium">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}</span>
                          </div>
                          <div className="mt-2">
                            <h3 className="text-lg font-medium">{event.title}</h3>
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
