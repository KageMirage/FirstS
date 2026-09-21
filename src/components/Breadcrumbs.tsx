'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  items: { label: string; onClick?: () => void; active?: boolean }[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Хлебные крошки" className="py-3" id="breadcrumbs-nav">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="flex items-center gap-2">
                {item.onClick && !item.active ? (
                  <button
                    onClick={item.onClick}
                    className="hover:text-[#1a73e8] transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className={item.active || isLast ? 'text-gray-900 font-semibold' : ''}>
                    {item.label}
                  </span>
                )}
                {!isLast && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
