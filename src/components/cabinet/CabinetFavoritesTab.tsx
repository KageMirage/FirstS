'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AdCard } from '../AdCard';
import { AdItem } from '../../types/api';

interface CabinetFavoritesTabProps {
  favoriteAds: AdItem[];
  onExploreCatalog: () => void;
}

export const CabinetFavoritesTab: React.FC<CabinetFavoritesTabProps> = ({
  favoriteAds,
  onExploreCatalog,
}) => {
  const [favPage, setFavPage] = useState(1);
  const itemsPerPage = 6;
  const totalFavPages = Math.max(1, Math.ceil(favoriteAds.length / itemsPerPage));
  const currentSafeFavPage = Math.min(favPage, totalFavPages);

  const paginatedFavorites = favoriteAds.slice(
    (currentSafeFavPage - 1) * itemsPerPage,
    currentSafeFavPage * itemsPerPage
  );

  return (
    <div className="space-y-6" id="my-favorites-section">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Мои избранные
        </h1>
        {favoriteAds.length > 0 && (
          <span className="text-sm font-semibold text-gray-500">
            Всего: {favoriteAds.length}
          </span>
        )}
      </div>

      {favoriteAds.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedFavorites.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>

          {/* Pagination */}
          {totalFavPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-4">
              <button
                type="button"
                disabled={currentSafeFavPage <= 1}
                onClick={() => setFavPage((p) => Math.max(1, p - 1))}
                className="w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalFavPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFavPage(num)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer ${
                    currentSafeFavPage === num
                      ? 'bg-[#1976D2] text-white shadow-xs'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                disabled={currentSafeFavPage >= totalFavPages}
                onClick={() => setFavPage((p) => Math.min(totalFavPages, p + 1))}
                className="w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-gray-100 p-10 sm:p-14 text-center flex flex-col items-center justify-center min-h-[380px] shadow-xs">
          <div className="w-52 h-40 mb-5 relative flex items-center justify-center">
            <svg viewBox="0 0 240 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="120" cy="155" rx="100" ry="16" fill="#f8fafc" />
              <rect x="85" y="120" width="46" height="34" rx="4" fill="#3b82f6" />
              <rect x="81" y="116" width="54" height="7" rx="2" fill="#1d4ed8" />
              <circle cx="108" cy="138" r="9" fill="white" />
              <path d="M108 143 L104 138 C102.5 136.5 102.5 134 104 133 C105.5 132 107.5 133 108 134.5 C108.5 133 110.5 132 112 133 C113.5 134 113.5 136.5 112 138 Z" fill="#ef4444" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Ваш Список Желаний Пуст
          </h2>
          <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
            Сердце ждет, когда вы выберете что-нибудь особенное!
          </p>

          <button
            type="button"
            onClick={onExploreCatalog}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1976D2] hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-xs transition cursor-pointer"
          >
            <span>Перейти в каталог</span>
          </button>
        </div>
      )}
    </div>
  );
};
