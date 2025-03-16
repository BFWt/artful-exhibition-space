
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, Calendar, Clock, Archive, AlertTriangle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSupabase } from '@/lib/supabase';

const AdminDashboard = () => {
  const { exhibitions, isLoading, error } = useSupabase();

  const currentExhibitions = exhibitions?.filter(e => e.state === 'current') || [];
  const upcomingExhibitions = exhibitions?.filter(e => e.state === 'upcoming') || [];
  const pastExhibitions = exhibitions?.filter(e => e.state === 'past') || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Fehler beim Laden der Daten</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-stone-500">Aktuelle Ausstellungen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentExhibitions.length}</div>
            <CardDescription className="mt-1">
              {currentExhibitions.length === 0 ? 'Keine aktiven Ausstellungen' : ''}
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-stone-500">Kommende Ausstellungen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingExhibitions.length}</div>
            <CardDescription className="mt-1">
              {upcomingExhibitions.length === 0 ? 'Keine geplanten Ausstellungen' : ''}
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-stone-500">Vergangene Ausstellungen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pastExhibitions.length}</div>
            <CardDescription className="mt-1">
              Im Archiv dokumentiert
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aktuelle Ausstellung</CardTitle>
            <CardDescription>
              Momentan laufende Ausstellung
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentExhibitions.length > 0 ? (
              <div className="space-y-4">
                {currentExhibitions.map(exhibition => (
                  <div key={exhibition.id} className="border-l-4 border-green-500 pl-4 py-2">
                    <h3 className="font-medium">{exhibition.title}</h3>
                    <p className="text-sm text-stone-500">{exhibition.subtitle}</p>
                    <div className="mt-2">
                      <Link 
                        to={`/admin/exhibitions/edit/${exhibition.id}`}
                        className="text-sm text-stone-600 hover:text-stone-900"
                      >
                        Bearbeiten →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-stone-500 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Keine aktive Ausstellung</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Nächste Ausstellung</CardTitle>
            <CardDescription>
              Die als nächstes geplante Ausstellung
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingExhibitions.length > 0 ? (
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-medium">{upcomingExhibitions[0].title}</h3>
                  <p className="text-sm text-stone-500">{upcomingExhibitions[0].subtitle}</p>
                  <div className="mt-2">
                    <Link 
                      to={`/admin/exhibitions/edit/${upcomingExhibitions[0].id}`}
                      className="text-sm text-stone-600 hover:text-stone-900"
                    >
                      Bearbeiten →
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-stone-500 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>Keine geplante Ausstellung</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Link
          to="/admin/exhibitions/new"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-stone-800 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Neue Ausstellung erstellen
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
