import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from '../hooks/useTranslation';
import { truncatedTextTranslations } from '../translations/truncatedText';

interface TruncatedTextProps {
  text: string;
  title?: string;
  maxLines?: number;
  className?: string;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({ 
  text, 
  title,
  maxLines = 18,
  className = ""
}) => {
  const t = useTranslation(truncatedTextTranslations);
  const displayTitle = title || t.aboutExhibition;
  const [isTruncated, setIsTruncated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight, 10);
        const maxHeight = lineHeight * maxLines;
        const actualHeight = textRef.current.scrollHeight;
        setIsTruncated(actualHeight > maxHeight);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [text, maxLines]);

  const truncatedStyle = isTruncated ? {
    display: '-webkit-box',
    WebkitLineClamp: maxLines,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden'
  } : {};

  return (
    <div className={className}>
      <div
        ref={textRef}
        className="text-stone-600"
        style={truncatedStyle}
      >
        {text.split('\n').map((paragraph, idx) => (
          <p key={idx} className="mb-2">{paragraph}</p>
        ))}
      </div>
      
      {isTruncated && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="link" 
              className="p-0 h-auto text-stone-600 hover:text-stone-800 mt-2"
            >
              {t.showMore}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif font-medium">
                {displayTitle}
              </DialogTitle>
            </DialogHeader>
            <div className="prose prose-stone prose-lg max-w-none whitespace-pre-line mt-4">
              {text.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-2">{paragraph}</p>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TruncatedText;