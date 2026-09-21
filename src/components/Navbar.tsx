'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Grid, 
  ChevronDown, 
  User as UserIcon, 
  LogOut, 
  Heart, 
  Briefcase,
  ShieldCheck, 
  X,
  SlidersHorizontal,
  Clock
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { useAds } from '../hooks/useAds';
import { useSearchParams } from '../hooks/useSearchParams';

const DEFAULT_SEARCH_HISTORY = [
  'Сдаю комнату / жилье',
  'Работа',
  'Такси Москва',
  'Квартира посуточно'
];

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { openAuth, toggleCategoryMenu, openCategoryMenu, isCategoryMenuOpen } = useUI();
  const { search, favoriteIds, items } = useAds();
  const [searchParams, setSearchParams, pathname] = useSearchParams();
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(DEFAULT_SEARCH_HISTORY);

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

  const searchBoxRef = useRef<HTMLDivElement>(null);

  // User ads count
  const myAdsCount = items.filter((ad) => {
    if (user && ad.user?.id === user.id) return true;
    if (ad.user?.full_name?.toLowerCase().includes('asana')) return true;
    return false;
  }).length;

  useEffect(() => {
    setSearchInput(searchParams.get('q') || '');
  }, [searchParams]);

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
    const nextHistory = [query.trim(), ...searchHistory.filter((item) => item.toLowerCase() !== query.trim().toLowerCase())].slice(0, 6);
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
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('view', 'filter');
        if (query.trim()) {
          next.set('q', query.trim());
        } else {
          next.delete('q');
        }
        next.set('page', '1');
        return next;
      },
      { pathname: '/filter' }
    );
    search(query);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchInput);
  };

  const navigateToCabinet = (tab: 'ads' | 'favorites' | 'profile') => {
    setIsUserMenuOpen(false);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('view', 'profile');
      next.set('tab', tab);
      return next;
    }, { pathname: '/cabinet' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)]" id="header-navbar">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Brand Logo & Desktop Categories Button */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button 
            onClick={(e) => {
              e.preventDefault();
              setSearchParams({}, { pathname: '/' });
            }}
            className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
            id="brand-logo"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1976D2] flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105 shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="3.5" />
                <path d="M12 3v5.5M12 15.5V21M3 12h5.5M15.5 12H21" />
              </svg>
            </div>
            <span className="text-lg sm:text-2xl font-black tracking-tight text-[#1976D2] font-sans">
              Adverts <span className="text-[#1976D2]">PRO</span>
            </span>
          </button>

          {/* Desktop "Все категории" Button */}
          <button
            id="btn-all-categories"
            onClick={toggleCategoryMenu}
            className={`hidden md:flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              isCategoryMenuOpen 
                ? 'bg-[#1565C0] text-white shadow-inner' 
                : 'bg-[#1976D2] hover:bg-[#1565C0] text-white shadow-sm hover:shadow'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Все категории</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Center: Desktop Search Bar */}
        <div className="flex-1 max-w-2xl mx-2 hidden sm:block relative" ref={searchBoxRef}>
          <form 
            onSubmit={handleSearchSubmit} 
            id="global-search-form"
          >
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
                    search('');
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.delete('q');
                      next.set('page', '1');
                      return next;
                    });
                  }}
                  className="absolute right-3 text-xs text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              ) : null}
            </div>
          </form>

          {/* Search History Dropdown (matching Screenshot 5) */}
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
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Post Ad Button & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Post Ad Button (Desktop) */}
          <button
            id="btn-post-ad-header"
            onClick={() => {
              setSearchParams({ view: 'create-ad' }, { pathname: '/create' });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#1976D2] hover:bg-[#1565C0] active:bg-[#0D47A1] text-white rounded-full text-sm font-medium shadow-xs hover:shadow transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Опубликовать объявление</span>
          </button>

          {/* User Profile / Login Avatar */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                id="btn-user-avatar"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 via-rose-500 to-amber-500 hover:opacity-95 transition-all flex items-center justify-center cursor-pointer"
              >
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-gray-100 flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.full_name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f0f2f5] text-gray-500 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-gray-400 stroke-[1.8]" />
                    </div>
                  )}
                </div>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div 
                  id="user-dropdown-menu"
                  className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div 
                    onClick={() => navigateToCabinet('profile')}
                    className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50/80 transition-colors cursor-pointer"
                  >
                    <p className="text-sm font-bold text-gray-900 truncate" suppressHydrationWarning>
                      {user.full_name || 'Asanova Asana'}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5" suppressHydrationWarning>
                      {user.phone_number || '+996 700 600 600'}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Подтвержден</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      id="dropdown-link-profile"
                      onClick={() => navigateToCabinet('profile')}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-[#1976D2]" />
                      <span>Профиль</span>
                    </button>

                    <button
                      id="dropdown-link-create-ad"
                      onClick={() => { 
                        setIsUserMenuOpen(false); 
                        setSearchParams({ view: 'create-ad' }, { pathname: '/create' });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#1976D2]" />
                      <span>Новое объявление</span>
                    </button>

                    <button
                      id="dropdown-link-my-ads"
                      onClick={() => navigateToCabinet('ads')}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-4 h-4 text-[#1976D2]" />
                        <span>Мои объявления</span>
                      </div>
                      {myAdsCount > 0 && (
                        <span className="bg-blue-50 text-[#1976D2] text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {myAdsCount}
                        </span>
                      )}
                    </button>

                    <button
                      id="dropdown-link-favorites"
                      onClick={() => navigateToCabinet('favorites')}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>Избранное</span>
                      </div>
                      {favoriteIds.length > 0 && (
                        <span className="bg-rose-50 text-rose-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {favoriteIds.length}
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="border-t border-gray-100 pt-1">
                    <button
                      id="dropdown-btn-logout"
                      onClick={() => { setIsUserMenuOpen(false); logout(); }}
                      className="w-full px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Выйти из аккаунта</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Login Button */}
              <button
                id="btn-header-login"
                onClick={openAuth}
                className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#1976D2] bg-gray-100 hover:bg-gray-200/80 rounded-xl transition-all cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>Войти</span>
              </button>

              {/* Mobile Profile Avatar */}
              <button
                id="btn-header-login-mobile"
                onClick={openAuth}
                className="sm:hidden w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shadow-xs cursor-pointer ring-1 ring-gray-100 flex items-center justify-center text-gray-500"
                aria-label="Профиль"
              >
                <UserIcon className="w-4 h-4 text-gray-500" />
              </button>
            </>
          )}

        </div>

      </div>

      {/* Mobile Search Bar (Only shown on search/filter view matching Screenshot 5) */}
      {(pathname === '/filter' || searchParams.get('view') === 'filter') && (
        <div className="px-4 pb-3 sm:hidden relative">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Найти сервис по названию..."
              className="w-full pl-10 pr-10 py-2.5 bg-[#f8f9fa] text-gray-800 placeholder-gray-400 text-xs rounded-2xl border border-transparent focus:border-[#1976D2] focus:bg-white transition-all outline-none"
            />
            <button
              type="button"
              onClick={openCategoryMenu}
              className="absolute right-2.5 p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
              aria-label="Фильтры"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </form>

          {/* Mobile Search History Dropdown (matching Screenshot 5) */}
          {isSearchFocused && searchHistory.length > 0 && (
            <div className="absolute top-full left-4 right-4 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              {searchHistory.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSearchInput(item);
                    executeSearch(item);
                  }}
                  className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between text-xs text-gray-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => removeHistoryItem(e, item)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
