
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSupabase } from '@/lib/supabase';
import { 
  AlertTriangle, Edit, Trash2, Eye, 
  Calendar, Clock, Archive, Search, Image 
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ExhibitionList = () => {
  const { exhibitions, isLoading, error, deleteExhibition } = useSupabase();
  const [searchTerm, setSearchTerm] = useState('');
  const [exhibitionToDelete, setExhibitionToDelete] = useState<number | null>(null);
  const { toast } = useToast();

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

  const filteredExhibitions = exhibitions?.filter(exhibition => 
    exhibition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exhibition.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exhibition.artist.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'current':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'upcoming':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'past':
        return <Archive className="h-4 w-4 text-stone-500" />;
      default:
        return null;
    }
  };

  const getStateLabel = (state: string) => {
    switch (state) {
      case 'current':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Aktuell</Badge>;
      case 'upcoming':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Kommend</Badge>;
      case 'past':
        return <Badge variant="default" className="bg-stone-100 text-stone-800 hover:bg-stone-100">Vergangen</Badge>;
      default:
        return null;
    }
  };

  const handleDelete = async () => {
    if (exhibitionToDelete) {
      const success = await deleteExhibition(exhibitionToDelete);
      if (success) {
        toast({
          title: "Ausstellung gelöscht",
          description: "Die Ausstellung wurde erfolgreich gelöscht.",
        });
      } else {
        toast({
          title: "Fehler",
          description: "Die Ausstellung konnte nicht gelöscht werden.",
          variant: "destructive",
        });
      }
      setExhibitionToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ausstellungen</h1>
        <Link
          to="/admin/exhibitions/new"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-stone-800 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
        >
          Neue Ausstellung
        </Link>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            type="text"
            placeholder="Suchen..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Status</TableHead>
              <TableHead>Titel</TableHead>
              <TableHead>Künstler</TableHead>
              <TableHead>Bilder</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExhibitions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-stone-500">
                  Keine Ausstellungen gefunden
                </TableCell>
              </TableRow>
            ) : (
              filteredExhibitions.map(exhibition => (
                <TableRow key={exhibition.id}>
                  <TableCell>
                    <div className="flex items-center">
                      {getStateLabel(exhibition.state)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{exhibition.title}</div>
                    <div className="text-sm text-stone-500">{exhibition.subtitle}</div>
                  </TableCell>
                  <TableCell>{exhibition.artist}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Image className="h-4 w-4 mr-1 text-stone-400" />
                      <span>{(exhibition.galleryImages?.length || 0) + 1}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <span className="sr-only">Menü öffnen</span>
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                            <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/exhibitions/edit/${exhibition.id}`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Bearbeiten</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/ausstellung/${exhibition.id}`} className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Ansehen</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setExhibitionToDelete(exhibition.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Löschen</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={exhibitionToDelete !== null} onOpenChange={(open) => !open && setExhibitionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ausstellung löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie diese Ausstellung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExhibitionList;
