
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, User, Music, Clock } from 'lucide-react';
import ExhibitionGallery from '../components/ExhibitionGallery';
import ExhibitionTimeline from '../components/ExhibitionTimeline';
import { useSupabase, getExhibitionState } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const ExhibitionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { exhibitions, isLoading, error } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('info');
  
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
        
        {/* Tabs */}
        <div className="border-b border-stone-200 mb-8">
          <div className="flex space-x-8">
            <button 
              className={`pb-4 text-sm font-medium ${
                activeTab === 'info' 
                  ? 'border-b-2 border-stone-900 text-stone-900' 
                  : 'text-stone-500 hover:text-stone-700'
              }`}
              onClick={() => setActiveTab('info')}
            >
              Über die Ausstellung
            </button>
            
            {allImages.length > 1 && (
              <button 
                className={`pb-4 text-sm font-medium ${
                  activeTab === 'gallery' 
                    ? 'border-b-2 border-stone-900 text-stone-900' 
                    : 'text-stone-500 hover:text-stone-700'
                }`}
                onClick={() => setActiveTab('gallery')}
              >
                Galerie
              </button>
            )}
            
            {program && program.length > 0 && (
              <button 
                className={`pb-4 text-sm font-medium ${
                  activeTab === 'program' 
                    ? 'border-b-2 border-stone-900 text-stone-900' 
                    : 'text-stone-500 hover:text-stone-700'
                }`}
                onClick={() => setActiveTab('program')}
              >
                Programm
              </button>
            )}
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="mb-16">
          {/* Info Tab */}
          {activeTab === 'info' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <div className="prose prose-stone prose-lg max-w-none">
                {description.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              
              {/* Contributors Section */}
              {contributors && contributors.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-xl font-medium text-stone-900 mb-4">Mitwirkende</h2>
                  <div className="flex flex-wrap gap-2">
                    {contributors.map((contributor, index) => (
                      <div 
                        key={index}
                        className="bg-stone-100 rounded-full px-3 py-1 text-sm flex items-center"
                      >
                        {contributor.icon === 'music' && <Music className="h-3 w-3 mr-1" />}
                        {contributor.icon === 'user' && <User className="h-3 w-3 mr-1" />}
                        <span>{contributor.type}: {contributor.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Gallery Tab */}
          {activeTab === 'gallery' && allImages.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ExhibitionGallery images={allImages} title={title} />
            </motion.div>
          )}
          
          {/* Program Tab */}
          {activeTab === 'program' && program && program.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-xl font-medium text-stone-900 mb-6">Programm für {formattedDate}</h2>
              
              <div className="space-y-8">
                {program.map((event, index) => (
                  <div key={index} className="border-l-2 border-stone-300 pl-4 py-2">
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
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExhibitionDetail;
