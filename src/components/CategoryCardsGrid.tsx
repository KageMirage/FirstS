'use client';

import React from 'react';
import { useCategories } from '../hooks/useCategories';
import { useSearchParams } from '../hooks/useSearchParams';
import { useUI } from '../hooks/useUI';
import { CategoryGridSkeleton } from './SkeletonLoader';
import { getCategoryAsset, renderCategoryTitle } from './category/categoryCardUtils';

export const CategoryCardsGrid: React.FC = () => {
  const { featuredCategories, isLoading } = useCategories();
  const [, setSearchParams] = useSearchParams();
  const { notify } = useUI();

  if (isLoading && featuredCategories.length === 0) {
    return <CategoryGridSkeleton count={7} />;
  }

  if (featuredCategories.length === 0) {
    return null;
  }

  const handleCardClick = (cat: { name: string; slug: string }) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('view', 'filter');
        next.set('category', cat.name);
        next.set('page', '1');
        return next;
      },
      { pathname: '/filter' }
    );
    notify(`Фильтр по категории: "${cat.name}"`, 'info');
  };

  return (
    <section className="py-3 sm:py-4" id="category-grid-section">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8">
        {/* Fully adaptive grid: 2 cols on mobile, 3 on sm, 4 on md, 7 on lg/xl */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5 xl:gap-3">
          {featuredCategories.map((item) => (
            <button
              key={item.id}
              id={`cat-card-${item.slug}`}
              onClick={() => handleCardClick(item)}
              className="flex items-center justify-between p-2.5 sm:p-3 xl:p-3.5 bg-white rounded-2xl border border-gray-100/90 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all duration-200 text-left group cursor-pointer min-h-[66px] sm:min-h-[72px] xl:min-h-[76px] overflow-hidden"
            >
              <div className="flex-1 pr-1 sm:pr-1.5 min-w-0 flex flex-col justify-center overflow-hidden">
                <h3 className="text-[11px] sm:text-xs xl:text-[13px] font-bold text-gray-900 group-hover:text-[#1976D2] transition-colors leading-[1.2] break-words">
                  {renderCategoryTitle(item.name)}
                </h3>
                <span className="text-[10px] sm:text-[11px] xl:text-xs text-gray-400 font-normal mt-0.5 block truncate">
                  ({item.count})
                </span>
              </div>

              <div className="w-9 h-9 sm:w-10 sm:h-10 xl:w-11 xl:h-11 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 pointer-events-none">
                {getCategoryAsset(item)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

