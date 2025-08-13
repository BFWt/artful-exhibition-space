
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  X, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface ExhibitionGalleryProps {
  images?: string[];
  items?: { url: string; caption?: string }[];
  title?: string;
}

const ExhibitionGallery: React.FC<ExhibitionGalleryProps> = ({ images, title = "Ausstellung" }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  
  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => ({ ...prev, [src]: true }));
  };
  
  const isImageLoaded = (src: string) => loadedImages[src];

  // Carousel API to sync index on slide change
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!carouselApi) return;
    const handleSelect = () => {
      const snap = carouselApi.selectedScrollSnap();
      setSelectedImageIndex(snap);
    };
    handleSelect();
    carouselApi.on('select', handleSelect);
    carouselApi.on('reInit', handleSelect);
    return () => {
      carouselApi.off('select', handleSelect);
      carouselApi.off('reInit', handleSelect);
    };
  }, [carouselApi]);
  
  const openModal = (index: number) => {
    setSelectedImageIndex(index);
  };
  
  const closeModal = () => {
    setSelectedImageIndex(null);
    setFullscreen(false);
  };
  
  const nextImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex + 1) % images.length);
  };
  
  const prevImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
  };
  
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };
  
  const container = {
    show: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  // Calculate grid columns based on image count
  const gridCols = images.length === 1 ? 'grid-cols-1' : 
                  images.length === 2 ? 'grid-cols-2' :
                  'grid-cols-2 md:grid-cols-3';

  return (
    <>
      {/* Masonry/Grid Gallery */}
      <motion.div 
        className={`grid ${gridCols} gap-4`}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {images.map((image, index) => (
          <motion.div 
            key={index} 
            className="relative overflow-hidden rounded-md shadow-sm hover:shadow-md transition-shadow"
            variants={item}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <button
              className="w-full h-full group focus:outline-none"
              onClick={() => openModal(index)}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 z-10" />
                <img
                  src={image}
                  alt={`${title} - Bild ${index + 1}`}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoaded(image) ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => handleImageLoad(image)}
                />
              </div>
            </button>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Image Carousel Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeModal}>
        <DialogContent 
          className={`p-0 border-none max-w-6xl bg-transparent shadow-none ${fullscreen ? 'left-0 top-0 translate-x-0 translate-y-0 w-screen h-screen max-w-none m-0 rounded-none' : ''}`}
        >
          <DialogTitle className="sr-only">{title} – Galerie</DialogTitle>
          <DialogDescription className="sr-only">
            {selectedImageIndex !== null ? `Bild ${selectedImageIndex + 1} von ${images.length}` : `Bild 1 von ${images.length}`}
          </DialogDescription>
          <div className={`bg-black bg-opacity-95 overflow-hidden ${fullscreen ? 'rounded-none h-full flex flex-col' : 'rounded-lg'}`}>
            <div className="flex items-center justify-between p-2 text-white">
              <div>{selectedImageIndex !== null ? `${selectedImageIndex + 1} / ${images.length}` : ''}</div>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleFullscreen}
                  aria-label={fullscreen ? 'Vollbild beenden' : 'Vollbild öffnen'}
                  className="text-white hover:text-white hover:bg-white/20"
                >
                  {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={closeModal}
                  aria-label="Schließen"
                  className="text-white hover:text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className={`${fullscreen ? 'flex-1' : ''}`}>
              {selectedImageIndex !== null && (
                <Carousel className="w-full" opts={{ startIndex: selectedImageIndex ?? 0 }} setApi={setCarouselApi} key={`carousel-${selectedImageIndex}`}>
                  <CarouselContent className="h-full">
                    {images.map((image, index) => (
                      <CarouselItem key={index} className="flex items-center justify-center">
                        <div className={`flex items-center justify-center ${fullscreen ? 'h-[calc(100vh-80px)]' : 'h-[70vh]'}`}>
                          <img
                            src={image}
                            alt={`${title} - Bild ${index + 1}`}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious 
                    className="left-4 opacity-70 hover:opacity-100"
                    size="default"
                  />
                  <CarouselNext 
                    className="right-4 opacity-70 hover:opacity-100"
                    size="default"
                  />
                </Carousel>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExhibitionGallery;
