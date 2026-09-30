'use client';

import React from 'react';
export interface MobileCategoryItem {
  id: string | number;
  name: string;
  count?: number | string;
  num_of_ads?: number;
  image?: string;
  icon?: string;
}

interface MobileCategoryStripProps {
  categories: MobileCategoryItem[];
  onSelectCategory: (categoryName: string) => void;
}

export const MobileCategoryStrip: React.FC<MobileCategoryStripProps> = ({
  categories,
  onSelectCategory,
}) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="sm:hidden pt-3 pb-1" id="mobile-featured-categories">
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-4 py-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.name)}
            className="bg-white rounded-2xl p-3 border border-gray-100 shadow-2xs flex items-center justify-between min-w-[155px] max-w-[170px] shrink-0 text-left hover:border-blue-200 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="pr-1 flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 group-hover:text-[#1976D2] transition-colors leading-tight line-clamp-1">
                {cat.name}
              </p>
              <p className="text-xs text-gray-400 font-medium mt-1">
                ({cat.count ?? 0})
              </p>
            </div>
            <div className="w-10 h-10 shrink-0 flex items-center justify-center pointer-events-none">
              {cat.image || cat.icon ? (
                <img 
                  src={cat.image || cat.icon} 
                  alt={cat.name} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full max-h-9 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1976D2] flex items-center justify-center font-bold text-xs">
                  {cat.name.charAt(0)}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
