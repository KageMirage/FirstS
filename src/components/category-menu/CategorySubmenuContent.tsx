'use client';

import React from 'react';
import { Category, ChildCategory } from '../../types/api';

interface CategorySubmenuContentProps {
  currentCategory?: Category;
  subcategories: ChildCategory[];
  onSelectCategory: (cat: Category) => void;
  onSelectSubcategory: (cat: Category, subcat: ChildCategory) => void;
}

export const CategorySubmenuContent: React.FC<CategorySubmenuContentProps> = ({
  currentCategory,
  subcategories,
  onSelectCategory,
  onSelectSubcategory,
}) => {
  if (!currentCategory) return null;

  const midPoint = Math.ceil(subcategories.length / 2);
  const col1 = subcategories.slice(0, midPoint);
  const col2 = subcategories.slice(midPoint);

  return (
    <div className="flex-1 w-full pt-1">
      <button
        type="button"
        onClick={() => onSelectCategory(currentCategory)}
        className="text-xl sm:text-2xl font-bold text-[#1976D2] hover:underline mb-6 text-left cursor-pointer transition-colors block"
      >
        {currentCategory.name}
      </button>

      {subcategories.length === 0 ? (
        <div className="py-8 text-gray-400 text-sm">
          В данной категории пока нет отдельных подкатегорий. Кликните на название категории, чтобы просмотреть все объявления.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-3.5">
          <div className="space-y-3.5">
            {col1.map((subcat) => (
              <button
                key={`col1-${subcat.id}-${subcat.name}`}
                type="button"
                onClick={() => onSelectSubcategory(currentCategory, subcat)}
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

          <div className="space-y-3.5">
            {col2.map((subcat) => (
              <button
                key={`col2-${subcat.id}-${subcat.name}`}
                type="button"
                onClick={() => onSelectSubcategory(currentCategory, subcat)}
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
    </div>
  );
};
