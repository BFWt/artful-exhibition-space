
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface MasonryGalleryProps {
  images: string[];
  alt: string;
}

const MasonryGallery: React.FC<MasonryGalleryProps> = ({ images, alt }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  
  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => ({ ...prev, [src]: true }));
  };
  
  const isImageLoaded = (src: string) => loadedImages[src];
  
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
  
  return (
    <>
      <motion.div 
        className="masonry-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {images.map((image, index) => (
          <motion.div 
            key={index} 
            className="break-inside-avoid mb-4"
            variants={item}
            transition={{ duration: 0.5 }}
          >
            <button
              className="w-full focus:outline-none"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative overflow-hidden rounded-md shadow-sm hover:shadow-md transition-shadow">
                <motion.img
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  src={image}
                  alt={`${alt} - Bild ${index + 1}`}
                  className={`w-full h-auto transition-opacity duration-500 ${isImageLoaded(image) ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => handleImageLoad(image)}
                />
              </div>
            </button>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Image Modal */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 rounded-full bg-black/20 p-2 text-white/80 hover:text-white backdrop-blur-sm hover:bg-black/30 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="w-full h-full">
              <img
                src={selectedImage || ''}
                alt={alt}
                className="w-full h-auto max-h-[85vh] object-contain rounded-md"
              />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default MasonryGallery;
