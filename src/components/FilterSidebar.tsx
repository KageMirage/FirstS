'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { SideBanners } from './SideBanners';
import { apiService } from '../api/endpoints';
import { Region } from '../types/api';

export interface FilterValues {
  query: string;
  category: string;
  region?: string;
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
  const [regions, setRegions] = useState<Region[]>([]);
  const [query, setQuery] = useState(initialValues.query || '');
  const [category, setCategory] = useState(initialValues.category || '');
  const [region, setRegion] = useState(initialValues.region || '');
  const [minPrice, setMinPrice] = useState(initialValues.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(initialValues.maxPrice || '');
  const [hasPhotoOnly, setHasPhotoOnly] = useState(initialValues.hasPhotoOnly || false);

  useEffect(() => {
    let isSubscribed = true;
    apiService
      .getRegions()
      .then((data) => {
        if (isSubscribed && Array.isArray(data)) {
          setRegions(data);
        }
      })
      .catch((err) => {
        console.warn('Could not load regions:', err.message);
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    setQuery(initialValues.query || '');
    setCategory(initialValues.category || '');
    setRegion(initialValues.region || '');
    setMinPrice(initialValues.minPrice || '');
    setMaxPrice(initialValues.maxPrice || '');
    setHasPhotoOnly(initialValues.hasPhotoOnly || false);
  }, [
    initialValues.query,
    initialValues.category,
    initialValues.region,
    initialValues.minPrice,
    initialValues.maxPrice,
    initialValues.hasPhotoOnly,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({ query, category, region, minPrice, maxPrice, hasPhotoOnly });
  };

  const handleResetClick = () => {
    setQuery('');
    setCategory('');
    setRegion('');
    setMinPrice('');
    setMaxPrice('');
    setHasPhotoOnly(false);
    onReset();
  };

  const baseCategoryOptions = [
    { label: 'Во всех категориях', value: '' },
    ...categories.map((c) => ({ label: c.name, value: c.name })),
    ...childCategories.map((c) => ({ label: `— ${c.name}`, value: c.name })),
  ];

  const hasSelected = baseCategoryOptions.some((opt) => opt.value === category);
  const allCategoryOptions = !category || hasSelected
    ? baseCategoryOptions
    : [...baseCategoryOptions, { label: category, value: category }];

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6" id="filter-sidebar">
      <div className="bg-white rounded-2xl border border-gray-100/80 p-5 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="filter-query-input" className="block text-xs font-medium text-gray-500 mb-1.5">
              Поиск по тексту
            </label>
            <input
              id="filter-query-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Что вы ищете?"
              className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-gray-200/70 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#1976D2] transition-all"
            />
          </div>

          <div>
            <label htmlFor="filter-category-select" className="block text-xs font-medium text-gray-500 mb-1.5">
              Категория
            </label>
            <div className="relative">
              <select
                id="filter-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 bg-[#f8f9fa] border border-gray-200/70 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#1976D2] transition-all pr-8 cursor-pointer"
              >
                {allCategoryOptions.map((opt, i) => (
                  <option key={i} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Region Filter */}
          <div>
            <label htmlFor="filter-region-select" className="block text-xs font-medium text-gray-500 mb-1.5">
              Регион / Город
            </label>
            <div className="relative">
              <select
                id="filter-region-select"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 bg-[#f8f9fa] border border-gray-200/70 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#1976D2] transition-all pr-8 cursor-pointer"
              >
                <option value="">Все регионы</option>
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.name}>
                    {reg.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <span className="block text-xs font-medium text-gray-500 mb-1.5">Цена, сом</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                id="filter-min-price-input"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="от"
                min="0"
                className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-gray-200/70 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#1976D2] transition-all"
              />
              <input
                id="filter-max-price-input"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="до"
                min="0"
                className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-gray-200/70 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#1976D2] transition-all"
              />
            </div>
          </div>

          <div>
            <span className="block text-xs font-medium text-gray-500 mb-2">Показать только</span>
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-gray-700 group">
              <div className="relative flex items-center justify-center">
                <input
                  id="filter-has-photo-checkbox"
                  type="checkbox"
                  checked={hasPhotoOnly}
                  onChange={(e) => setHasPhotoOnly(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded-md border border-gray-300 peer-checked:bg-[#1976D2] peer-checked:border-[#1976D2] transition-all flex items-center justify-center group-hover:border-[#1976D2]">
                  <Check className="w-3 h-3 text-white stroke-[2.5] opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
              </div>
              <span className="group-hover:text-gray-900 font-normal">Объявления с фотографиями</span>
            </label>
          </div>

          <hr className="border-gray-100 my-3.5" />

          <button
            id="btn-apply-filters"
            type="submit"
            className="w-full py-2.5 px-4 bg-[#1976D2] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
          >
            Применить
          </button>

          <div className="text-center pt-1">
            <button
              id="btn-reset-sidebar-filters"
              type="button"
              onClick={handleResetClick}
              className="text-xs text-[#1976D2] hover:underline font-medium cursor-pointer"
            >
              Сбросить значения
            </button>
          </div>
        </form>
      </div>

      <SideBanners count={3} />
    </aside>
  );
};
