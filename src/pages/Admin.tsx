
import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Layers, Plus, LayoutDashboard, LogOut } from 'lucide-react';
import AdminDashboard from '../components/admin/AdminDashboard';
import ExhibitionForm from '../components/admin/ExhibitionForm';
import ExhibitionList from '../components/admin/ExhibitionList';
import Login from '../components/admin/Login';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

const AdminLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Admin Header */}
      <header className="bg-stone-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/admin" className="flex items-center">
                <Layers className="h-6 w-6 mr-2" />
                <span className="font-medium">Alter Kiosk Admin</span>
              </Link>
            </div>
            
            <nav className="flex items-center space-x-4">
              <Link to="/" className="text-sm text-stone-300 hover:text-white">
                Zur Website
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-stone-300 hover:text-white"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Abmelden
              </Button>
            </nav>
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white h-[calc(100vh-4rem)] border-r border-stone-200 fixed">
          <div className="p-4">
            <nav className="space-y-1">
              <Link
                to="/admin"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/admin' 
                    ? 'bg-stone-100 text-stone-900' 
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                to="/admin/exhibitions"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/admin/exhibitions' 
                    ? 'bg-stone-100 text-stone-900' 
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <Layers className="mr-3 h-5 w-5" />
                Ausstellungen
              </Link>
              <Link
                to="/admin/exhibitions/new"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/admin/exhibitions/new' 
                    ? 'bg-stone-100 text-stone-900' 
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <Plus className="mr-3 h-5 w-5" />
                Neue Ausstellung
              </Link>
            </nav>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="ml-64 flex-1 p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/exhibitions" element={<ExhibitionList />} />
            <Route path="/exhibitions/new" element={<ExhibitionForm />} />
            <Route path="/exhibitions/edit/:id" element={<ExhibitionForm />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const Admin = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
};

export default Admin;
