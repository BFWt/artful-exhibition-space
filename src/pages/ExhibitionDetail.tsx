
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CalendarDays, 
  User, 
  Music, 
  ArrowLeft, 
  Clock,
  Calendar 
} from 'lucide-react';
import { useSupabase } from '@/lib/supabase';
import { Exhibition as LocalExhibition } from '../data/exhibitions';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ExhibitionTimeline from '../components/ExhibitionTimeline';
import ExhibitionGallery from '../components/ExhibitionGallery';

const ExhibitionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getExhibitionById } = useSupabase();
  const [exhibition, setExhibition] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchExhibition = async () => {
      try {
        if (!id) {
          navigate('/archiv', { replace: true });
          return;
        }
        
        const data = await getExhibitionById(parseInt(id));
        if (!data) {
          setError('Ausstellung nicht gefunden');
          return;
        }
        
        setExhibition(data);
      } catch (err) {
        console.error('Error fetching exhibition:', err);
        setError('Fehler beim Laden der Ausstellung');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExhibition();
  }, [id, navigate, getExhibitionById]);
  
  // Convert to local exhibition format
  const adaptExhibitionForUI = (exhibition: any): LocalExhibition => {
    if (!exhibition) return {} as LocalExhibition;
    
    return {
      id: String(exhibition.id),
      title: exhibition.title || '',
      date: exhibition.date || '',
      germanDate: exhibition.germanDate || '',
      description: exhibition.description || '',
      coverImage: exhibition.coverImage || '',
      detailImages: exhibition.galleryImages || [],
      artist: exhibition.artist || '',
      djs: exhibition.contributors?.filter(c => c.type === 'DJ').map(c => c.name) || [],
      timeline: exhibition.program?.map(p => ({
        time: p.timeframe || `${p.startTime || ''} - ${p.endTime || ''}`,
        title: p.title || '',
        description: p.description || '',
        isKeyMoment: false
      })) || [],
      isCurrent: exhibition.state === 'current',
      isUpcoming: exhibition.state === 'upcoming'
    };
  };
  
  if (loading) {
    return (
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-24 w-full mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="h-8 w-1/2 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
              </div>
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-8 w-1/2 mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !exhibition) {
    return (
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 text-red-600 p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-2">{error || 'Ausstellung nicht gefunden'}</h2>
            <p className="mb-4">Die gesuchte Ausstellung konnte nicht gefunden werden.</p>
            <Button onClick={() => navigate('/archiv')}>
              Zurück zum Archiv
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const {
    title,
    germanDate,
    description,
    coverImage,
    galleryImages,
    artist,
    contributors,
    program,
    state,
    endDate
  } = exhibition;

  const djs = contributors?.filter(c => c.type === 'DJ').map(c => c.name) || [];
  const localExhibition = adaptExhibitionForUI(exhibition);
  
  // Format date range nicely
  const formatDateRange = () => {
    if (endDate && endDate !== germanDate) {
      return `${germanDate} - ${endDate}`;
    }
    return germanDate;
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            className="group flex items-center space-x-2 text-stone-600 hover:text-stone-900"
            onClick={() => navigate(state === 'upcoming' ? '/' : '/archiv')}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Zurück {state === 'upcoming' ? 'zur Startseite' : 'zum Archiv'}</span>
          </Button>
        </motion.div>
        
        {/* Exhibition Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4">
            <motion.span 
              className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 uppercase tracking-wider"
              style={{
                backgroundColor: state === 'current' ? 'rgb(220, 252, 231)' : 
                               state === 'upcoming' ? 'rgb(219, 234, 254)' : 
                               'rgb(243, 244, 246)',
                color: state === 'current' ? 'rgb(22, 101, 52)' : 
                      state === 'upcoming' ? 'rgb(29, 78, 216)' : 
                      'rgb(75, 85, 99)'
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {state === 'current' ? 'Aktuelle Ausstellung' : 
               state === 'upcoming' ? 'Kommende Ausstellung' : 
               'Vergangene Ausstellung'}
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
                <Calendar className="h-4 w-4" />
                <span>{formatDateRange()}</span>
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
          
          <div className="max-w-prose text-stone-600">
            {description?.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-3">{paragraph}</p>
            ))}
          </div>
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
              {formatDateRange()}
            </p>
            {program && program.length > 0 ? (
              <ExhibitionTimeline events={localExhibition.timeline} />
            ) : (
              <div className="bg-stone-50 p-4 rounded-md text-stone-500 text-center">
                Kein Programm verfügbar
              </div>
            )}
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
            
            {galleryImages && galleryImages.length > 0 ? (
              <ExhibitionGallery 
                images={[coverImage, ...galleryImages].filter(Boolean)} 
                title={title} 
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
