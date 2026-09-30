'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, SlidersHorizontal } from 'lucide-react';

const DEFAULT_SEARCH_HISTORY = [
  'Сдаю комнату / жилье',
  'Работа',
  'Такси Москва',
  'Квартира посуточно'
];

interface NavSearchBoxProps {
  initialQuery: string;
  onSearch: (query: string) => void;
  onClear: () => void;
}

export const NavSearchBox: React.FC<NavSearchBoxProps> = ({
  initialQuery,
  onSearch,
  onClear,
}) => {
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(DEFAULT_SEARCH_HISTORY);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('adverts_search_history');
      if (saved) {
        setSearchHistory(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    setSearchInput(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveHistoryItem = (query: string) => {
    if (!query.trim()) return;
    const nextHistory = [
      query.trim(),
      ...searchHistory.filter((item) => item.toLowerCase() !== query.trim().toLowerCase())
    ].slice(0, 6);
    setSearchHistory(nextHistory);
    try {
      localStorage.setItem('adverts_search_history', JSON.stringify(nextHistory));
    } catch {
      // ignore
    }
  };

  const removeHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const nextHistory = searchHistory.filter((h) => h !== item);
    setSearchHistory(nextHistory);
    try {
      localStorage.setItem('adverts_search_history', JSON.stringify(nextHistory));
    } catch {
      // ignore
    }
  };

  const executeSearch = (query: string) => {
    setIsSearchFocused(false);
    saveHistoryItem(query);
    onSearch(query);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchInput);
  };

  return (
    <div className="flex-1 max-w-2xl mx-2 hidden sm:block relative" ref={searchBoxRef}>
      <form onSubmit={handleSubmit} id="global-search-form">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            value={searchInput}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Найти сервис по названию..."
            className="w-full pl-12 pr-10 py-3 bg-[#f8f9fa] hover:bg-[#f1f3f5] focus:bg-white text-gray-800 placeholder-gray-400 text-sm rounded-2xl border border-transparent focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/15 transition-all outline-none"
          />
          {searchInput ? (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                onClear();
              }}
              className="absolute right-3 text-xs text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
          ) : null}
        </div>
      </form>

      {isSearchFocused && searchHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {searchHistory.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSearchInput(item);
                executeSearch(item);
              }}
              className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between text-sm text-gray-700 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{item}</span>
              </div>
              <button
                type="button"
                onClick={(e) => removeHistoryItem(e, item)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface NavMobileSearchProps {
  initialQuery: string;
  onSearch: (query: string) => void;
  onOpenCategories: () => void;
}

export const NavMobileSearch: React.FC<NavMobileSearchProps> = ({
  initialQuery,
  onSearch,
  onOpenCategories,
}) => {
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setSearchInput(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFocused(false);
    onSearch(searchInput);
  };

  return (
    <div className="px-4 pb-3 sm:hidden relative">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchInput}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Найти сервис по названию..."
          className="w-full pl-10 pr-10 py-2.5 bg-[#f8f9fa] text-gray-800 placeholder-gray-400 text-xs rounded-2xl border border-transparent focus:border-[#1976D2] focus:bg-white transition-all outline-none"
        />
        <button
          type="button"
          onClick={onOpenCategories}
          className="absolute right-2.5 p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
          aria-label="Фильтры"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
