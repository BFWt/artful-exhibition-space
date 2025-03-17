
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import Layout from './components/Layout';
import Index from './pages/Index';
import Archive from './pages/Archive';
import Contact from './pages/Contact';
import ExhibitionDetail from './pages/ExhibitionDetail';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import { SupabaseProvider } from './lib/supabase';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SupabaseProvider>
          <Router>
            <Routes>
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/" element={<Layout><Outlet /></Layout>}>
                <Route index element={<Index />} />
                <Route path="/archiv" element={<Archive />} />
                <Route path="/kontakt" element={<Contact />} />
                <Route path="/impressum" element={<Impressum />} />
                <Route path="/datenschutz" element={<Datenschutz />} />
                <Route path="/ausstellung/:id" element={<ExhibitionDetail />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
          <Toaster />
        </SupabaseProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
