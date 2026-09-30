'use client';

import React from 'react';
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
  ChevronRight
} from 'lucide-react';
import { Category } from '../../types/api';

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

interface CategoryMenuListProps {
  categories: Category[];
  activeCategoryId: number | null;
  onSelectCategory: (id: number) => void;
}

export const CategoryMenuList: React.FC<CategoryMenuListProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="w-full md:w-64 lg:w-72 shrink-0 space-y-1">
      {categories.map((cat) => {
        const IconComp = getCategoryLucideIcon(cat.name);
        const isActive = activeCategoryId === cat.id;

        return (
          <button
            key={cat.id}
            id={`cat-menu-item-${cat.id}`}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            onMouseEnter={() => onSelectCategory(cat.id)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer text-left ${
              isActive 
                ? 'text-[#1976D2] font-semibold bg-blue-50/50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/70 font-normal'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {cat.icon ? (
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <img 
                    src={cat.icon} 
                    alt="" 
                    loading="lazy"
                    decoding="async"
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
  );
};
