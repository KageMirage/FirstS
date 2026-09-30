'use client';

import React from 'react';
import { Heart, Image as ImageIcon, MapPin, Eye } from 'lucide-react';
import { AdItem } from '../types/api';
import { useAds } from '../hooks/useAds';
import { useSearchParams } from '../hooks/useSearchParams';
import { LazyImage } from './LazyImage';

interface AdCardProps {
  ad: AdItem;
  variant?: 'grid' | 'horizontal' | 'auto';
}

function formatCardPrice(priceVal: string | number): string {
  const num = typeof priceVal === 'number' ? priceVal : parseFloat(String(priceVal));
  if (isNaN(num)) return String(priceVal || 'Договорная');
  return `${num.toLocaleString('ru-RU')} сом`;
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

  const displayPrice = formatCardPrice(ad.price);
  const locationText = ad.region?.name || (ad.address ? ad.address.split(',')[0].trim() : 'Кыргызстан');

  return (
    <div
      id={`ad-card-${ad.id}`}
      onClick={handleCardClick}
      className="bg-white rounded-3xl border border-gray-100/90 p-3 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col sm:flex-row gap-3.5 sm:gap-4 sm:items-center cursor-pointer group relative overflow-hidden"
      style={ad.color ? { borderLeft: `4px solid ${ad.color}` } : undefined}
    >
      <div className="flex gap-3.5 sm:gap-4 items-center flex-1 min-w-0">
        {/* Left Image Box with Lazy Loading */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden bg-[#F8FAFC] shrink-0 flex items-center justify-center border border-gray-100/60">
          {ad.image ? (
            <LazyImage
              src={ad.image}
              alt={ad.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-2xl"
              wrapperClassName="w-full h-full"
              fallbackIcon={
                <div className="w-full h-full flex items-center justify-center bg-[#F8FAFC] rounded-2xl text-[#1976D2]">
                  <ImageIcon className="w-7 h-7 stroke-[1.8]" />
                </div>
              }
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#F8FAFC] rounded-2xl text-[#1976D2]">
              <ImageIcon className="w-7 h-7 stroke-[1.8]" />
            </div>
          )}

          {(ad.is_pinned || ad.color) && (
            <span 
              className="absolute top-2 left-2 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10"
              style={{ backgroundColor: ad.color || ad.pin_color || '#f59e0b' }}
            >
              ТОП
            </span>
          )}
        </div>

        {/* Right Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            {/* Title */}
            <h4 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#1976D2] group-hover:underline transition-colors leading-snug line-clamp-1">
              {ad.title}
            </h4>

            {/* Price */}
            <div className="text-sm sm:text-base font-extrabold text-[#1976D2] mt-0.5 tracking-tight">
              {displayPrice}
            </div>

            {/* Subtitle / Category - Location */}
            <p className="text-[11px] sm:text-xs text-gray-400 font-normal mt-0.5 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
              <span>{ad.category?.name || ad.parent_category?.name || 'Объявление'} • {locationText}</span>
            </p>

            {/* Description snippet */}
            <p className="text-xs text-gray-600 mt-1 line-clamp-1 leading-snug">
              {ad.description || 'Подробности по телефону или в сообщении.'}
            </p>
          </div>

          {/* Author avatar & views */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-200 shrink-0">
                {ad.user?.avatar ? (
                  <LazyImage
                    src={ad.user.avatar}
                    alt={ad.user?.full_name || 'Seller'}
                    className="w-full h-full object-cover"
                    wrapperClassName="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1976D2]/10 text-[#1976D2] flex items-center justify-center font-bold text-[10px]">
                    {ad.user?.full_name ? ad.user.full_name.charAt(0).toUpperCase() : 'П'}
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold text-gray-700 truncate max-w-[90px] sm:max-w-[120px]">
                {ad.user?.full_name || 'Продавец'}
              </span>
            </div>

            {typeof ad.views === 'number' && ad.views > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                <Eye className="w-3 h-3" />
                <span>{ad.views}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Favorite Button */}
      <div className="absolute top-3 right-3 sm:static sm:flex sm:items-center sm:pr-1 shrink-0">
        <button
          type="button"
          id={`btn-fav-ad-${ad.id}`}
          onClick={handleFavoriteClick}
          className="w-9 h-9 rounded-2xl bg-gray-50/90 hover:bg-blue-50 border border-gray-100 flex items-center justify-center transition-all cursor-pointer group/btn"
          aria-label="В избранное"
          title={isFav ? "В избранном" : "Добавить в избранное"}
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
  );
};
