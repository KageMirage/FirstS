'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useUI } from '../hooks/useUI';
import { useAds } from '../hooks/useAds';
import { useCategories } from '../hooks/useCategories';
import { useSearchParams } from '../hooks/useSearchParams';
import { Category, ChildCategory } from '../types/api';
import { CategoryMenuList } from './category-menu/CategoryMenuList';
import { CategorySubmenuContent } from './category-menu/CategorySubmenuContent';

export const CategoryDropdownModal: React.FC = () => {
  const { isCategoryMenuOpen, closeCategoryMenu } = useUI();
  const { search } = useAds();
  const { categories, childCategories, isLoading } = useCategories();
  const [, setSearchParams] = useSearchParams();

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  useEffect(() => {
    if (categories.length > 0) {
      const preferred = categories.find((c) => {
        const n = c.name.toLowerCase();
        return n.includes('сервис') || n.includes('услуг');
      });
      setActiveCategoryId(preferred ? preferred.id : categories[0].id);
    }
  }, [categories]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCategoryMenuOpen) {
        closeCategoryMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCategoryMenuOpen, closeCategoryMenu]);

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

  const currentCategory: Category | undefined = categories.find((c) => c.id === activeCategoryId) || categories[0];
  const currentSubcategories: ChildCategory[] = currentCategory ? (childCategoriesByParent.get(currentCategory.id) || []) : [];

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
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px] transition-opacity duration-150"
        onClick={closeCategoryMenu}
        aria-label="Закрыть меню категорий"
      />

      <div className="relative z-10 bg-white border-b border-gray-200/80 shadow-2xl transition-all duration-200 max-h-[calc(100vh-80px)] overflow-y-auto">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
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
              <CategoryMenuList
                categories={categories}
                activeCategoryId={currentCategory?.id ?? null}
                onSelectCategory={(id) => setActiveCategoryId(id)}
              />

              <CategorySubmenuContent
                currentCategory={currentCategory}
                subcategories={currentSubcategories}
                onSelectCategory={handleSelectCategory}
                onSelectSubcategory={handleSelectSubcategory}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


