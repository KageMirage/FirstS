'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { useAds } from '../hooks/useAds';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { useSearchParams } from '../hooks/useSearchParams';
import { CabinetSidebar } from './cabinet/CabinetSidebar';
import { CabinetMyAdsTab } from './cabinet/CabinetMyAdsTab';
import { CabinetFavoritesTab } from './cabinet/CabinetFavoritesTab';
import { CabinetProfileTab } from './cabinet/CabinetProfileTab';
import { DeleteAccountModal } from './cabinet/DeleteAccountModal';
import { updateAccountAvatar, deleteUserAccount, DEFAULT_USER_AVATAR, isSamePhoneNumber } from '../utils/authStorage';
import { apiService } from '../api/endpoints';
import { AdItem } from '../types/api';

export const CabinetPage: React.FC = () => {
  const { items, favoriteIds, removeAd } = useAds();
  const { user, logout, updateProfile } = useAuth();
  const { notify, openAuth } = useUI();
  const [searchParams, setSearchParams] = useSearchParams();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serverMyAds, setServerMyAds] = useState<AdItem[] | null>(null);

  // Read active tab from URL: 'ads' | 'favorites' | 'profile'
  const currentTab = (searchParams.get('tab') as 'ads' | 'favorites' | 'profile') || 'ads';
  const [activeTab, setActiveTab] = useState<'ads' | 'favorites' | 'profile'>(currentTab);

  // Synchronize activeTab whenever URL searchParams change (e.g. from header user dropdown)
  useEffect(() => {
    const tabParam = searchParams.get('tab') as 'ads' | 'favorites' | 'profile';
    const viewParam = searchParams.get('view');
    if (tabParam && ['ads', 'favorites', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (viewParam === 'favorites') {
      setActiveTab('favorites');
    } else if (viewParam === 'my-ads') {
      setActiveTab('ads');
    } else if (viewParam === 'profile' || viewParam === 'cabinet') {
      if (tabParam) {
        setActiveTab(tabParam);
      }
    }
  }, [searchParams]);

  // Fetch real user ads from backend
  useEffect(() => {
    if (!user) return;
    let isSubscribed = true;
    apiService
      .getMyAds()
      .then((data) => {
        if (isSubscribed && Array.isArray(data)) {
          setServerMyAds(data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch server my-ads:', err.message);
      });

    return () => {
      isSubscribed = false;
    };
  }, [user]);

  // User's own ads (filtered strictly to this user's ads without hardcoded dummies)
  const myAds = React.useMemo(() => {
    if (!user) return [];

    const isMatch = (ad: AdItem) => {
      // 1. By user ID
      if (ad.user?.id && user.id && String(ad.user.id) === String(user.id)) return true;
      // 2. By full name (e.g. 'user1')
      if (
        ad.user?.full_name &&
        user.full_name &&
        ad.user.full_name.trim().toLowerCase() === user.full_name.trim().toLowerCase()
      ) {
        return true;
      }
      // 3. By phone numbers
      if (user.phone_number) {
        if (ad.user?.phone_number && isSamePhoneNumber(ad.user.phone_number, user.phone_number)) return true;
        if (ad.phone_number && isSamePhoneNumber(ad.phone_number, user.phone_number)) return true;
        if (ad.whatsapp_number && isSamePhoneNumber(ad.whatsapp_number, user.phone_number)) return true;
      }
      return false;
    };

    const map = new Map<number, AdItem>();
    // Local created ads have highest priority and accuracy
    items.filter(isMatch).forEach((ad) => map.set(ad.id, ad));
    if (serverMyAds && Array.isArray(serverMyAds)) {
      serverMyAds.filter(isMatch).forEach((ad) => {
        if (!map.has(ad.id)) map.set(ad.id, ad);
      });
    }

    return Array.from(map.values());
  }, [items, serverMyAds, user]);

  // Favorited ads
  const favoriteAds = items.filter((ad) => favoriteIds.includes(ad.id));

  // Tab switcher
  const handleSelectTab = (tab: 'ads' | 'favorites' | 'profile') => {
    setActiveTab(tab);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('view', 'cabinet');
        next.set('tab', tab);
        return next;
      },
      { pathname: '/cabinet' }
    );
  };

  const handleTriggerAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify('Пожалуйста, выберите изображение (JPG, PNG, WebP)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      notify('Размер изображения не должен превышать 10 МБ', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const newAvatarUrl = event.target?.result as string;
      if (user) {
        updateProfile({ ...user, avatar: newAvatarUrl });
        updateAccountAvatar(user.email || user.phone_number || '', newAvatarUrl);
      }
      notify('Фото профиля успешно обновлено', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    logout();
    notify('Вы вышли из учетной записи', 'info');
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('view');
        next.delete('tab');
        return next;
      },
      { pathname: '/' }
    );
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteAccount = () => {
    if (user) {
      deleteUserAccount(user.id, user.email, user.phone_number);
    }
    logout();
    setIsDeleteModalOpen(false);
    notify('Аккаунт успешно удален', 'info');
    setSearchParams({}, { pathname: '/' });
  };

  const navigateToCreateAd = () => {
    setSearchParams({ view: 'create' }, { pathname: '/create' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCatalog = () => {
    setSearchParams({ view: 'filter' }, { pathname: '/filter' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPublicProfile = () => {
    setSearchParams({
      view: 'seller',
      seller_name: user?.full_name || 'user',
      seller_phone: user?.phone_number || '+996 700 000 000',
      seller_avatar: user?.avatar || DEFAULT_USER_AVATAR,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user) {
    return (
      <div className="bg-[#fcfdfe] min-h-[70vh] flex items-center justify-center py-12 px-4" id="cabinet-unauthorized">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center">
          <div className="w-16 h-16 bg-blue-50 text-[#1976D2] rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Личный кабинет</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Войдите в аккаунт, чтобы просматривать свои объявления, избранное и редактировать профиль.
          </p>
          <div className="space-y-3">
            <button
              id="btn-cabinet-login"
              onClick={openAuth}
              className="w-full py-3.5 bg-[#1976D2] hover:bg-[#1565C0] text-white font-semibold text-base rounded-2xl shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Войти или зарегистрироваться
            </button>
            <button
              onClick={() => setSearchParams({}, { pathname: '/' })}
              className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium text-sm rounded-2xl border border-gray-100 transition-all cursor-pointer"
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfdfe] min-h-screen py-6 sm:py-10" id="cabinet-page-container">
      {/* Hidden file input for uploading profile avatar */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleAvatarChange} 
        accept="image/*" 
        className="hidden" 
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Хлебные крошки (Breadcrumbs) */}
        <nav aria-label="Хлебные крошки" className="mb-5 sm:mb-7 flex items-center flex-wrap gap-2 text-xs sm:text-sm text-gray-500 font-medium">
          <button
            type="button"
            id="breadcrumb-home"
            onClick={() => setSearchParams({}, { pathname: '/' })}
            className="hover:text-[#1976D2] transition-colors flex items-center gap-1.5 cursor-pointer py-1"
          >
            <Home className="w-4 h-4 text-gray-400" />
            <span>Главная</span>
          </button>
          
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          
          <button
            type="button"
            id="breadcrumb-cabinet"
            onClick={() => handleSelectTab('profile')}
            className={`transition-colors cursor-pointer py-1 ${
              activeTab === 'profile' ? 'text-gray-900 font-bold' : 'hover:text-[#1976D2] text-gray-500'
            }`}
          >
            Личный кабинет
          </button>

          {activeTab !== 'profile' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="text-[#1976D2] font-semibold py-1">
                {activeTab === 'ads' ? 'Мои объявления' : 'Мои избранные'}
              </span>
            </>
          )}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Sidebar Navigation */}
          <div className="lg:col-span-3">
            <CabinetSidebar
              user={user}
              activeTab={activeTab}
              myAdsCount={myAds.length}
              favAdsCount={favoriteAds.length}
              onSelectTab={handleSelectTab}
              onLogout={handleLogout}
              onTriggerAvatarUpload={handleTriggerAvatarUpload}
            />
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-9">
            {activeTab === 'ads' && (
              <CabinetMyAdsTab
                ads={myAds}
                onCreateAd={navigateToCreateAd}
                onRemoveAd={(id) => {
                  removeAd(id);
                  notify('Объявление удалено', 'info');
                }}
              />
            )}

            {activeTab === 'favorites' && (
              <CabinetFavoritesTab
                favoriteAds={favoriteAds}
                onExploreCatalog={navigateToCatalog}
              />
            )}

            {activeTab === 'profile' && (
              <CabinetProfileTab
                user={user}
                onUpdateProfile={updateProfile}
                onDeleteAccount={handleDeleteAccount}
                onTriggerAvatarUpload={handleTriggerAvatarUpload}
                onOpenPublicProfile={handleOpenPublicProfile}
                onNotify={notify}
              />
            )}
          </div>

        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        userName={user?.full_name || 'Пользователь'}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteAccount}
      />
    </div>
  );
};
