import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupabase, Exhibition, SupportingContributor, ProgramEntry } from '@/lib/supabase';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Image, Plus, X, Music, User, Coffee, AlertTriangle, Calendar as CalendarIcon2 } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1, 'Titel ist erforderlich'),
  subtitle: z.string().optional(),
  description: z.string().min(1, 'Beschreibung ist erforderlich'),
  artist: z.string().min(1, 'Künstler ist erforderlich'),
  state: z.enum(['current', 'upcoming', 'past']),
  coverImage: z.string().optional(), // Made coverImage optional
  galleryImages: z.array(z.string()).optional(),
  date: z.string().min(1, 'Startdatum ist erforderlich'),
  endDate: z.string().optional(), // Optional end date
  contributors: z.array(z.object({
    id: z.number().optional(),
    type: z.string().min(1, 'Art ist erforderlich'),
    name: z.string().min(1, 'Name ist erforderlich'),
    icon: z.string().min(1, 'Icon ist erforderlich')
  })).optional(),
  program: z.array(z.object({
    id: z.number().optional(),
    day: z.string().min(1, 'Tag ist erforderlich'),
    timeframe: z.string().min(1, 'Zeitrahmen ist erforderlich'),
    title: z.string().min(1, 'Titel ist erforderlich'),
    description: z.string().optional(),
    date: z.string().optional(), // Proper date field
    startTime: z.string().optional(), // Start time field
    endTime: z.string().optional(), // End time field
  })).optional()
});

type FormValues = z.infer<typeof formSchema>;

const ExhibitionForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { toast } = useToast();
  const { exhibitions, isLoading, error, addExhibition, updateExhibition, uploadImage } = useSupabase();
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(undefined);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      artist: '',
      state: 'upcoming',
      coverImage: '',
      galleryImages: [],
      date: format(new Date(), 'yyyy-MM-dd'),
      endDate: '',
      contributors: [],
      program: []
    }
  });

  const { fields: contributorFields, append: appendContributor, remove: removeContributor } = useFieldArray({
    control: form.control,
    name: 'contributors'
  });

  const { fields: programFields, append: appendProgram, remove: removeProgram } = useFieldArray({
    control: form.control,
    name: 'program'
  });

  useEffect(() => {
    if (isEditing && exhibitions) {
      const exhibition = exhibitions.find(e => e.id === Number(id));
      if (exhibition) {
        form.reset({
          title: exhibition.title,
          subtitle: exhibition.subtitle || '',
          description: exhibition.description,
          artist: exhibition.artist,
          state: exhibition.state,
          coverImage: exhibition.coverImage || '',
          galleryImages: exhibition.galleryImages || [],
          date: exhibition.date || format(new Date(), 'yyyy-MM-dd'),
          endDate: exhibition.endDate || '',
          contributors: exhibition.contributors || [],
          program: exhibition.program || []
        });
        
        setSelectedStartDate(exhibition.date ? new Date(exhibition.date) : new Date());
        if (exhibition.endDate) {
          setSelectedEndDate(new Date(exhibition.endDate));
        }
        if (exhibition.coverImage) {
          setCoverImagePreview(exhibition.coverImage);
        }
        setGalleryImagePreviews(exhibition.galleryImages || []);
      }
    }
  }, [isEditing, exhibitions, id, form]);

  const onSubmit = async (values: FormValues) => {
    setUploading(true);
    
    try {
      // Upload cover image if available
      let coverImageUrl = values.coverImage || '';
      if (coverImageFile) {
        const url = await uploadImage(coverImageFile, 'cover');
        if (url) {
          coverImageUrl = url;
        } else {
          toast({
            title: "Fehler",
            description: "Das Titelbild konnte nicht hochgeladen werden.",
            variant: "destructive",
          });
        }
      }
      
      // Upload gallery images if available
      let galleryImagesUrls = [...(values.galleryImages || [])];
      if (galleryImageFiles.length > 0) {
        for (let i = 0; i < galleryImageFiles.length; i++) {
          const url = await uploadImage(galleryImageFiles[i], 'gallery');
          if (url) {
            galleryImagesUrls.push(url);
          } else {
            toast({
              title: "Warnung",
              description: `Ein Galeriebild konnte nicht hochgeladen werden.`,
            });
          }
        }
      }
      
      // Prepare contributors and program data
      const contributors = values.contributors?.map(contributor => ({
        id: contributor.id,
        type: contributor.type,
        name: contributor.name,
        icon: contributor.icon
      })) || [];
      
      const program = values.program?.map(item => ({
        id: item.id,
        day: item.day,
        timeframe: item.timeframe,
        title: item.title,
        description: item.description || '',
        date: item.date || '',
        startTime: item.startTime || '',
        endTime: item.endTime || ''
      })) || [];
      
      // Generate German formatted dates
      const germanDate = format(new Date(values.date), 'dd. MMMM yyyy', { locale: de });
      const germanEndDate = values.endDate ? format(new Date(values.endDate), 'dd. MMMM yyyy', { locale: de }) : undefined;
      
      // Prepare exhibition data
      const exhibitionData = {
        title: values.title,
        subtitle: values.subtitle || '',
        description: values.description,
        artist: values.artist,
        state: values.state,
        coverImage: coverImageUrl,
        galleryImages: galleryImagesUrls,
        date: values.date,
        endDate: values.endDate || null,
        germanDate: germanDate,
        germanEndDate: germanEndDate,
        contributors: contributors,
        program: program
      };
      
      // Save exhibition data
      if (isEditing) {
        try {
          await updateExhibition(Number(id), exhibitionData);
          toast({
            title: "Ausstellung aktualisiert",
            description: "Die Ausstellung wurde erfolgreich aktualisiert.",
          });
          navigate('/admin/exhibitions');
        } catch (error) {
          toast({
            title: "Fehler",
            description: "Beim Aktualisieren der Ausstellung ist ein Fehler aufgetreten.",
            variant: "destructive",
          });
        }
      } else {
        try {
          const result = await addExhibition(exhibitionData);
          if (result) {
            toast({
              title: "Ausstellung erstellt",
              description: "Die Ausstellung wurde erfolgreich erstellt.",
            });
            navigate('/admin/exhibitions');
          } else {
            toast({
              title: "Fehler",
              description: "Beim Erstellen der Ausstellung ist ein Fehler aufgetreten.",
              variant: "destructive",
            });
          }
        } catch (error) {
          if (error instanceof Error) {
            toast({
              title: "Fehler",
              description: `Beim Erstellen der Ausstellung ist ein Fehler aufgetreten: ${error.message}`,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Fehler",
              description: "Beim Erstellen der Ausstellung ist ein unbekannter Fehler aufgetreten.",
              variant: "destructive",
            });
          }
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: "Fehler",
          description: `Beim Speichern der Ausstellung ist ein Fehler aufgetreten: ${err.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fehler",
          description: "Beim Speichern der Ausstellung ist ein unbekannter Fehler aufgetreten.",
          variant: "destructive",
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
      
      // Update the form value to ensure validation passes
      form.setValue('coverImage', 'pending-upload', { shouldValidate: true });
    }
  };

  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setGalleryImageFiles(prev => [...prev, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setGalleryImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImagePreviews(prev => prev.filter((_, i) => i !== index));
    
    if (index >= (form.getValues().galleryImages?.length || 0)) {
      const newFileIndex = index - (form.getValues().galleryImages?.length || 0);
      setGalleryImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
    } else {
      const currentGalleryImages = form.getValues().galleryImages || [];
      form.setValue('galleryImages', currentGalleryImages.filter((_, i) => i !== index));
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'music':
        return <Music className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      case 'coffee':
        return <Coffee className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Ausstellung bearbeiten' : 'Neue Ausstellung'}
      </h1>
      
      {error && (
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
      )}
      
      <Tabs defaultValue="basic">
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basisdaten</TabsTrigger>
          <TabsTrigger value="images">Bilder</TabsTrigger>
          <TabsTrigger value="contributors">Mitwirkende</TabsTrigger>
          <TabsTrigger value="program">Programm</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Allgemeine Informationen</CardTitle>
                  <CardDescription>
                    Grundlegende Informationen über die Ausstellung.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titel</FormLabel>
                        <FormControl>
                          <Input placeholder="Titel der Ausstellung" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Untertitel</FormLabel>
                        <FormControl>
                          <Input placeholder="Untertitel (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beschreibung</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Beschreibung der Ausstellung" 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="artist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Künstler</FormLabel>
                        <FormControl>
                          <Input placeholder="Name des Künstlers" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date Range selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Startdatum</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={`w-full pl-3 text-left font-normal ${
                                    !field.value ? "text-muted-foreground" : ""
                                  }`}
                                >
                                  {field.value ? (
                                    format(new Date(field.value), "PPP", { locale: de })
                                  ) : (
                                    <span>Startdatum auswählen</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={selectedStartDate}
                                onSelect={(date) => {
                                  setSelectedStartDate(date);
                                  field.onChange(date ? format(date, 'yyyy-MM-dd') : '');
                                }}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Enddatum (optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={`w-full pl-3 text-left font-normal ${
                                    !field.value ? "text-muted-foreground" : ""
                                  }`}
                                >
                                  {field.value ? (
                                    format(new Date(field.value), "PPP", { locale: de })
                                  ) : (
                                    <span>Enddatum auswählen</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={selectedEndDate}
                                onSelect={(date) => {
                                  setSelectedEndDate(date);
                                  field.onChange(date ? format(date, 'yyyy-MM-dd') : '');
                                }}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Optional: Falls die Ausstellung mehrere Tage dauert
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Status auswählen" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="current">Aktuell</SelectItem>
                            <SelectItem value="upcoming">Kommend</SelectItem>
                            <SelectItem value="past">Vergangen</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Bestimmt, wie die Ausstellung auf der Website dargestellt wird.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="images">
              <Card>
                <CardHeader>
                  <CardTitle>Bilder</CardTitle>
                  <CardDescription>
                    Upload des Titelbilds und der Galerie-Bilder. Das Titelbild ist optional.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <FormLabel className="block mb-2">Titelbild (optional)</FormLabel>
                    <div className="space-y-4">
                      {coverImagePreview && (
                        <div className="relative w-full h-64 rounded-md overflow-hidden border border-stone-200">
                          <img 
                            src={coverImagePreview} 
                            alt="Cover" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="w-full"
                      />
                      <FormDescription>
                        Dies ist das Hauptbild, das auf der Startseite und in Übersichten angezeigt wird.
                      </FormDescription>
                    </div>
                  </div>
                  
                  <div>
                    <FormLabel className="block mb-2">Galerie-Bilder</FormLabel>
                    <div className="space-y-4">
                      {galleryImagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {galleryImagePreviews.map((src, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-md overflow-hidden border border-stone-200">
                                <img 
                                  src={src} 
                                  alt={`Gallery ${index}`} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleGalleryImageChange}
                        className="w-full"
                        multiple
                      />
                      <FormDescription>
                        Diese Bilder werden in der Galerie der Ausstellungsdetailseite angezeigt.
                      </FormDescription>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contributors">
              <Card>
                <CardHeader>
                  <CardTitle>Mitwirkende</CardTitle>
                  <CardDescription>
                    Personen oder Gruppen, die zur Ausstellung beitragen (z.B. Musik, Catering).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contributorFields.map((field, index) => (
                      <div key={field.id} className="flex items-start space-x-4">
                        <div className="grid grid-cols-3 gap-4 flex-1">
                          <FormField
                            control={form.control}
                            name={`contributors.${index}.type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={index !== 0 ? 'sr-only' : ''}>Art</FormLabel>
                                <FormControl>
                                  <Input placeholder="z.B. Musik, Food" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`contributors.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={index !== 0 ? 'sr-only' : ''}>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`contributors.${index}.icon`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={index !== 0 ? 'sr-only' : ''}>Icon</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Icon wählen" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="music">
                                      <div className="flex items-center">
                                        <Music className="mr-2 h-4 w-4" />
                                        <span>Musik</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="user">
                                      <div className="flex items-center">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Person</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="coffee">
                                      <div className="flex items-center">
                                        <Coffee className="mr-2 h-4 w-4" />
                                        <span>Catering</span>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeContributor(index)}
                          className="mt-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendContributor({ type: '', name: '', icon: 'user' })}
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Mitwirkenden hinzufügen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="program">
              <Card>
                <CardHeader>
                  <CardTitle>Programm</CardTitle>
                  <CardDescription>
                    Zeitlicher Ablauf der Veranstaltung.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {programFields.map((field, index) => (
                      <div key={field.id} className="flex items-start space-x-4">
                        <div className="grid grid-cols-1 gap-4 flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Date field for program entries */}
                            <FormField
                              control={form.control}
                              name={`program.${index}.date`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className={index !== 0 ? 'sr-only' : ''}>Datum</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="date" 
                                      placeholder="Datum" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            {/* Start time */}
                            <FormField
                              control={form.control}
                              name={`program.${index}.startTime`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className={index !== 0 ? 'sr-only' : ''}>Startzeit</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="time" 
                                      placeholder="Startzeit" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            {/* End time */}
                            <FormField
                              control={form.control}
                              name={`program.${index}.endTime`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className={index !== 0 ? 'sr-only' : ''}>Endzeit</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="time" 
                                      placeholder="Endzeit" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          {/* Keep legacy fields too for compatibility */}
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`program.${index}.day`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className={index !== 0 ? 'sr-only' : ''}>Tag (Legacy)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="z.B. Freitag, 12.05.2023" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Für Kompatibilität (bevorzugt das neue Datum verwenden)
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name={`program.${index}.timeframe`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className={index !== 0 ? 'sr-only' : ''}>Zeitrahmen (Legacy)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="z.B. 18:00 - 20:00 Uhr" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Für Kompatibilität (bevorzugt die neuen Zeitfelder verwenden)
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name={`program.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={index !== 0 ? 'sr-only' : ''}>Titel</FormLabel>
                                <FormControl>
                                  <Input placeholder="Titel des Programmpunkts" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`program.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={index !== 0 ? 'sr-only' : ''}>Beschreibung</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Beschreibung des Programmpunkts" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeProgram(index)}
                          className="mt-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendProgram({ day: '', timeframe: '', title: '', description: '', date: '', startTime: '', endTime: '' })}
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Programmpunkt hinzufügen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <div className="mt-8 flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/exhibitions')}
              >
                Abbrechen
              </Button>
              <Button 
                type="submit" 
                disabled={uploading}
                className="bg-stone-800 hover:bg-stone-700"
              >
                {uploading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-stone-200 border-t-stone-800"></div>
                    Wird gespeichert...
                  </>
                ) : (
                  isEditing ? 'Aktualisieren' : 'Erstellen'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default ExhibitionForm;
