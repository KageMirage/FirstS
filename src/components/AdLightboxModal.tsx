import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface AdLightboxModalProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export const AdLightboxModal: React.FC<AdLightboxModalProps> = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onSelectIndex,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onSelectIndex((currentIndex - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight') {
        onSelectIndex((currentIndex + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex, images.length, onClose, onSelectIndex]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectIndex((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectIndex((currentIndex + 1) % images.length);
  };

  return (
    <div
      id="lightbox-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/35 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in duration-200"
    >
      {/* Top Bar with Close button */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between z-10">
        <span className="text-white text-sm font-semibold drop-shadow-md bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          id="btn-close-lightbox"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm border border-white/20 hover:scale-105"
          title="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Stage with Left & Right Arrows */}
      <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-auto px-4">
        
        {/* Left Arrow */}
        <button
          id="btn-lightbox-prev"
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all border border-white/20 backdrop-blur-sm cursor-pointer shadow-lg hover:scale-105"
          title="Предыдущее фото"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        {/* Big Preview Image */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[70vh] max-w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/20 backdrop-blur-sm flex items-center justify-center"
        >
          <img
            src={currentImage}
            alt={`Фото ${currentIndex + 1}`}
            className="max-h-[70vh] w-auto max-w-full object-contain select-none"
          />
        </div>

        {/* Right Arrow */}
        <button
          id="btn-lightbox-next"
          onClick={handleNext}
          className="absolute right-2 sm:right-4 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all border border-white/20 backdrop-blur-sm cursor-pointer shadow-lg hover:scale-105"
          title="Следующее фото"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>

      {/* Bottom Thumbnails Strip */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl flex items-center justify-center gap-3 overflow-x-auto py-2 px-4 z-10"
      >
        {images.map((img, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={idx}
              id={`lightbox-thumb-${idx}`}
              onClick={() => onSelectIndex(idx)}
              className={`relative shrink-0 w-16 sm:w-20 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-[#1a73e8] scale-105 shadow-md shadow-blue-500/30'
                  : 'border-transparent opacity-60 hover:opacity-100 hover:scale-102'
              }`}
            >
              <img
                src={img}
                alt={`Миниатюра ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
