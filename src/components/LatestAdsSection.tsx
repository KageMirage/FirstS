'use client';

import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useAds } from '../hooks/useAds';
import { useSearchParams } from '../hooks/useSearchParams';
import { AdCard } from './AdCard';
import { FilterSidebar, FilterValues } from './FilterSidebar';
import { EmptyFilterState } from './EmptyFilterState';
import { AdsGridSkeleton } from './SkeletonLoader';

export const LatestAdsSection: React.FC = () => {
  const { ads, isLoading } = useAds();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL search params
  const qParam = (searchParams.get('q') || searchParams.get('search') || '').trim();
  const categoryParam = (searchParams.get('category') || '').trim();
  const minPriceParam = (searchParams.get('min_price') || '').trim();
  const maxPriceParam = (searchParams.get('max_price') || '').trim();
  const hasPhotoParam = searchParams.get('has_photo') === 'true';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // Initial filter values for the sidebar
  const initialFilterValues: FilterValues = useMemo(() => ({
    query: qParam,
    category: categoryParam,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    hasPhotoOnly: hasPhotoParam,
  }), [qParam, categoryParam, minPriceParam, maxPriceParam, hasPhotoParam]);

  // Check if any filter is currently active
  const hasActiveFilters = Boolean(
    qParam || categoryParam || minPriceParam || maxPriceParam || hasPhotoParam
  );

  // Helper for category matching without false positives
  const isCategoryMatch = (ad: any, categoryFilter: string): boolean => {
    if (!categoryFilter || categoryFilter === 'Во всех категориях' || categoryFilter === 'all') {
      return true;
    }
    const f = categoryFilter.toLowerCase().trim();
    if (!f) return true;

    // Direct category values from ad
    const adCatName = typeof ad.category === 'object' ? (ad.category?.name || '').toLowerCase().trim() : '';
    const adCatId = typeof ad.category === 'object' ? String(ad.category?.id ?? '') : String(ad.category ?? '');

    const adParentCatName = typeof ad.parent_category === 'object'
      ? (ad.parent_category?.name || '').toLowerCase().trim()
      : (typeof ad.category === 'object' && ad.category?.parent_category?.name ? ad.category.parent_category.name.toLowerCase().trim() : '');
    const adParentCatId = typeof ad.parent_category === 'object' ? String(ad.parent_category?.id ?? '') : '';

    const adSubTitle = (ad.subCategoryTitle || '').toLowerCase().trim();

    // 1. Numeric ID match (when filter is category ID)
    if (/^\d+$/.test(f)) {
      if (adCatId === f || adParentCatId === f) {
        return true;
      }
    }

    // 2. Direct string equality or clean substring matches against actual category names
    if (adCatName) {
      if (adCatName === f || adCatName.includes(f) || f.includes(adCatName)) {
        return true;
      }
    }
    if (adParentCatName) {
      if (adParentCatName === f || adParentCatName.includes(f) || f.includes(adParentCatName)) {
        return true;
      }
    }
    if (adSubTitle && adSubTitle !== 'объявление') {
      if (adSubTitle === f || adSubTitle.includes(f) || f.includes(adSubTitle)) {
        return true;
      }
    }

    // 3. Known UI labels from navigation and pills
    // "Услуги" <-> "Сервисы"
    if (f.includes('услуг') || f.includes('сервис')) {
      return adParentCatName.includes('сервис') || adParentCatName.includes('услуг');
    }
    // "Жумуш" <-> "Вакансии" / "Работа"
    if (f.includes('жумуш') || f.includes('ваканс') || f.includes('работ')) {
      return adParentCatName.includes('ваканс') || adParentCatName.includes('работ') || adCatName.includes('работ');
    }
    // "Снять/Сдам" <-> "Сниму" / "Сдаю" / "Жилье"
    if (f.includes('снять') || f.includes('сдам') || f.includes('жиль') || f.includes('аренд')) {
      return adParentCatName.includes('снять') || adParentCatName.includes('сдам') || adCatName.includes('жиль');
    }
    // "Продажа / Сатам" <-> "Продаю/Куплю"
    if (f.includes('прод') || f.includes('сатам') || f.includes('купл')) {
      return adParentCatName.includes('прод') || adParentCatName.includes('купл');
    }
    // "Издейм" <-> "Ищу"
    if (f.includes('издейм') || f.includes('ищу')) {
      return adParentCatName.includes('ищу') || adParentCatName.includes('издейм');
    }
    // "Обучение" <-> "Обучение и курсы"
    if (f.includes('обучен') || f.includes('курс')) {
      return adCatName.includes('обучен') || adCatName.includes('курс');
    }
    // "Такси / Груз" <-> "Транспорт" / "Такси"
    if (f.includes('такси') || f.includes('груз')) {
      return adCatName.includes('такси') || adCatName.includes('транспорт') || adCatName.includes('доставка');
    }
    // "Той кызмат" <-> "Для мероприятий"
    if (f.includes('той') || f.includes('мероприят')) {
      return adCatName.includes('мероприят') || adCatName.includes('той');
    }

    return false;
  };

  // Filter items in memory
  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      // 1. Search Query filter (title, description, subCategoryTitle, category name, address)
      if (qParam) {
        const queryLower = qParam.toLowerCase();
        const matchTitle = (ad.title || '').toLowerCase().includes(queryLower);
        const matchDesc = (ad.description || '').toLowerCase().includes(queryLower);
        const matchSub = (ad.subCategoryTitle || '').toLowerCase().includes(queryLower);
        const matchCat = typeof ad.category === 'object' ? (ad.category?.name || '').toLowerCase().includes(queryLower) : false;
        const matchParentCat = typeof ad.parent_category === 'object' ? (ad.parent_category?.name || '').toLowerCase().includes(queryLower) : false;
        const matchAddr = (ad.address || '').toLowerCase().includes(queryLower);

        if (!matchTitle && !matchDesc && !matchSub && !matchCat && !matchParentCat && !matchAddr) {
          return false;
        }
      }

      // 2. Category filter
      if (categoryParam && !isCategoryMatch(ad, categoryParam)) {
        return false;
      }

      // 3. Price Filter
      const priceNum = typeof ad.price === 'number' ? ad.price : parseFloat(String(ad.price).replace(/[^\d.]/g, '')) || 0;
      if (minPriceParam) {
        const minVal = parseFloat(minPriceParam);
        if (!isNaN(minVal) && priceNum < minVal) {
          return false;
        }
      }
      if (maxPriceParam) {
        const maxVal = parseFloat(maxPriceParam);
        if (!isNaN(maxVal) && priceNum > maxVal) {
          return false;
        }
      }

      // 4. Has Photo Filter
      if (hasPhotoParam) {
        if (!ad.image || typeof ad.image !== 'string' || !ad.image.trim()) {
          return false;
        }
      }

      return true;
    });
  }, [ads, qParam, categoryParam, minPriceParam, maxPriceParam, hasPhotoParam]);

  // Pagination calculations (10 items per page)
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredAds.length / pageSize));
  const currentSafePage = Math.min(currentPage, totalPages);
  
  const paginatedAds = useMemo(() => {
    const startIndex = (currentSafePage - 1) * pageSize;
    return filteredAds.slice(startIndex, startIndex + pageSize);
  }, [filteredAds, currentSafePage, pageSize]);

  // Handlers
  const handleApplyFilters = (values: FilterValues) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('view', 'filter');

        if (values.query.trim()) {
          next.set('q', values.query.trim());
          next.delete('search');
        } else {
          next.delete('q');
          next.delete('search');
        }

        if (values.category && values.category !== 'Во всех категориях') {
          next.set('category', values.category.trim());
        } else {
          next.delete('category');
          next.delete('pill');
        }

        if (values.minPrice && values.minPrice.trim()) next.set('min_price', values.minPrice.trim());
        else next.delete('min_price');

        if (values.maxPrice && values.maxPrice.trim()) next.set('max_price', values.maxPrice.trim());
        else next.delete('max_price');

        if (values.hasPhotoOnly) next.set('has_photo', 'true');
        else next.delete('has_photo');

        next.set('page', '1');
        return next;
      },
      { pathname: '/filter' }
    );

    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchParams(
      () => {
        const next = new URLSearchParams();
        next.set('view', 'filter');
        next.set('page', '1');
        return next;
      },
      { pathname: '/filter' }
    );
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('page', String(newPage));
          return next;
        },
        { pathname: '/filter' }
      );
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };


  // Generate page numbers for pagination
  const renderPaginationButtons = () => {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentSafePage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentSafePage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentSafePage, '...', totalPages);
      }
    }

    return (
      <div className="mt-10 flex items-center justify-center gap-2" id="pagination-controls">
        {/* Previous Page Button */}
        <button
          id="btn-page-prev"
          onClick={() => handlePageChange(currentSafePage - 1)}
          disabled={currentSafePage === 1}
          aria-label="Предыдущая страница"
          className={`w-9 h-9 rounded-xl flex items-center justify-center border text-sm font-medium transition-all ${
            currentSafePage === 1
              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 cursor-pointer'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`dots-${idx}`} className="px-1 text-gray-400 font-bold select-none">
                ...
              </span>
            );
          }

          const pageNum = Number(p);
          const isActive = pageNum === currentSafePage;

          return (
            <button
              key={pageNum}
              id={`btn-page-${pageNum}`}
              onClick={() => handlePageChange(pageNum)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1a73e8] text-white shadow-sm ring-2 ring-[#1a73e8]/20 font-bold'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Page Button */}
        <button
          id="btn-page-next"
          onClick={() => handlePageChange(currentSafePage + 1)}
          disabled={currentSafePage >= totalPages}
          aria-label="Следующая страница"
          className={`w-9 h-9 rounded-xl flex items-center justify-center border text-sm font-medium transition-all ${
            currentSafePage >= totalPages
              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 cursor-pointer'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <section className="py-6 pb-16" id="latest-ads-section">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {hasActiveFilters ? 'Результаты поиска' : 'Последние объявления'}
            </h2>
            {hasActiveFilters && (
              <button
                id="btn-reset-filters-badge"
                onClick={handleResetFilters}
                className="text-xs text-[#1a73e8] hover:underline flex items-center gap-1 font-medium bg-blue-50 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Сбросить фильтр</span>
              </button>
            )}
          </div>

          <div className="text-xs text-gray-500 font-medium">
            {filteredAds.length > 0 ? (
              <span>Найдено {filteredAds.length} объявл.</span>
            ) : (
              <span>0 объявлений</span>
            )}
          </div>
        </div>

        {/* Two Columns Layout: Left Filter Sidebar + Right Ad Grid / Empty State */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Column: Filter Sidebar Box & Side Banners */}
          <FilterSidebar
            initialValues={initialFilterValues}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />

          {/* Right Column: Main Ad Grid or Empty State */}
          <div className="flex-1 w-full flex flex-col justify-between min-h-[400px]">
            
            {isLoading && filteredAds.length === 0 ? (
              <AdsGridSkeleton count={6} />
            ) : filteredAds.length > 0 ? (
              <>
                {/* Grid of Ad Cards (2 columns on tablet/desktop to match Figma mockup) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="ads-grid-container">
                  {paginatedAds.map((ad) => (
                    <AdCard key={ad.id} ad={ad} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {renderPaginationButtons()}
              </>
            ) : (
              /* Empty State matching screenshot 3 */
              <EmptyFilterState onReset={handleResetFilters} />
            )}


          </div>

        </div>

      </div>
    </section>
  );
};
