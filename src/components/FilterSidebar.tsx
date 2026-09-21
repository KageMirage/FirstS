'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { SideBanners } from './SideBanners';

export interface FilterValues {
  query: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  hasPhotoOnly: boolean;
}

interface FilterSidebarProps {
  initialValues: FilterValues;
  onApply: (values: FilterValues) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  initialValues,
  onApply,
  onReset,
}) => {
  const { categories, childCategories } = useCategories();
  const [query, setQuery] = useState(initialValues.query || '');
  const [category, setCategory] = useState(initialValues.category || '');
  const [minPrice, setMinPrice] = useState(initialValues.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(initialValues.maxPrice || '');
  const [hasPhotoOnly, setHasPhotoOnly] = useState(initialValues.hasPhotoOnly || false);

  // Sync internal state when initialValues change (e.g. on URL searchParams changes or external resets)
  useEffect(() => {
    setQuery(initialValues.query || '');
    setCategory(initialValues.category || '');
    setMinPrice(initialValues.minPrice || '');
    setMaxPrice(initialValues.maxPrice || '');
    setHasPhotoOnly(initialValues.hasPhotoOnly || false);
  }, [
    initialValues.query,
    initialValues.category,
    initialValues.minPrice,
    initialValues.maxPrice,
    initialValues.hasPhotoOnly,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({
      query,
      category,
      minPrice,
      maxPrice,
      hasPhotoOnly,
    });
  };

  const handleResetClick = () => {
    setQuery('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setHasPhotoOnly(false);
    onReset();
  };

  // Combine backend categories and childCategories from database
  const categoryOptions = [
    { id: '', name: 'Во всех категориях' },
    ...categories.map((c) => ({ id: c.name, name: c.name })),
    ...childCategories.map((c) => ({ id: c.name, name: c.name })),
  ].filter((v, i, a) => a.findIndex((t) => t.name === v.name) === i);

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4" id="filter-sidebar">
      
      {/* Filter Control Box matching Screenshot 3 */}
      <div className="bg-white rounded-2xl border border-gray-200/70 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]" id="filter-box">
        <h3 className="text-base font-bold text-gray-900 tracking-tight">
          Фильтр
        </h3>

        <hr className="border-gray-100 my-3.5" />

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. Ваш поиск */}
          <div>
            <label htmlFor="filter-search-input" className="block text-xs font-semibold text-gray-800 mb-1.5">
              Ваш поиск
            </label>
            <input
              id="filter-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Квартира"
              className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-gray-200/70 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/10 transition-all"
            />
          </div>

          {/* 2. Категории */}
          <div>
            <label htmlFor="filter-category-select" className="block text-xs font-semibold text-gray-800 mb-1.5">
              Категории
            </label>
            <div className="relative">
              <select
                id="filter-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 pr-9 bg-[#f8f9fa] border border-gray-200/70 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/10 cursor-pointer transition-all"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.id || 'all'} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 3. Цена */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1.5">
              Цена
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                id="filter-min-price-input"
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-gray-200/70 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/10 transition-all"
              />
              <input
                id="filter-max-price-input"
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-gray-200/70 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/10 transition-all"
              />
            </div>
          </div>

          {/* 4. Показать только */}
          <div>
            <span className="block text-xs font-medium text-gray-500 mb-2">
              Показать только
            </span>
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-gray-700 group">
              <div className="relative flex items-center justify-center">
                <input
                  id="filter-has-photo-checkbox"
                  type="checkbox"
                  checked={hasPhotoOnly}
                  onChange={(e) => setHasPhotoOnly(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded-md border border-gray-300 peer-checked:bg-[#1a73e8] peer-checked:border-[#1a73e8] transition-all flex items-center justify-center group-hover:border-[#1a73e8]">
                  <Check className="w-3 h-3 text-white stroke-[2.5] opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
              </div>
              <span className="group-hover:text-gray-900 font-normal">Объявления с фотографиями</span>
            </label>
          </div>

          <hr className="border-gray-100 my-3.5" />

          {/* 5. Submit Button */}
          <button
            id="btn-apply-filters"
            type="submit"
            className="w-full py-2.5 px-4 bg-[#1a73e8] hover:bg-[#1557b0] active:bg-[#10448e] text-white text-xs font-bold rounded-xl transition-all duration-150 shadow-xs cursor-pointer"
          >
            Применить
          </button>

          {/* 6. Reset values link in blue text */}
          <div className="text-center pt-1">
            <button
              id="btn-reset-sidebar-filters"
              type="button"
              onClick={handleResetClick}
              className="text-xs text-[#1a73e8] hover:text-[#1557b0] hover:underline transition-colors font-medium cursor-pointer"
            >
              Сбросить значения
            </button>
          </div>

        </form>
      </div>

      {/* Side Banners below filter (3 banners for filter page) */}
      <SideBanners count={3} />

    </aside>
  );
};

