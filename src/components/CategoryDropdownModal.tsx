'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  GraduationCap, 
  Briefcase, 
  Search, 
  Headphones, 
  Car, 
  Home, 
  Tag, 
  Zap,
  Newspaper,
  ChevronRight,
  X,
  Loader2
} from 'lucide-react';
import { useUI } from '../hooks/useUI';
import { useAds } from '../hooks/useAds';
import { useCategories } from '../hooks/useCategories';
import { useSearchParams } from '../hooks/useSearchParams';
import { Category, ChildCategory } from '../types/api';

// Helper to provide suitable Lucide icon for any category from backend
const getCategoryLucideIcon = (name: string): React.ComponentType<{ className?: string }> => {
  const n = name.toLowerCase();
  if (n.includes('услуг') || n.includes('сервис')) return ShoppingBag;
  if (n.includes('обучен') || n.includes('курс')) return GraduationCap;
  if (n.includes('ваканс') || n.includes('работ') || n.includes('жумуш')) return Briefcase;
  if (n.includes('ищу') || n.includes('издейм')) return Search;
  if (n.includes('той') || n.includes('мероприят')) return Headphones;
  if (n.includes('сдам') || n.includes('сниму') || n.includes('жиль') || n.includes('комнат')) return Home;
  if (n.includes('такси') || n.includes('транспорт') || n.includes('груз') || n.includes('авто')) return Car;
  if (n.includes('прода') || n.includes('купл') || n.includes('сатам')) return Tag;
  if (n.includes('рэс') || n.includes('электр')) return Zap;
  if (n.includes('новост')) return Newspaper;
  return ShoppingBag;
};

export const CategoryDropdownModal: React.FC = () => {
  const { isCategoryMenuOpen, closeCategoryMenu } = useUI();
  const { search } = useAds();
  const { categories, childCategories, isLoading } = useCategories();
  const [, setSearchParams] = useSearchParams();

  // Active category id selected in the left list
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  // Set default active category when categories load
  useEffect(() => {
    if (categories.length > 0) {
      // Prefer "Сервисы" or "Услуги" first, or the first category
      const preferred = categories.find((c) => {
        const n = c.name.toLowerCase();
        return n.includes('сервис') || n.includes('услуг');
      });
      setActiveCategoryId(preferred ? preferred.id : categories[0].id);
    }
  }, [categories]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCategoryMenuOpen) {
        closeCategoryMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCategoryMenuOpen, closeCategoryMenu]);

  // Group child categories by their parent category ID
  const childCategoriesByParent = useMemo(() => {
    const map = new Map<number, ChildCategory[]>();
    for (const child of childCategories) {
      const parentId = child.parent;
      if (!map.has(parentId)) {
        map.set(parentId, []);
      }
      map.get(parentId)!.push(child);
    }
    return map;
  }, [childCategories]);

  if (!isCategoryMenuOpen) return null;

  // Selected category object
  const currentCategory: Category | undefined = categories.find((c) => c.id === activeCategoryId) || categories[0];
  const currentSubcategories: ChildCategory[] = currentCategory ? (childCategoriesByParent.get(currentCategory.id) || []) : [];

  // Split subcategories into 2 balanced columns matching the visual layout
  const midPoint = Math.ceil(currentSubcategories.length / 2);
  const col1 = currentSubcategories.slice(0, midPoint);
  const col2 = currentSubcategories.slice(midPoint);

  // Helper to trigger search and navigation
  const handleSelectCategory = (cat: Category) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('view', 'filter');
        next.set('category', cat.name);
        next.delete('search');
        next.delete('q');
        next.set('page', '1');
        return next;
      },
      { pathname: '/filter' }
    );

    search('');
    closeCategoryMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSubcategory = (_cat: Category, subcat: ChildCategory) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('view', 'filter');
        next.set('category', subcat.name);
        next.delete('search');
        next.delete('q');
        next.set('page', '1');
        return next;
      },
      { pathname: '/filter' }
    );

    search('');
    closeCategoryMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      className="fixed inset-0 top-16 sm:top-20 z-40" 
      id="modal-categories-menu"
    >
      {/* 1. Backdrop Overlay (click to dismiss) */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px] transition-opacity duration-150"
        onClick={closeCategoryMenu}
        aria-label="Закрыть меню категорий"
      />

      {/* 2. Mega Menu Container anchored right below Navbar */}
      <div className="relative z-10 bg-white border-b border-gray-200/80 shadow-2xl transition-all duration-200 max-h-[calc(100vh-80px)] overflow-y-auto">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
          
          {/* Mobile close button (only visible on small screens) */}
          <div className="flex md:hidden items-center justify-between pb-4 mb-4 border-b border-gray-100">
            <span className="font-bold text-gray-900 text-base">Все категории</span>
            <button
              type="button"
              onClick={closeCategoryMenu}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isLoading && categories.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#1976D2]" />
              <p className="text-sm font-medium">Загрузка категорий из базы...</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-start gap-8 lg:gap-16 min-h-[360px]">
              
              {/* LEFT COLUMN: Categories vertical list (directly from backend API) */}
              <div className="w-full md:w-64 lg:w-72 shrink-0 space-y-1">
                {categories.map((cat) => {
                  const IconComp = getCategoryLucideIcon(cat.name);
                  const isActive = currentCategory?.id === cat.id;

                  return (
                    <button
                      key={cat.id}
                      id={`cat-menu-item-${cat.id}`}
                      type="button"
                      onClick={() => setActiveCategoryId(cat.id)}
                      onMouseEnter={() => setActiveCategoryId(cat.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer text-left ${
                        isActive 
                          ? 'text-[#1976D2] font-semibold bg-blue-50/50' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/70 font-normal'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* If category has icon URL from backend, use it; otherwise fallback to matching Lucide icon */}
                        {cat.icon ? (
                          <div className="w-5 h-5 flex items-center justify-center shrink-0">
                            <img 
                              src={cat.icon} 
                              alt="" 
                              className="w-5 h-5 object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }} 
                            />
                          </div>
                        ) : (
                          <IconComp 
                            className={`w-5 h-5 shrink-0 transition-colors ${
                              isActive ? 'text-[#1976D2]' : 'text-gray-400'
                            }`} 
                          />
                        )}
                        
                        <span className="text-sm lg:text-[15px] truncate">
                          {cat.name}
                        </span>
                      </div>

                      {/* Counter or subtle arrow */}
                      <div className="flex items-center gap-2">
                        {typeof cat.num_of_ads === 'number' && cat.num_of_ads > 0 && (
                          <span className="text-xs text-gray-400 font-medium">
                            {cat.num_of_ads}
                          </span>
                        )}
                        <ChevronRight 
                          className={`w-4 h-4 transition-transform ${
                            isActive ? 'text-[#1976D2] translate-x-0.5' : 'text-gray-300 md:opacity-0'
                          }`} 
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* RIGHT AREA: Active Category Title and Multi-Column Subcategories (from backend) */}
              <div className="flex-1 w-full pt-1">
                {currentCategory ? (
                  <>
                    {/* Category Title matching screenshot */}
                    <button
                      type="button"
                      onClick={() => handleSelectCategory(currentCategory)}
                      className="text-xl sm:text-2xl font-bold text-[#1976D2] hover:underline mb-6 text-left cursor-pointer transition-colors block"
                    >
                      {currentCategory.name}
                    </button>

                    {/* Subcategories columns directly from backend */}
                    {currentSubcategories.length === 0 ? (
                      <div className="py-8 text-gray-400 text-sm">
                        В данной категории пока нет отдельных подкатегорий. Кликните на название категории, чтобы просмотреть все объявления.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-3.5">
                        
                        {/* Column 1 */}
                        <div className="space-y-3.5">
                          {col1.map((subcat) => (
                            <button
                              key={`col1-${subcat.id}-${subcat.name}`}
                              type="button"
                              onClick={() => handleSelectSubcategory(currentCategory, subcat)}
                              className="block text-left text-sm lg:text-[15px] text-gray-700 hover:text-[#1976D2] transition-colors cursor-pointer w-full py-0.5"
                            >
                              {subcat.name}
                              {typeof subcat.num_of_ads === 'number' && subcat.num_of_ads > 0 && (
                                <span className="text-xs text-gray-400 ml-2">
                                  ({subcat.num_of_ads})
                                </span>
                              )}
                            </button>
                          ))}
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-3.5">
                          {col2.map((subcat) => (
                            <button
                              key={`col2-${subcat.id}-${subcat.name}`}
                              type="button"
                              onClick={() => handleSelectSubcategory(currentCategory, subcat)}
                              className="block text-left text-sm lg:text-[15px] text-gray-700 hover:text-[#1976D2] transition-colors cursor-pointer w-full py-0.5"
                            >
                              {subcat.name}
                              {typeof subcat.num_of_ads === 'number' && subcat.num_of_ads > 0 && (
                                <span className="text-xs text-gray-400 ml-2">
                                  ({subcat.num_of_ads})
                                </span>
                              )}
                            </button>
                          ))}
                        </div>

                      </div>
                    )}
                  </>
                ) : null}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};


