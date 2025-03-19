
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarRange, ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useSupabase, getExhibitionState } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const ExhibitionList = () => {
  const { exhibitions, deleteExhibition, isLoading, error } = useSupabase();
  const { toast } = useToast();
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exhibitionToDelete, setExhibitionToDelete] = useState<number | null>(null);

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Sort exhibitions
  const sortedExhibitions = React.useMemo(() => {
    if (!exhibitions) return [];
    
    return [...exhibitions].sort((a, b) => {
      let comparison = 0;
      
      if (sortColumn === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortColumn === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [exhibitions, sortColumn, sortDirection]);

  // Handle delete click
  const handleDeleteClick = (id: number) => {
    setExhibitionToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (!exhibitionToDelete) return;
    
    try {
      await deleteExhibition(exhibitionToDelete);
      toast({
        title: "Ausstellung gelöscht",
        description: "Die Ausstellung wurde erfolgreich gelöscht.",
      });
    } catch (err) {
      toast({
        title: "Fehler",
        description: "Die Ausstellung konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
    
    setDeleteDialogOpen(false);
    setExhibitionToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-200 rounded-md bg-red-50">
        Fehler beim Laden der Ausstellungen: {error.message}
      </div>
    );
  }

  return (
    <div>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('title')} className="cursor-pointer">
                <div className="flex items-center">
                  Titel
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort('date')} className="cursor-pointer">
                <div className="flex items-center">
                  Datum
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedExhibitions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-stone-500">
                  Keine Ausstellungen gefunden
                </TableCell>
              </TableRow>
            ) : (
              sortedExhibitions.map((exhibition) => {
                const status = getExhibitionState(exhibition);
                
                return (
                  <TableRow key={exhibition.id}>
                    <TableCell className="font-medium">{exhibition.title}</TableCell>
                    <TableCell className="flex items-center">
                      <CalendarRange className="mr-2 h-4 w-4 text-stone-500" />
                      <span>
                        {exhibition.germanDate}
                        {exhibition.germanEndDate && exhibition.germanEndDate !== exhibition.germanDate
                          ? ` - ${exhibition.germanEndDate}`
                          : ''}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        status === 'current' 
                          ? 'bg-green-100 text-green-800'
                          : status === 'upcoming'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-stone-100 text-stone-800'
                      }`}>
                        {status === 'current' ? 'Aktuell' : 
                         status === 'upcoming' ? 'Kommend' : 'Vergangen'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/exhibitions/edit/${exhibition.id}`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Bearbeiten</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteClick(exhibition.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Löschen</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ausstellung löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie diese Ausstellung löschen möchten? 
              Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExhibitionList;
