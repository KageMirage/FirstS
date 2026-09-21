'use client';

import React from 'react';
import { Home, Search, Plus, Heart, User as UserIcon } from 'lucide-react';
import { useSearchParams } from '../hooks/useSearchParams';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { useAds } from '../hooks/useAds';

export const MobileBottomNav: React.FC = () => {
  const [searchParams, setSearchParams, pathname] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { openAuth, openCategoryMenu } = useUI();
  const { favoriteIds } = useAds();

  const isHome = 
    (pathname === '/' || pathname === '') && 
    !searchParams.get('view') && 
    !searchParams.get('category');

  const isFilter = 
    pathname === '/filter' || 
    searchParams.get('view') === 'filter' || 
    Boolean(searchParams.get('category') || searchParams.get('q'));

  const isCreate = 
    pathname === '/create' || 
    pathname === '/create-ad' || 
    searchParams.get('view') === 'create-ad' || 
    searchParams.get('view') === 'create';

  const isCabinet = 
    pathname === '/profile' || 
    pathname === '/cabinet' || 
    pathname === '/favorites' || 
    searchParams.get('view') === 'profile' || 
    searchParams.get('view') === 'cabinet' || 
    searchParams.get('view') === 'favorites';

  const isFavActive = searchParams.get('tab') === 'favorites' || searchParams.get('view') === 'favorites';

  const handleGoHome = () => {
    setSearchParams({}, { pathname: '/' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoSearch = () => {
    openCategoryMenu();
  };

  const handleCreateAd = () => {
    setSearchParams({ view: 'create-ad' }, { pathname: '/create' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoFavorites = () => {
    if (!isAuthenticated) {
      openAuth();
    } else {
      setSearchParams({ view: 'profile', tab: 'favorites' }, { pathname: '/cabinet' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoProfile = () => {
    if (!isAuthenticated) {
      openAuth();
    } else {
      setSearchParams({ view: 'profile', tab: 'profile' }, { pathname: '/cabinet' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-2 left-4 right-4 z-40 sm:hidden max-w-sm mx-auto pointer-events-none" id="mobile-bottom-nav">
      <nav className="bg-white/95 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100/90 px-6 py-2 flex items-center justify-between relative pointer-events-auto">
        
        {/* 1. Home Button */}
        <button
          type="button"
          id="btn-mobile-nav-home"
          onClick={handleGoHome}
          className={`p-2 transition-colors cursor-pointer flex flex-col items-center justify-center ${
            isHome && !isFavActive ? 'text-[#1976D2]' : 'text-gray-400 hover:text-gray-700'
          }`}
          aria-label="Главная"
        >
          <Home className="w-5 h-5 fill-current" />
        </button>

        {/* 2. Search / Categories Button */}
        <button
          type="button"
          id="btn-mobile-nav-search"
          onClick={handleGoSearch}
          className={`p-2 transition-colors cursor-pointer flex flex-col items-center justify-center ${
            isFilter ? 'text-[#1976D2]' : 'text-gray-400 hover:text-gray-700'
          }`}
          aria-label="Поиск и категории"
        >
          <Search className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* 3. Center Create Ad Floating Button */}
        <button
          type="button"
          id="btn-mobile-nav-create"
          onClick={handleCreateAd}
          className="w-11 h-11 rounded-full bg-[#1976D2] hover:bg-[#1565C0] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 -mt-6 active:scale-95 transition-all cursor-pointer ring-4 ring-white"
          aria-label="Подать объявление"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* 4. Favorites Button */}
        <button
          type="button"
          id="btn-mobile-nav-favorites"
          onClick={handleGoFavorites}
          className={`p-2 transition-colors cursor-pointer relative flex flex-col items-center justify-center ${
            isFavActive ? 'text-[#1976D2]' : 'text-gray-400 hover:text-gray-700'
          }`}
          aria-label="Избранное"
        >
          <Heart className={`w-5 h-5 ${isFavActive ? 'fill-[#1976D2] text-[#1976D2]' : 'stroke-[2]'}`} />
          {favoriteIds.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        {/* 5. Profile / Auth Button */}
        <button
          type="button"
          id="btn-mobile-nav-profile"
          onClick={handleGoProfile}
          className={`p-2 transition-colors cursor-pointer flex flex-col items-center justify-center ${
            isCabinet && !isFavActive ? 'text-[#1976D2]' : 'text-gray-400 hover:text-gray-700'
          }`}
          aria-label="Профиль"
        >
          <UserIcon className={`w-5 h-5 ${isAuthenticated && isCabinet ? 'fill-current' : 'stroke-[2]'}`} />
        </button>

      </nav>

      {/* iOS Home Indicator */}
      <div className="w-32 h-1 bg-gray-900/40 rounded-full mx-auto mt-2"></div>
    </div>
  );
};
