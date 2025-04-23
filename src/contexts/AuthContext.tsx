
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useSupabase } from '@/lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();
  const { supabase } = useSupabase();
  
  useEffect(() => {
    // Check if user is already logged in with Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Anmeldung fehlgeschlagen",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Anmeldung erfolgreich",
        description: "Sie sind jetzt angemeldet.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    toast({
      title: "Abmeldung erfolgreich",
      description: "Sie wurden abgemeldet.",
    });
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
