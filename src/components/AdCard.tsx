'use client';

import React from 'react';
import { Heart, Image as ImageIcon } from 'lucide-react';
import { AdItem } from '../types/api';
import { useAds } from '../hooks/useAds';
import { useSearchParams } from '../hooks/useSearchParams';

interface AdCardProps {
  ad: AdItem;
  variant?: 'grid' | 'horizontal' | 'auto';
}

export const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const { favoriteIds, toggleFavorite, selectAd } = useAds();
  const [, setSearchParams] = useSearchParams();
  const isFav = favoriteIds.includes(ad.id);

  const handleCardClick = () => {
    selectAd(ad);
    setSearchParams({ view: 'ad', id: String(ad.id) }, { pathname: '/ad' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(ad.id);
  };

  const formattedPrice = typeof ad.price === 'number' 
    ? `${ad.price.toLocaleString('ru-RU')} Руб`
    : `${ad.price || '2500.00'} Руб`;

  return (
    <div
      id={`ad-card-${ad.id}`}
      onClick={handleCardClick}
      className="bg-white rounded-3xl border border-gray-100/90 p-3 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-blue-200 transition-all duration-200 flex gap-3.5 sm:gap-4 items-center cursor-pointer group"
    >
      {/* Left Image Box */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden bg-[#F8FAFC] shrink-0 flex items-center justify-center border border-gray-100/60">
        {ad.image ? (
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-2xl"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLElement).parentElement;
              if (parent) {
                parent.classList.add('bg-[#F8FAFC]');
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#F8FAFC] rounded-2xl text-[#1976D2]">
            <ImageIcon className="w-7 h-7 stroke-[1.8]" />
          </div>
        )}

        {ad.is_pinned && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
            ТОП
          </span>
        )}
      </div>

      {/* Right Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          {/* Title */}
          <h4 className="text-sm sm:text-base font-bold text-[#1976D2] group-hover:underline transition-colors leading-snug line-clamp-1">
            {ad.title}
          </h4>

          {/* Subtitle / Category - Location */}
          <p className="text-[11px] sm:text-xs text-gray-400 font-normal mt-0.5 truncate">
            {ad.subCategoryTitle || `${ad.category?.name || 'Квартира/Мейманкана'} - (${ad.address ? ad.address.split(',')[0].trim() : 'Печатники'})`}
          </p>

          {/* Description snippet */}
          <p className="text-xs text-gray-700 mt-1 line-clamp-2 leading-snug">
            {ad.description || 'Сдается дом на 24 часа специально для студентов...'}
          </p>
        </div>

        {/* Card Footer: Author + Blue Heart Button */}
        <div className="pt-2 flex items-center justify-between">
          
          {/* Author avatar & name */}
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-200 shrink-0">
              {ad.user?.avatar ? (
                <img
                  src={ad.user.avatar}
                  alt={ad.user?.full_name || 'Seller'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#1976D2]/10 text-[#1976D2] flex items-center justify-center font-bold text-[10px]">
                  {ad.user?.full_name ? ad.user.full_name.charAt(0).toUpperCase() : 'A'}
                </div>
              )}
            </div>
            <span className="text-xs font-semibold text-gray-800 truncate">
              {ad.user?.full_name || 'Asana'}
            </span>
          </div>

          {/* Like / Favorite Button in Circle */}
          <button
            type="button"
            id={`btn-fav-ad-${ad.id}`}
            onClick={handleFavoriteClick}
            className="w-8 h-8 rounded-full bg-blue-50/80 hover:bg-blue-100 flex items-center justify-center transition-all cursor-pointer"
            aria-label="В избранное"
            suppressHydrationWarning
          >
            <Heart 
              className={`w-4 h-4 transition-transform active:scale-125 text-[#1976D2] ${
                isFav ? 'fill-[#1976D2]' : 'fill-transparent stroke-[2]'
              }`} 
            />
          </button>

        </div>
      </div>

    </div>
  );
};
