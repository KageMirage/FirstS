import React from 'react';

// Single Category Card Skeleton
export const CategoryCardSkeleton: React.FC = () => (
  <div className="flex items-center justify-between p-3 sm:p-3.5 bg-white rounded-2xl border border-gray-100 shadow-2xs min-h-[72px] sm:min-h-[76px] animate-pulse">
    <div className="flex-1 pr-2 space-y-2">
      <div className="h-3.5 bg-gray-200 rounded-md w-3/4"></div>
      <div className="h-2.5 bg-gray-100 rounded-md w-1/3"></div>
    </div>
    <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0"></div>
  </div>
);

// 14 Category Cards Grid Skeleton
export const CategoryGridSkeleton: React.FC<{ count?: number }> = ({ count = 14 }) => (
  <section className="py-4 sm:py-5" id="category-grid-skeleton">
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </section>
);

// Single Ad Card Skeleton
export const AdCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-3xl border border-gray-100/90 p-3 sm:p-4 shadow-xs flex gap-3.5 sm:gap-4 animate-pulse">
    {/* Left Image Placeholder */}
    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl bg-gray-200 shrink-0 relative overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </div>

    {/* Right Content */}
    <div className="flex-1 flex flex-col justify-between py-0.5 space-y-2">
      <div className="space-y-2">
        {/* Title */}
        <div className="h-4 bg-gray-200 rounded-md w-4/5"></div>
        <div className="h-3 bg-gray-100 rounded-md w-3/5"></div>
      </div>

      {/* Price tag */}
      <div className="h-5 bg-blue-100/70 rounded-md w-28 my-1"></div>

      {/* Location / Meta */}
      <div className="flex items-center justify-between pt-1">
        <div className="h-3 bg-gray-100 rounded-md w-24"></div>
        <div className="w-6 h-6 rounded-full bg-gray-100"></div>
      </div>
    </div>
  </div>
);

// Grid of Ad Card Skeletons
export const AdsGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="ads-skeleton-grid">
    {Array.from({ length: count }).map((_, i) => (
      <AdCardSkeleton key={i} />
    ))}
  </div>
);

// Top Pills Bar Skeleton
export const PillsBarSkeleton: React.FC = () => (
  <div className="py-3 overflow-x-auto no-scrollbar">
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2.5 min-w-max animate-pulse">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="h-9 w-28 bg-gray-100 rounded-2xl"></div>
      ))}
    </div>
  </div>
);
