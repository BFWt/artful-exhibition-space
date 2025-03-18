import { createClient, SupabaseClient } from '@supabase/supabase-js';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define types for our database
export type SupportingContributor = {
  id?: number;
  exhibitionId?: number;
  type: string;
  name: string;
  icon: string;
};

export type ProgramEntry = {
  id?: number;
  exhibitionId?: number;
  title: string;
  description: string;
  date?: string; // New proper date field
  startTime?: string; // New time field
  endTime?: string; // New time field
};

export interface Exhibition {
  id: number;
  title: string;
  subtitle?: string; // Added subtitle
  description: string;
  artist: string;
  state: 'current' | 'upcoming' | 'past';
  date: string;
  endDate?: string;
  germanDate: string;
  germanEndDate?: string; // Added germanEndDate
  coverImage?: string;
  galleryImages?: string[];
  contributors?: SupportingContributor[];
  program?: ProgramEntry[];
  createdAt: string;
  updatedAt: string;
}

type SupabaseContextType = {
  supabase: SupabaseClient;
  exhibitions: Exhibition[] | null;
  isLoading: boolean;
  error: Error | null;
  fetchExhibitions: () => Promise<void>;
  addExhibition: (exhibition: Omit<Exhibition, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Exhibition | null>;
  updateExhibition: (id: number, exhibition: Partial<Exhibition>) => Promise<Exhibition | null>;
  deleteExhibition: (id: number) => Promise<boolean>;
  uploadImage: (file: File, path: string) => Promise<string | null>;
  getExhibitionById: (id: number) => Promise<Exhibition | null>;
};

const supabaseUrl = 'https://vtwhaecrsdrdqzqftghn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0d2hhZWNyc2RyZHF6cWZ0Z2huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMTk4MzcsImV4cCI6MjA1NzY5NTgzN30.D-Ap5qvGxigLNOEVK1ZYnQCx7PXiNDX48t_3NUMLFB0';

const supabase = createClient(supabaseUrl, supabaseKey);

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exhibitions, setExhibitions] = useState<Exhibition[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchExhibitions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: exhibitionsData, error: exhibitionsError } = await supabase
        .from('exhibitions')
        .select('*')
        .order('updatedAt', { ascending: false });
        
      if (exhibitionsError) throw exhibitionsError;
      
      const { data: contributorsData, error: contributorsError } = await supabase
        .from('contributors')
        .select('*');
        
      if (contributorsError) throw contributorsError;
      
      const { data: programData, error: programError } = await supabase
        .from('program')
        .select('*');
        
      if (programError) throw programError;
      
      const exhibitionsWithRelations = exhibitionsData.map(exhibition => {
        return {
          ...exhibition,
          contributors: contributorsData.filter(c => c.exhibitionId === exhibition.id),
          program: programData.filter(p => p.exhibitionId === exhibition.id)
        };
      });
      
      setExhibitions(exhibitionsWithRelations);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching exhibitions:', err);
      toast({
        title: "Fehler",
        description: "Beim Laden der Ausstellungen ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addExhibition = async (exhibition: Omit<Exhibition, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Adding exhibition:', exhibition);
      
      const { data, error } = await supabase
        .from('exhibitions')
        .insert([{
          title: exhibition.title,
          subtitle: exhibition.subtitle,
          description: exhibition.description,
          artist: exhibition.artist,
          coverImage: exhibition.coverImage || null,
          galleryImages: exhibition.galleryImages || [],
          state: exhibition.state,
          date: exhibition.date,
          endDate: exhibition.endDate || null,
          germanDate: exhibition.germanDate || null,
          germanEndDate: exhibition.germanEndDate || null
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting exhibition:', error);
        toast({
          title: "Fehler",
          description: `Beim Erstellen der Ausstellung ist ein Fehler aufgetreten: ${error.message}`,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log('Exhibition inserted:', data);
      
      if (exhibition.contributors && exhibition.contributors.length > 0) {
        const contributorsWithExhibitionId = exhibition.contributors.map(c => ({
          exhibitionId: data.id,
          type: c.type,
          name: c.name,
          icon: c.icon
        }));
        
        console.log('Adding contributors:', contributorsWithExhibitionId);
        
        const { error: contributorsError } = await supabase
          .from('contributors')
          .insert(contributorsWithExhibitionId);
          
        if (contributorsError) {
          console.error('Error inserting contributors:', contributorsError);
          toast({
            title: "Warnung",
            description: `Mitwirkende konnten nicht hinzugefügt werden: ${contributorsError.message}`,
            variant: "destructive",
          });
        }
      }
      
      if (exhibition.program && exhibition.program.length > 0) {
        const programWithExhibitionId = exhibition.program.map(p => ({
          exhibitionId: data.id,
          title: p.title,
          description: p.description || '',
          date: p.date || '',
          startTime: p.startTime || '',
          endTime: p.endTime || ''
        }));
        
        console.log('Adding program entries:', programWithExhibitionId);
        
        const { error: programError } = await supabase
          .from('program')
          .insert(programWithExhibitionId);
          
        if (programError) {
          console.error('Error inserting program entries:', programError);
          toast({
            title: "Warnung",
            description: `Programmpunkte konnten nicht hinzugefügt werden: ${programError.message}`,
            variant: "destructive",
          });
        }
      }
      
      await fetchExhibitions();
      
      return data as Exhibition;
    } catch (err) {
      console.error('Error adding exhibition:', err);
      throw err;
    }
  };

  const updateExhibition = async (id: number, exhibition: Partial<Exhibition>) => {
    try {
      const { contributors, program, ...exhibitionData } = exhibition;
      
      const { data, error } = await supabase
        .from('exhibitions')
        .update(exhibitionData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        toast({
          title: "Fehler",
          description: `Beim Aktualisieren der Ausstellung ist ein Fehler aufgetreten: ${error.message}`,
          variant: "destructive",
        });
        throw error;
      }
      
      if (contributors) {
        // First delete all existing contributors
        const { error: deleteError } = await supabase
          .from('contributors')
          .delete()
          .eq('exhibitionId', id);
          
        if (deleteError) {
          toast({
            title: "Warnung",
            description: `Bestehende Mitwirkende konnten nicht gelöscht werden: ${deleteError.message}`,
            variant: "destructive",
          });
          throw deleteError;
        }
        
        // Then add new contributors if there are any
        if (contributors.length > 0) {
          const contributorsWithExhibitionId = contributors.map(c => ({
            exhibitionId: id,
            type: c.type,
            name: c.name,
            icon: c.icon
          }));
          
          const { error: contributorsError } = await supabase
            .from('contributors')
            .insert(contributorsWithExhibitionId);
            
          if (contributorsError) {
            toast({
              title: "Warnung",
              description: `Mitwirkende konnten nicht aktualisiert werden: ${contributorsError.message}`,
              variant: "destructive",
            });
            throw contributorsError;
          }
        }
      }
      
      if (program) {
        // First delete all existing program entries
        const { error: deleteError } = await supabase
          .from('program')
          .delete()
          .eq('exhibitionId', id);
          
        if (deleteError) {
          toast({
            title: "Warnung",
            description: `Bestehende Programmpunkte konnten nicht gelöscht werden: ${deleteError.message}`,
            variant: "destructive",
          });
          throw deleteError;
        }
        
        // Then add new program entries if there are any
        if (program.length > 0) {
          const programWithExhibitionId = program.map(p => ({
            exhibitionId: id,
            title: p.title,
            description: p.description || '',
            date: p.date || '',
            startTime: p.startTime || '',
            endTime: p.endTime || ''
          }));
          
          const { error: programError } = await supabase
            .from('program')
            .insert(programWithExhibitionId);
            
          if (programError) {
            toast({
              title: "Warnung",
              description: `Programmpunkte konnten nicht aktualisiert werden: ${programError.message}`,
              variant: "destructive",
            });
            throw programError;
          }
        }
      }
      
      await fetchExhibitions();
      
      return data as Exhibition;
    } catch (err) {
      console.error('Error updating exhibition:', err);
      throw err;
    }
  };

  const deleteExhibition = async (id: number) => {
    try {
      // Delete all contributors
      const { error: contributorsError } = await supabase
        .from('contributors')
        .delete()
        .eq('exhibitionId', id);
        
      if (contributorsError) {
        toast({
          title: "Warnung",
          description: `Mitwirkende konnten nicht gelöscht werden: ${contributorsError.message}`,
          variant: "destructive",
        });
        throw contributorsError;
      }
      
      // Delete all program entries
      const { error: programError } = await supabase
        .from('program')
        .delete()
        .eq('exhibitionId', id);
        
      if (programError) {
        toast({
          title: "Warnung",
          description: `Programmpunkte konnten nicht gelöscht werden: ${programError.message}`,
          variant: "destructive",
        });
        throw programError;
      }
      
      // Delete the exhibition
      const { error } = await supabase
        .from('exhibitions')
        .delete()
        .eq('id', id);
        
      if (error) {
        toast({
          title: "Fehler",
          description: `Ausstellung konnte nicht gelöscht werden: ${error.message}`,
          variant: "destructive",
        });
        throw error;
      }
      
      await fetchExhibitions();
      
      return true;
    } catch (err) {
      console.error('Error deleting exhibition:', err);
      return false;
    }
  };

  const uploadImage = async (file: File, path: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;
      
      // Log for debugging
      console.log('Uploading file:', {
        fileName,
        filePath,
        fileSize: file.size,
        fileType: file.type
      });
      
      const { error: uploadError, data } = await supabase.storage
        .from('exhibitions')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Fehler beim Bildupload",
          description: `${uploadError.message}`,
          variant: "destructive",
        });
        throw uploadError;
      }
      
      console.log('Upload successful:', data);
      
      const { data: { publicUrl } } = supabase.storage
        .from('exhibitions')
        .getPublicUrl(filePath);
        
      console.log('Public URL:', publicUrl);
      
      return publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      if (err instanceof Error) {
        toast({
          title: "Fehler beim Bildupload",
          description: err.message,
          variant: "destructive",
        });
      }
      return null;
    }
  };

  const getExhibitionById = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('exhibitions')
        .select(`
          *,
          contributors(*),
          program(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting exhibition by ID:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const value = {
    supabase,
    exhibitions,
    isLoading,
    error,
    fetchExhibitions,
    addExhibition,
    updateExhibition,
    deleteExhibition,
    uploadImage,
    getExhibitionById,
  };

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
