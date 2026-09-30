'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { apiService } from '../../api/endpoints';

const DEFAULT_REGIONS = [
  'Ош',
  'Бишкек',
  'Джалал-Абад',
  'Нарын',
  'Талас',
  'Баткен',
  'Иссык-Куль',
  'Чуй',
];

interface CategoryAndRegionSelectsProps {
  category: string;
  region: string;
  categoryOptions: string[];
  onChange: (field: 'category' | 'region', value: string) => void;
}

export const CategoryAndRegionSelects: React.FC<CategoryAndRegionSelectsProps> = ({
  category,
  region,
  categoryOptions,
  onChange,
}) => {
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [regionsList, setRegionsList] = useState<string[]>(DEFAULT_REGIONS);

  useEffect(() => {
    let isSubscribed = true;
    apiService
      .getRegions()
      .then((data) => {
        if (isSubscribed && Array.isArray(data) && data.length > 0) {
          const names = data.map((r) => r.name);
          setRegionsList(Array.from(new Set([...names, ...DEFAULT_REGIONS])));
        }
      })
      .catch(() => {});
    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <>
      {/* Категории */}
      <div className="relative">
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Категории<span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={() => {
            setIsCatOpen(!isCatOpen);
            setIsRegionOpen(false);
          }}
          className="w-full bg-[#f8f9fb] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none border border-transparent focus:border-[#1976D2] focus:bg-white transition flex items-center justify-between cursor-pointer"
        >
          <span className="font-normal truncate">{category || 'Выберите категорию'}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCatOpen ? 'rotate-180' : ''}`} />
        </button>

        {isCatOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 max-h-56 overflow-y-auto">
            {categoryOptions.map((cat) => {
              const isSelected = cat === category;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    onChange('category', cat);
                    setIsCatOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'text-[#1976D2] bg-blue-50 font-bold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#1976D2]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Регион */}
      <div className="relative">
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Регион<span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={() => {
            setIsRegionOpen(!isRegionOpen);
            setIsCatOpen(false);
          }}
          className="w-full bg-[#f8f9fb] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none border border-transparent focus:border-[#1976D2] focus:bg-white transition flex items-center justify-between cursor-pointer"
        >
          <span className="font-normal">{region}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isRegionOpen ? 'rotate-180' : ''}`} />
        </button>

        {isRegionOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 max-h-56 overflow-y-auto">
            {regionsList.map((reg) => {
              const isSelected = reg === region;
              return (
                <button
                  key={reg}
                  type="button"
                  onClick={() => {
                    onChange('region', reg);
                    setIsRegionOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'text-[#1976D2] bg-blue-50 font-bold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>{reg}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#1976D2]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
