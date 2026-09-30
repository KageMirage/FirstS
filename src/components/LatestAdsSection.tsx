'use client';

import React, { useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAds } from '../hooks/useAds';
import { useSearchParams } from '../hooks/useSearchParams';
import { AdCard } from './AdCard';
import { FilterSidebar, FilterValues } from './FilterSidebar';
import { EmptyFilterState } from './EmptyFilterState';
import { AdsGridSkeleton } from './SkeletonLoader';
import { HomePagination } from './home/HomePagination';
import { filterAdsList } from '../utils/adFilterMatcher';

export const LatestAdsSection: React.FC = () => {
  const { ads, isLoading } = useAds();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL search params
  const qParam = (searchParams.get('q') || searchParams.get('search') || '').trim();
  const categoryParam = (searchParams.get('category') || '').trim();
  const regionParam = (searchParams.get('region') || '').trim();
  const minPriceParam = (searchParams.get('min_price') || '').trim();
  const maxPriceParam = (searchParams.get('max_price') || '').trim();
  const hasPhotoParam = searchParams.get('has_photo') === 'true';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const initialFilterValues: FilterValues = useMemo(() => ({
    query: qParam,
    category: categoryParam,
    region: regionParam,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    hasPhotoOnly: hasPhotoParam,
  }), [qParam, categoryParam, regionParam, minPriceParam, maxPriceParam, hasPhotoParam]);

  const hasActiveFilters = Boolean(
    qParam || categoryParam || regionParam || minPriceParam || maxPriceParam || hasPhotoParam
  );

  const filteredAds = useMemo(() => {
    return filterAdsList(ads, {
      query: qParam,
      category: categoryParam,
      region: regionParam,
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      hasPhotoOnly: hasPhotoParam,
    });
  }, [ads, qParam, categoryParam, regionParam, minPriceParam, maxPriceParam, hasPhotoParam]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredAds.length / pageSize));
  const currentSafePage = Math.min(currentPage, totalPages);
  
  const paginatedAds = useMemo(() => {
    const startIndex = (currentSafePage - 1) * pageSize;
    return filteredAds.slice(startIndex, startIndex + pageSize);
  }, [filteredAds, currentSafePage, pageSize]);

  const handleApplyFilters = (vals: FilterValues) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('view', 'filter');
        if (vals.query) next.set('q', vals.query); else next.delete('q');
        if (vals.category) next.set('category', vals.category); else next.delete('category');
        if (vals.region) next.set('region', vals.region); else next.delete('region');
        if (vals.minPrice) next.set('min_price', vals.minPrice); else next.delete('min_price');
        if (vals.maxPrice) next.set('max_price', vals.maxPrice); else next.delete('max_price');
        if (vals.hasPhotoOnly) next.set('has_photo', 'true'); else next.delete('has_photo');
        next.set('page', '1');
        return next;
      },
      { pathname: '/filter' }
    );
  };

  const handleResetFilters = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        ['q', 'search', 'category', 'region', 'min_price', 'max_price', 'has_photo', 'page', 'pill'].forEach((k) => next.delete(k));
        return next;
      },
      { pathname: '/filter' }
    );
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
    const el = document.getElementById('latest-ads-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="py-6 sm:py-8" id="latest-ads-section">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {hasActiveFilters ? 'Результаты поиска' : 'Последние объявления'}
            </h2>
            {hasActiveFilters && (
              <button
                id="btn-reset-filters-badge"
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-[#1976D2] hover:underline flex items-center gap-1 font-medium bg-blue-50 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Сбросить фильтр</span>
              </button>
            )}
          </div>
          <div className="text-xs text-gray-500 font-medium">
            {filteredAds.length > 0 ? `Найдено ${filteredAds.length} объявл.` : '0 объявлений'}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <FilterSidebar
            initialValues={initialFilterValues}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />

          <div className="flex-1 w-full flex flex-col justify-between min-h-[400px]">
            {isLoading && filteredAds.length === 0 ? (
              <AdsGridSkeleton count={6} />
            ) : filteredAds.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="ads-grid-container">
                  {paginatedAds.map((ad) => (
                    <AdCard key={ad.id} ad={ad} />
                  ))}
                </div>
                <HomePagination
                  currentPage={currentSafePage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <EmptyFilterState onReset={handleResetFilters} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
