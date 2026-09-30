'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  User as UserIcon, 
  LogOut, 
  Heart, 
  Briefcase,
  ShieldCheck, 
  Plus
} from 'lucide-react';
import { UserProfile } from '../../types/api';

interface NavUserDropdownProps {
  user: UserProfile | null;
  isAuthenticated: boolean;
  myAdsCount: number;
  favoritesCount: number;
  onNavigate: (tab: 'ads' | 'favorites' | 'profile') => void;
  onCreateAd: () => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const NavUserDropdown: React.FC<NavUserDropdownProps> = ({
  user,
  isAuthenticated,
  myAdsCount,
  favoritesCount,
  onNavigate,
  onCreateAd,
  onLogout,
  onOpenAuth,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!isAuthenticated || !user) {
    return (
      <>
        {/* Desktop Login Button */}
        <button
          id="btn-header-login"
          onClick={onOpenAuth}
          className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#1976D2] bg-gray-100 hover:bg-gray-200/80 rounded-xl transition-all cursor-pointer"
        >
          <UserIcon className="w-4 h-4" />
          <span>Войти</span>
        </button>

        {/* Mobile Profile Avatar */}
        <button
          id="btn-header-login-mobile"
          onClick={onOpenAuth}
          className="sm:hidden w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shadow-xs cursor-pointer ring-1 ring-gray-100 flex items-center justify-center text-gray-500"
          aria-label="Профиль"
        >
          <UserIcon className="w-4 h-4 text-gray-500" />
        </button>
      </>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="btn-user-avatar"
        onClick={() => setIsOpen(!isOpen)}
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

      {isOpen && (
        <div 
          id="user-dropdown-menu"
          className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div 
            onClick={() => { setIsOpen(false); onNavigate('profile'); }}
            className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50/80 transition-colors cursor-pointer"
          >
            <p className="text-sm font-bold text-gray-900 truncate" suppressHydrationWarning>
              {user.full_name || 'user'}
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
              onClick={() => { setIsOpen(false); onNavigate('profile'); }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer"
            >
              <UserIcon className="w-4 h-4 text-[#1976D2]" />
              <span>Профиль</span>
            </button>

            <button
              id="dropdown-link-create-ad"
              onClick={() => { setIsOpen(false); onCreateAd(); }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#1976D2]" />
              <span>Новое объявление</span>
            </button>

            <button
              id="dropdown-link-my-ads"
              onClick={() => { setIsOpen(false); onNavigate('ads'); }}
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
              onClick={() => { setIsOpen(false); onNavigate('favorites'); }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Избранное</span>
              </div>
              {favoritesCount > 0 && (
                <span className="bg-rose-50 text-rose-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>

          <div className="border-t border-gray-100 pt-1">
            <button
              id="dropdown-btn-logout"
              onClick={() => { setIsOpen(false); onLogout(); }}
              className="w-full px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Выйти из аккаунта</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
