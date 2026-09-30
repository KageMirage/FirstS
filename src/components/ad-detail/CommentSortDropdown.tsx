'use client';

import React, { useRef, useEffect } from 'react';
import { ChevronDown, Check, ListFilter } from 'lucide-react';

export type CommentSortOrder = 'popular' | 'newest' | 'oldest';

interface CommentSortDropdownProps {
  sortOrder: CommentSortOrder;
  onSortChange: (order: CommentSortOrder) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const SORT_LABELS: Record<CommentSortOrder, string> = {
  popular: 'Сначала популярные',
  newest: 'Сначала новые',
  oldest: 'Сначала старые',
};

export const CommentSortDropdown: React.FC<CommentSortDropdownProps> = ({
  sortOrder,
  onSortChange,
  isOpen,
  onToggle,
  onClose,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-xs font-semibold text-gray-700 transition cursor-pointer"
        id="btn-comments-sort"
      >
        <ListFilter className="w-4 h-4 text-gray-500" />
        <span>{SORT_LABELS[sortOrder]}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-1.5 z-20">
          {(['popular', 'newest', 'oldest'] as const).map((order) => (
            <button
              key={order}
              type="button"
              onClick={() => {
                onSortChange(order);
                onClose();
              }}
              className="w-full px-3.5 py-2.5 text-left text-xs font-medium flex items-center justify-between hover:bg-gray-50 transition cursor-pointer text-gray-800"
            >
              <span className={sortOrder === order ? 'font-bold text-[#1976D2]' : ''}>
                {SORT_LABELS[order]}
              </span>
              {sortOrder === order && <Check className="w-4 h-4 text-[#1976D2]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
