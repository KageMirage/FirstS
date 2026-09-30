'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HomePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const HomePagination: React.FC<HomePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage, '...', totalPages);
    }
  }

  return (
    <div className="mt-8 sm:mt-10 flex items-center justify-center gap-1.5 sm:gap-2" id="home-pagination-controls">
      {/* Previous Page Button */}
      <button
        id="btn-home-page-prev"
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Предыдущая страница"
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border text-sm font-medium transition-all ${
          currentPage === 1
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
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            id={`btn-home-page-${pageNum}`}
            type="button"
            onClick={() => onPageChange(pageNum)}
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
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Следующая страница"
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border text-sm font-medium transition-all ${
          currentPage >= totalPages
            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
            : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 cursor-pointer'
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
