'use client';

import React, { useMemo, useState, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Inbox,
  Plus
} from 'lucide-react';
import { useAds } from '../hooks/useAds';
import { useCategories } from '../hooks/useCategories';
import { useUI } from '../hooks/useUI';
import { useSearchParams } from '../hooks/useSearchParams';
import { CategoryCardsGrid } from './CategoryCardsGrid';
import { AdCard } from './AdCard';
import { TopPillsBar } from './TopPillsBar';
import { SideBanners } from './SideBanners';
import { AdsGridSkeleton } from './SkeletonLoader';
import {
  BriefcaseArt,
  WhiteTruckArt,
  OrangeBackpackArt,
  SilverMinivanArt,
  BlueTruckArt,
  YellowTaxiArt,
  StrollerArt,
  WhiteSuvArt,
  SkyscraperArt,
  GroceryBagArt,
  KyrgyzKalpakArt,
  CoffeeMachineArt,
  ShoppingBagsArt,
  MedicalCareArt,
} from './CategoryArt';

// Partner slides for mobile banner carousel (matching screenshot with modern architecture villas)
const MOBILE_BANNER_SLIDES = [
  {
    id: 1,
    title: 'VIP Коттеджи и дома посуточно',
    subtitle: 'Бассейн, сауна, терраса в Москве и области',
    badge: 'Реклама',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80',
    type: 'real-estate' as const,
  },
  {
    id: 2,
    title: 'Элитная загородная недвижимость',
    subtitle: 'Панорамные окна, современные виллы',
    badge: 'Реклама',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=80',
    type: 'real-estate' as const,
  },
  {
    id: 3,
    title: 'АЙЗА-МЕД • Медицинский центр',
    subtitle: 'Все виды анализов, УЗИ, дневной стационар',
    badge: 'Реклама',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&auto=format&fit=crop&q=80',
    type: 'aiza-med' as const,
  },
  {
    id: 4,
    title: 'Такси Москва - Бишкек / Ош',
    subtitle: 'Ежедневные рейсы, комфортные минивэны',
    badge: 'Реклама',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop&q=80',
    type: 'aiza-med' as const,
  },
  {
    id: 5,
    title: 'Архитектура и дизайн интерьеров',
    subtitle: 'Премиальные проекты под ключ',
    badge: 'Реклама',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&auto=format&fit=crop&q=80',
    type: 'real-estate' as const,
  },
];

export const HomePage: React.FC = () => {
  const { ads, isLoading, error, loadAds } = useAds();
  const { featuredCategories } = useCategories();
  const { openCategoryMenu, openPartnerBanner, openPostAd } = useUI();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // 10 items per page matching Screenshot 1 & 2
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(ads.length / pageSize));
  const currentSafePage = Math.min(currentPage, totalPages);

  const paginatedAds = useMemo(() => {
    const startIndex = (currentSafePage - 1) * pageSize;
    return ads.slice(startIndex, startIndex + pageSize);
  }, [ads, currentSafePage, pageSize]);

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

  const handleBannerScroll = () => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    const scrollLeft = el.scrollLeft;
    const slideWidth = el.offsetWidth * 0.74;
    const newIdx = Math.round(scrollLeft / slideWidth);
    if (newIdx !== currentSlideIndex && newIdx >= 0 && newIdx < MOBILE_BANNER_SLIDES.length) {
      setCurrentSlideIndex(newIdx);
    }
  };

  const scrollToSlide = (idx: number) => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    const slideWidth = el.offsetWidth * 0.74;
    el.scrollTo({
      left: idx * slideWidth,
      behavior: 'smooth',
    });
    setCurrentSlideIndex(idx);
  };

  // Generate page numbers for pagination (< 1 2 3 ... 10 >)
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
      <div className="mt-8 sm:mt-10 flex items-center justify-center gap-1.5 sm:gap-2" id="home-pagination-controls">
        {/* Previous Page Button */}
        <button
          id="btn-home-page-prev"
          type="button"
          onClick={() => handlePageChange(currentSafePage - 1)}
          disabled={currentSafePage === 1}
          aria-label="Предыдущая страница"
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border text-sm font-medium transition-all ${
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
              <span key={`dots-${idx}`} className="px-1 text-gray-400 font-bold select-none text-xs sm:text-sm">
                ...
              </span>
            );
          }

          const pageNum = Number(p);
          const isActive = pageNum === currentSafePage;

          return (
            <button
              key={pageNum}
              id={`btn-home-page-${pageNum}`}
              type="button"
              onClick={() => handlePageChange(pageNum)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1976D2] text-white shadow-xs font-bold'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Page Button */}
        <button
          id="btn-home-page-next"
          type="button"
          onClick={() => handlePageChange(currentSafePage + 1)}
          disabled={currentSafePage >= totalPages}
          aria-label="Следующая страница"
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border text-sm font-medium transition-all ${
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
    <div className="space-y-4 pb-12 sm:pb-16" id="home-page-container">
      
      {/* MOBILE ONLY: Horizontal Category Cards from backend */}
      {featuredCategories.length > 0 && (
        <div className="sm:hidden pt-3 pb-1">
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-4 py-1">
            {featuredCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectPopular(cat.name)}
                className="bg-white rounded-2xl p-3 border border-gray-100 shadow-2xs flex items-center justify-between min-w-[155px] max-w-[170px] shrink-0 text-left hover:border-blue-200 active:scale-95 transition-all cursor-pointer group"
              >
                <div className="pr-1 flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 group-hover:text-[#1976D2] transition-colors leading-tight line-clamp-1">
                    {cat.name}
                  </p>
                  <p className="text-xs text-gray-400 font-medium mt-1">
                    ({cat.count})
                  </p>
                </div>
                <div className="w-10 h-10 shrink-0 flex items-center justify-center pointer-events-none">
                  {cat.image || cat.icon ? (
                    <img 
                      src={cat.image || cat.icon} 
                      alt={cat.name} 
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
      )}

      {/* DESKTOP ONLY: Category Pills & 14 Category Cards Grid */}
      <div className="hidden sm:block space-y-4">
        <div className="pt-2 sm:pt-3">
          <TopPillsBar />
        </div>
        <CategoryCardsGrid />
      </div>

      {/* Main Ads Section */}
      <section className="py-1 sm:py-4" id="home-latest-ads-section">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading (Desktop only, mobile flows seamlessly) */}
          <div className="hidden sm:flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Объявления
            </h2>
            <div className="text-xs text-gray-500 font-medium">
              <span>{ads.length} объявлений</span>
            </div>
          </div>

          {/* 2 Columns: Left 4 Banners (desktop) + Right 10 Ad Cards */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Left Column: 4 Partner Banners (hidden on mobile, shown on desktop) */}
            <div className="hidden lg:block">
              <SideBanners count={4} />
            </div>

            {/* Right Column: Ad Cards */}
            <div className="flex-1 w-full">
              {isLoading && ads.length === 0 ? (
                <AdsGridSkeleton count={6} />
              ) : error ? (
                <div className="bg-red-50/70 border border-red-200 rounded-2xl p-6 sm:p-8 text-center space-y-3.5 my-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <AlertCircle className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                      Ошибка соединения с сервером
                    </h3>
                    <p className="text-sm text-gray-600 max-w-md mx-auto">
                      {error}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Запросы логируются в консоль браузера (F12) для проверки работы API.
                  </p>
                  <button
                    type="button"
                    onClick={() => loadAds()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1976D2] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Повторить запрос
                  </button>
                </div>
              ) : ads.length === 0 ? (
                <div className="bg-white border border-gray-200/80 rounded-2xl p-8 sm:p-12 text-center space-y-4 my-2">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1976D2]">
                    <Inbox className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      Объявлений пока нет
                    </h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                      В базе данных пока отсутствуют записи. Добавьте данные в бекенд или создайте первое объявление.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => loadAds()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Обновить
                    </button>
                    <button
                      type="button"
                      onClick={() => openPostAd()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1976D2] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Подать объявление
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Mobile Ad Cards List */}
                  <div className="sm:hidden space-y-3">
                    {ads.map((ad) => (
                      <AdCard key={ad.id} ad={ad} />
                    ))}
                  </div>

                  {/* Desktop Ad Cards Grid (10 cards per page) */}
                  <div className="hidden sm:grid sm:grid-cols-2 gap-3.5 sm:gap-4">
                    {paginatedAds.map((ad) => (
                      <AdCard key={ad.id} ad={ad} />
                    ))}
                  </div>

                  {/* Pagination Controls - Desktop Only */}
                  {totalPages > 1 && (
                    <div className="hidden sm:block">
                      {renderPaginationButtons()}
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
