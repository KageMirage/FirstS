'use client';

import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAds } from '../hooks/useAds';
import { useCategories } from '../hooks/useCategories';
import { useUI } from '../hooks/useUI';
import { useSearchParams } from '../hooks/useSearchParams';
import { CategoryCardsGrid } from './CategoryCardsGrid';
import { AdCard } from './AdCard';
import { TopPillsBar } from './TopPillsBar';
import { SideBanners } from './SideBanners';
import { AdsGridSkeleton } from './SkeletonLoader';
import { MobileCategoryStrip } from './home/MobileCategoryStrip';
import { HomePagination } from './home/HomePagination';
import { HomeAdsFeedback } from './home/HomeAdsFeedback';

export const HomePage: React.FC = () => {
  const { ads, isLoading, error, loadAds } = useAds();
  const { featuredCategories } = useCategories();
  const { openPostAd } = useUI();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // 10 items per page on desktop
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(ads.length / pageSize));
  const currentSafePage = Math.min(currentPage, totalPages);

  const paginatedAds = useMemo(() => {
    const startIndex = (currentSafePage - 1) * pageSize;
    return ads.slice(startIndex, startIndex + pageSize);
  }, [ads, currentSafePage, pageSize]);

  // Mobile Progressive Lazy Loading (avoids rendering all DOM nodes at once)
  const [visibleMobileCount, setVisibleMobileCount] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const mobileSentinelRef = useRef<HTMLDivElement>(null);

  const mobileVisibleAds = useMemo(() => {
    return ads.slice(0, visibleMobileCount);
  }, [ads, visibleMobileCount]);

  const handleLoadMoreMobile = useCallback(() => {
    if (visibleMobileCount >= ads.length) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleMobileCount((prev) => Math.min(prev + 6, ads.length));
      setIsLoadingMore(false);
    }, 150);
  }, [visibleMobileCount, ads.length]);

  useEffect(() => {
    if (!mobileSentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleMobileCount < ads.length) {
          handleLoadMoreMobile();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(mobileSentinelRef.current);
    return () => observer.disconnect();
  }, [handleLoadMoreMobile, visibleMobileCount, ads.length]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('page', String(newPage));
          return next;
        },
        { pathname: '/' }
      );
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  const handleSelectPopular = (categoryName: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('view', 'filter');
        next.set('category', categoryName);
        next.set('page', '1');
        return next;
      },
      { pathname: '/filter' }
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4 pb-12 sm:pb-16" id="home-page-container">
      {/* Category Pills Bar (Adaptive on Mobile & Desktop) */}
      <div className="pt-1 sm:pt-2">
        <TopPillsBar />
      </div>

      {/* MOBILE ONLY: Horizontal Category Cards */}
      <MobileCategoryStrip
        categories={featuredCategories}
        onSelectCategory={handleSelectPopular}
      />

      {/* DESKTOP ONLY: 14 Category Cards Grid */}
      <div className="hidden sm:block space-y-4">
        <CategoryCardsGrid />
      </div>

      {/* Main Ads Section */}
      <section className="py-1 sm:py-4" id="home-latest-ads-section">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="hidden sm:flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Объявления
            </h2>
            <div className="text-xs text-gray-500 font-medium">
              <span>{ads.length} объявлений</span>
            </div>
          </div>

          {/* 2 Columns: Left 4 Banners (desktop) + Right Ad Cards */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="hidden lg:block">
              <SideBanners count={4} />
            </div>

            <div className="flex-1 w-full">
              {isLoading && ads.length === 0 ? (
                <AdsGridSkeleton count={6} />
              ) : error || ads.length === 0 ? (
                <HomeAdsFeedback
                  error={error}
                  onRetry={() => loadAds({ force: true })}
                  onPostAd={openPostAd}
                />
              ) : (
                <>
                  {/* Mobile Ad Cards List with Progressive Lazy Loading */}
                  <div className="sm:hidden space-y-3">
                    {mobileVisibleAds.map((ad) => (
                      <AdCard key={ad.id} ad={ad} />
                    ))}

                    {visibleMobileCount < ads.length && (
                      <div ref={mobileSentinelRef} className="pt-2 pb-4 text-center">
                        <button
                          type="button"
                          onClick={handleLoadMoreMobile}
                          disabled={isLoadingMore}
                          className="w-full py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                        >
                          {isLoadingMore ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#1976D2]" />
                              <span>Загрузка объявлений...</span>
                            </>
                          ) : (
                            <span>Показать ещё (осталось {ads.length - visibleMobileCount})</span>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Desktop Ad Cards Grid (10 cards per page) */}
                  <div className="hidden sm:grid sm:grid-cols-2 gap-3.5 sm:gap-4">
                    {paginatedAds.map((ad) => (
                      <AdCard key={ad.id} ad={ad} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="hidden sm:block">
                      <HomePagination
                        currentPage={currentSafePage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
