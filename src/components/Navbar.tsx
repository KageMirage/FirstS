'use client';

import React from 'react';
import { Plus, Grid, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { useAds } from '../hooks/useAds';
import { useSearchParams } from '../hooks/useSearchParams';
import { NavUserDropdown } from './navbar/NavUserDropdown';
import { NavSearchBox, NavMobileSearch } from './navbar/NavSearchBox';
import { isSamePhoneNumber } from '../utils/authStorage';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { openAuth, toggleCategoryMenu, openCategoryMenu, isCategoryMenuOpen } = useUI();
  const { search, favoriteIds, items } = useAds();
  const [searchParams, setSearchParams, pathname] = useSearchParams();

  const searchQuery = searchParams.get('q') || '';

  // User ads count
  const myAdsCount = items.filter((ad) => {
    if (!user) return false;
    if (ad.user?.id && user.id && String(ad.user.id) === String(user.id)) return true;
    if (ad.user?.full_name && user.full_name && ad.user.full_name.trim().toLowerCase() === user.full_name.trim().toLowerCase()) return true;
    if (user.phone_number) {
      if (ad.user?.phone_number && isSamePhoneNumber(ad.user.phone_number, user.phone_number)) return true;
      if (ad.phone_number && isSamePhoneNumber(ad.phone_number, user.phone_number)) return true;
    }
    return false;
  }).length;

  const handleSearch = (query: string) => {
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

  const handleClearSearch = () => {
    search('');
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('q');
      next.set('page', '1');
      return next;
    });
  };

  const navigateToCabinet = (tab: 'ads' | 'favorites' | 'profile') => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('id');
      next.delete('ad_id');
      next.delete('q');
      next.set('view', 'cabinet');
      next.set('tab', tab);
      return next;
    }, { pathname: '/cabinet' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateAd = () => {
    if (!isAuthenticated) {
      openAuth();
      return;
    }
    setSearchParams({ view: 'create-ad' }, { pathname: '/create' });
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
        <NavSearchBox
          initialQuery={searchQuery}
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />

        {/* Right: Post Ad Button & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            id="btn-post-ad-header"
            onClick={handleCreateAd}
            className="flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-[#1976D2] hover:bg-[#1565C0] active:bg-[#0D47A1] text-white rounded-full text-xs sm:text-sm font-medium shadow-xs hover:shadow transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden xs:inline sm:inline">Опубликовать объявление</span>
            <span className="xs:hidden sm:hidden">Подать</span>
          </button>

          <NavUserDropdown
            user={user}
            isAuthenticated={isAuthenticated}
            myAdsCount={myAdsCount}
            favoritesCount={favoriteIds.length}
            onNavigate={navigateToCabinet}
            onCreateAd={handleCreateAd}
            onLogout={logout}
            onOpenAuth={openAuth}
          />
        </div>

      </div>

      {/* Mobile Search Bar (Only shown on search/filter view matching Screenshot 5) */}
      {(pathname === '/filter' || searchParams.get('view') === 'filter') && (
        <NavMobileSearch
          initialQuery={searchQuery}
          onSearch={handleSearch}
          onOpenCategories={openCategoryMenu}
        />
      )}
    </header>
  );
};

