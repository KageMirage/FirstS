'use client';

import React from 'react';
import { 
  User as UserIcon, 
  Briefcase, 
  Heart, 
  LogOut, 
  ShieldCheck, 
  Camera 
} from 'lucide-react';
import { UserProfile } from '../../types/api';

interface CabinetSidebarProps {
  user: UserProfile | null;
  activeTab: 'ads' | 'favorites' | 'profile';
  myAdsCount: number;
  favAdsCount: number;
  onSelectTab: (tab: 'ads' | 'favorites' | 'profile') => void;
  onLogout: () => void;
  onTriggerAvatarUpload: () => void;
}

export const CabinetSidebar: React.FC<CabinetSidebarProps> = ({
  user,
  activeTab,
  myAdsCount,
  favAdsCount,
  onSelectTab,
  onLogout,
  onTriggerAvatarUpload,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100/90 p-5 sm:p-6 shadow-xs space-y-6">
      {/* User Info Header with Avatar Upload */}
      <div className="flex items-center gap-3.5 pb-2">
        <div className="relative group shrink-0">
          <div 
            onClick={onTriggerAvatarUpload}
            title="Нажмите, чтобы изменить фото профиля"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-[#eef2f6] border-2 border-white shadow-xs cursor-pointer flex items-center justify-center transition-all group-hover:ring-2 group-hover:ring-[#1976d2]"
          >
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.full_name || 'Пользователь'} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <UserIcon className="w-7 h-7 text-gray-400 stroke-[1.5]" />
            )}
          </div>
          
          <button
            type="button"
            onClick={onTriggerAvatarUpload}
            title="Изменить фото"
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1976d2] text-white flex items-center justify-center shadow-xs border-2 border-white hover:bg-blue-700 transition cursor-pointer"
          >
            <Camera className="w-3 h-3" />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
            {user?.full_name || 'user'}
          </h2>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {user?.phone_number || '+996 700 000 000'}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Верифицирован</span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="space-y-1 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => onSelectTab('ads')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
            activeTab === 'ads'
              ? 'bg-blue-50 text-[#1976D2]'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-4 h-4" />
            <span>Мои объявления</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
            {myAdsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('favorites')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
            activeTab === 'favorites'
              ? 'bg-blue-50 text-[#1976D2]'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Heart className="w-4 h-4" />
            <span>Мои избранные</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
            {favAdsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('profile')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-blue-50 text-[#1976D2]'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <UserIcon className="w-4 h-4" />
            <span>Профиль</span>
          </div>
        </button>
      </nav>

      {/* Logout Action */}
      <div className="pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Выйти из аккаунта</span>
        </button>
      </div>
    </div>
  );
};
