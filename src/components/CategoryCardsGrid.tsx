'use client';

import React from 'react';
import { useCategories } from '../hooks/useCategories';
import { useSearchParams } from '../hooks/useSearchParams';
import { useUI } from '../hooks/useUI';
import { CategoryGridSkeleton } from './SkeletonLoader';
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

export const CategoryCardsGrid: React.FC = () => {
  const { featuredCategories, isLoading } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
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

  // High-fidelity graphic from backend image/icon, or fallback icon
  const getCategoryAsset = (item: { name: string; image?: string; icon?: string }) => {
    if (item.image || item.icon) {
      return (
        <img 
          src={item.image || item.icon} 
          alt={item.name}
          className="w-full h-full max-h-9 sm:max-h-10 xl:max-h-11 object-contain"
          onError={(e) => {
            // If image fails, hide image element
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      );
    }

    const n = item.name.toLowerCase();
    if (n.includes('ваканс') || n.includes('работ') || n.includes('жумуш')) {
      return <BriefcaseArt className="w-full h-full max-h-9 sm:max-h-10 xl:max-h-11 object-contain" />;
    }
    if (n.includes('снять') || n.includes('сдам') || n.includes('недвиж') || n.includes('жиль')) {
      return <SkyscraperArt className="w-full h-full max-h-9 sm:max-h-10 xl:max-h-11 object-contain" />;
    }
    if (n.includes('прод') || n.includes('купл') || n.includes('товар')) {
      return <ShoppingBagsArt className="w-full h-full max-h-9 sm:max-h-10 xl:max-h-11 object-contain" />;
    }
    if (n.includes('авто') || n.includes('машин') || n.includes('транспорт')) {
      return <WhiteSuvArt className="w-full h-full max-h-8 sm:max-h-9 xl:max-h-10 object-contain" />;
    }
    if (n.includes('такси')) {
      return <YellowTaxiArt className="w-full h-full max-h-8 sm:max-h-9 xl:max-h-10 object-contain" />;
    }
    if (n.includes('груз')) {
      return <BlueTruckArt className="w-full h-full max-h-9 sm:max-h-9 xl:max-h-10 object-contain" />;
    }
    if (n.includes('сервис') || n.includes('услуг')) {
      return <MedicalCareArt className="w-full h-full max-h-9 sm:max-h-10 xl:max-h-11 object-contain" />;
    }
    if (n.includes('техник') || n.includes('электрон')) {
      return <CoffeeMachineArt className="w-full h-full max-h-9 sm:max-h-10 xl:max-h-11 object-contain" />;
    }
    return <BriefcaseArt className="w-full h-full max-h-9 sm:max-h-10 xl:max-h-11 object-contain" />;
  };

  // Cleanly formatted category labels that never collide with the graphic
  const renderCategoryTitle = (name: string) => {
    switch (name) {
      case 'Грузоперевозка':
        return (
          <>
            <span className="block">Грузо-</span>
            <span className="block">перевозка</span>
          </>
        );
      case 'Техника и Электроника':
        return (
          <>
            <span className="block">Техника и</span>
            <span className="block">электроника</span>
          </>
        );
      case 'Такси заезд-выезд':
        return (
          <>
            <span className="block">Такси</span>
            <span className="block">заезд-выезд</span>
          </>
        );
      case 'Товары Кыргызста':
      case 'Товары Кыргызстана':
        return (
          <>
            <span className="block">Товары</span>
            <span className="block">Кыргызстана</span>
          </>
        );
      case 'Медицинский услуги':
      case 'Медицинские услуги':
        return (
          <>
            <span className="block">Медицинские</span>
            <span className="block">услуги</span>
          </>
        );
      case 'Продукты питания':
        return (
          <>
            <span className="block">Продукты</span>
            <span className="block">питания</span>
          </>
        );
      case 'Интернет магазин':
        return (
          <>
            <span className="block">Интернет</span>
            <span className="block">магазин</span>
          </>
        );
      case 'Продам товар':
        return (
          <>
            <span className="block">Продам</span>
            <span className="block">товар</span>
          </>
        );
      case 'Продам авто':
        return (
          <>
            <span className="block">Продам</span>
            <span className="block">авто</span>
          </>
        );
      case 'Ищу работу':
        return (
          <>
            <span className="block">Ищу</span>
            <span className="block">работу</span>
          </>
        );
      case 'Москва-Бишкек':
        return (
          <>
            <span className="block">Москва-</span>
            <span className="block">Бишкек</span>
          </>
        );
      default:
        return <span>{name}</span>;
    }
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
              {/* Left Text Container - Guaranteed isolated boundary */}
              <div className="flex-1 pr-1 sm:pr-1.5 min-w-0 flex flex-col justify-center overflow-hidden">
                <h3 className="text-[11px] sm:text-xs xl:text-[13px] font-bold text-gray-900 group-hover:text-[#1976D2] transition-colors leading-[1.2] break-words">
                  {renderCategoryTitle(item.name)}
                </h3>
                <span className="text-[10px] sm:text-[11px] xl:text-xs text-gray-400 font-normal mt-0.5 block truncate">
                  ({item.count})
                </span>
              </div>

              {/* Right Illustration Container - Rigid fixed bounding box */}
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

