'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { AdItem } from '../../types/api';
import { DEFAULT_USER_AVATAR } from '../../utils/authStorage';

interface AdRecentAdsListProps {
  ads: AdItem[];
  favoriteIds: number[];
  onSelectAd: (ad: AdItem) => void;
  onToggleFavorite: (id: number) => void;
}

export const AdRecentAdsList: React.FC<AdRecentAdsListProps> = ({
  ads,
  favoriteIds,
  onSelectAd,
  onToggleFavorite,
}) => {
  if (!ads || ads.length === 0) return null;

  return (
    <div className="pt-4" id="latest-ads-container">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-5 tracking-tight">
        Последние объявления
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {ads.map((ad) => {
          const isFav = favoriteIds.includes(ad.id);

          return (
            <div
              key={ad.id}
              id={`latest-ad-item-${ad.id}`}
              onClick={() => onSelectAd(ad)}
              className="bg-white rounded-3xl border border-gray-100/90 p-3 sm:p-4 shadow-xs hover:shadow-md hover:border-blue-200 transition-all duration-200 flex gap-3.5 sm:gap-4 cursor-pointer group"
              role="button"
              tabIndex={0}
            >
              {/* Left Thumbnail */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={ad.image || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop&q=80'}
                  alt={ad.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Right Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-[#1976D2] group-hover:underline line-clamp-1">
                    {ad.title}
                  </h4>
                  
                  <p className="text-xs text-gray-400 font-medium mt-1 truncate">
                    {ad.category?.name || ad.subCategoryTitle || 'Объявление'} • {ad.address || 'Бишкек'} • {ad.price ? `${ad.price} сом` : 'Договорная'}
                  </p>
                  
                  <p className="text-xs sm:text-sm text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {ad.description || 'Подробности по контактам в объявлении.'}
                  </p>
                </div>

                {/* Author + Blue Heart Button */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden shrink-0">
                      <img
                        src={ad.user?.avatar || DEFAULT_USER_AVATAR}
                        alt="Author"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate">
                      {ad.user?.full_name || 'user'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(ad.id);
                    }}
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
        })}
      </div>
    </div>
  );
};
