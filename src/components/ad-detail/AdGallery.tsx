'use client';

import React from 'react';

interface AdGalleryProps {
  images: string[];
  activeIndex: number;
  adTitle: string;
  onSelectIndex: (index: number) => void;
  onOpenLightbox: (index: number) => void;
}

export const AdGallery: React.FC<AdGalleryProps> = ({
  images,
  activeIndex,
  adTitle,
  onSelectIndex,
  onOpenLightbox,
}) => {
  const currentImage = images[activeIndex] || images[0];

  return (
    <div className="flex flex-col gap-3" id="ad-detail-gallery">
      {/* Main Large Photo */}
      <div 
        id="main-ad-photo-container"
        onClick={() => onOpenLightbox(activeIndex)}
        className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 cursor-pointer group shadow-xs border border-gray-100"
      >
        <img
          src={currentImage}
          alt={adTitle}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-black/60 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full backdrop-blur-sm">
            Нажмите для увеличения
          </span>
        </div>
      </div>

      {/* Horizontal Thumbnails Strip */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {images.slice(0, 5).map((img, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={idx}
              id={`gallery-thumb-${idx}`}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`aspect-[4/3] rounded-2xl overflow-hidden transition-all cursor-pointer ${
                isActive
                  ? 'ring-3 ring-[#1976D2] scale-102 shadow-sm'
                  : 'opacity-75 hover:opacity-100 border border-gray-100'
              }`}
            >
              <img
                src={img}
                alt={`Миниатюра ${idx + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
