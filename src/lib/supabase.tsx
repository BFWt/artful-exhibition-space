import { createClient, SupabaseClient } from '@supabase/supabase-js';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types for our database
export type SupportingContributor = {
  id?: number;  // Changed from required to optional
  exhibitionId?: number;
  type: string;
  name: string;
  icon: string;
};

export type ProgramEntry = {
  id?: number;  // Changed from required to optional
  exhibitionId?: number;
  day: string;
  timeframe: string;
  title: string;
  description: string;
};

export type Exhibition = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  artist: string;
  coverImage: string;
  galleryImages: string[];
  state: 'current' | 'upcoming' | 'past';
  createdAt: string;
  updatedAt: string;
  contributors?: SupportingContributor[];
  program?: ProgramEntry[];
};

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
};

const supabaseUrl = 'https://vtwhaecrsdrdqzqftghn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0d2hhZWNyc2RyZHF6cWZ0Z2huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMTk4MzcsImV4cCI6MjA1NzY5NTgzN30.D-Ap5qvGxigLNOEVK1ZYnQCx7PXiNDX48t_3NUMLFB0';

const supabase = createClient(supabaseUrl, supabaseKey);

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exhibitions, setExhibitions] = useState<Exhibition[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchExhibitions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch exhibitions
      const { data: exhibitionsData, error: exhibitionsError } = await supabase
        .from('exhibitions')
        .select('*')
        .order('updatedAt', { ascending: false });
        
      if (exhibitionsError) throw exhibitionsError;
      
      // Fetch all contributors
      const { data: contributorsData, error: contributorsError } = await supabase
        .from('contributors')
        .select('*');
        
      if (contributorsError) throw contributorsError;
      
      // Fetch all program entries
      const { data: programData, error: programError } = await supabase
        .from('program')
        .select('*');
        
      if (programError) throw programError;
      
      // Merge data
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
    } finally {
      setIsLoading(false);
    }
  };

  const addExhibition = async (exhibition: Omit<Exhibition, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Adding exhibition:', exhibition);
      
      // Insert the exhibition
      const { data, error } = await supabase
        .from('exhibitions')
        .insert([{
          title: exhibition.title,
          subtitle: exhibition.subtitle,
          description: exhibition.description,
          artist: exhibition.artist,
          coverImage: exhibition.coverImage,
          galleryImages: exhibition.galleryImages,
          state: exhibition.state,
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting exhibition:', error);
        throw error;
      }
      
      console.log('Exhibition inserted:', data);
      
      // Insert contributors if any
      if (exhibition.contributors && exhibition.contributors.length > 0) {
        const contributorsWithExhibitionId = exhibition.contributors.map(c => ({
          ...c,
          exhibitionId: data.id
        }));
        
        console.log('Adding contributors:', contributorsWithExhibitionId);
        
        const { error: contributorsError } = await supabase
          .from('contributors')
          .insert(contributorsWithExhibitionId);
          
        if (contributorsError) {
          console.error('Error inserting contributors:', contributorsError);
          throw contributorsError;
        }
      }
      
      // Insert program entries if any
      if (exhibition.program && exhibition.program.length > 0) {
        const programWithExhibitionId = exhibition.program.map(p => ({
          ...p,
          exhibitionId: data.id
        }));
        
        console.log('Adding program entries:', programWithExhibitionId);
        
        const { error: programError } = await supabase
          .from('program')
          .insert(programWithExhibitionId);
          
        if (programError) {
          console.error('Error inserting program entries:', programError);
          throw programError;
        }
      }
      
      // Refetch to get the updated list
      await fetchExhibitions();
      
      return data as Exhibition;
    } catch (err) {
      console.error('Error adding exhibition:', err);
      return null;
    }
  };

  const updateExhibition = async (id: number, exhibition: Partial<Exhibition>) => {
    try {
      const { contributors, program, ...exhibitionData } = exhibition;
      
      // Update exhibition
      const { data, error } = await supabase
        .from('exhibitions')
        .update(exhibitionData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Update contributors if provided
      if (contributors) {
        // Delete existing contributors
        const { error: deleteError } = await supabase
          .from('contributors')
          .delete()
          .eq('exhibitionId', id);
          
        if (deleteError) throw deleteError;
        
        // Insert new contributors
        if (contributors.length > 0) {
          const contributorsWithExhibitionId = contributors.map(c => ({
            ...c,
            exhibitionId: id
          }));
          
          const { error: contributorsError } = await supabase
            .from('contributors')
            .insert(contributorsWithExhibitionId);
            
          if (contributorsError) throw contributorsError;
        }
      }
      
      // Update program entries if provided
      if (program) {
        // Delete existing program entries
        const { error: deleteError } = await supabase
          .from('program')
          .delete()
          .eq('exhibitionId', id);
          
        if (deleteError) throw deleteError;
        
        // Insert new program entries
        if (program.length > 0) {
          const programWithExhibitionId = program.map(p => ({
            ...p,
            exhibitionId: id
          }));
          
          const { error: programError } = await supabase
            .from('program')
            .insert(programWithExhibitionId);
            
          if (programError) throw programError;
        }
      }
      
      // Refetch to get the updated list
      await fetchExhibitions();
      
      return data as Exhibition;
    } catch (err) {
      console.error('Error updating exhibition:', err);
      return null;
    }
  };

  const deleteExhibition = async (id: number) => {
    try {
      // Delete contributors
      const { error: contributorsError } = await supabase
        .from('contributors')
        .delete()
        .eq('exhibitionId', id);
        
      if (contributorsError) throw contributorsError;
      
      // Delete program entries
      const { error: programError } = await supabase
        .from('program')
        .delete()
        .eq('exhibitionId', id);
        
      if (programError) throw programError;
      
      // Delete exhibition
      const { error } = await supabase
        .from('exhibitions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Refetch to get the updated list
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
      
      const { error: uploadError, data } = await supabase.storage
        .from('exhibitions')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('exhibitions')
        .getPublicUrl(filePath);
        
      return publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  return (
    <SupabaseContext.Provider
      value={{
        supabase,
        exhibitions,
        isLoading,
        error,
        fetchExhibitions,
        addExhibition,
        updateExhibition,
        deleteExhibition,
        uploadImage
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
