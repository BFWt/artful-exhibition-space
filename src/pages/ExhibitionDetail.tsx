import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ExhibitionGallery from '../components/ExhibitionGallery';
import { useSupabase, getExhibitionState } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import ExhibitionDetailHeader from '../components/exhibition-detail/ExhibitionDetailHeader';
import ExhibitionDetailDescription from '../components/exhibition-detail/ExhibitionDetailDescription';
import ExhibitionDetailContributors from '../components/exhibition-detail/ExhibitionDetailContributors';
import ExhibitionDetailProgram from '../components/exhibition-detail/ExhibitionDetailProgram';
import { useNavigate } from 'react-router-dom';

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
          <a href="/" className="text-stone-800 hover:text-stone-600 font-medium">
            Zurück zur Startseite
          </a>
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

  const allItems: { url: string; caption?: string }[] = [];
  if (coverImage) allItems.push({ url: coverImage });
  if (exhibition.galleryItems && exhibition.galleryItems.length > 0) {
    allItems.push(...exhibition.galleryItems);
  } else if (galleryImages && galleryImages.length > 0) {
    allItems.push(...galleryImages.map((url) => ({ url })));
  }

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

  const groupProgramByDate = (): any[] => {
    if (!program || program.length === 0) return [];

    const dateMap: Record<string, any[]> = {};

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
        <ExhibitionDetailHeader
          title={title}
          subtitle={subtitle}
          artist={artist}
          formattedDate={formattedDate}
          contributors={contributors}
          exhibitionState={exhibitionState}
          onBack={handleBack}
        />
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
          <ExhibitionDetailDescription description={description} />
          {contributors && contributors.length > 0 && (
            <ExhibitionDetailContributors contributors={contributors} />
          )}
        </div>
        {allItems.length > 1 && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <h2 className="text-2xl font-serif font-medium mb-6 pb-2 border-b border-stone-200">
              Galerie
            </h2>
            <ExhibitionGallery items={allItems} title={title} />
          </motion.div>
        )}
        {programByDate.length > 0 && (
          <ExhibitionDetailProgram programByDate={programByDate} />
        )}
      </div>
    </div>
  );
};

export default ExhibitionDetail;
