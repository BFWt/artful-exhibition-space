
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Archive from "./pages/Archive";
import ExhibitionDetail from "./pages/ExhibitionDetail";
import Contact from "./pages/Contact";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { SupabaseProvider } from "./lib/supabase";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/archiv" element={<Layout><Archive /></Layout>} />
            <Route path="/ausstellung/:id" element={<Layout><ExhibitionDetail /></Layout>} />
            <Route path="/kontakt" element={<Layout><Contact /></Layout>} />
            <Route path="/impressum" element={<Layout><Impressum /></Layout>} />
            <Route path="/datenschutz" element={<Layout><Datenschutz /></Layout>} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SupabaseProvider>
  </QueryClientProvider>
);

export default App;
