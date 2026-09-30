'use client';

import React, { useState } from 'react';
import { Plus, User as UserIcon } from 'lucide-react';
import { useUI } from '../hooks/useUI';
import { useAuth } from '../hooks/useAuth';
import { useCategories } from '../hooks/useCategories';
import { useSearchParams } from '../hooks/useSearchParams';
import { FooterModals, FooterModalType } from './footer/FooterModals';
import { FooterAppDownload } from './footer/FooterAppDownload';
import { FooterSocialIcons } from './footer/FooterSocialIcons';
import { FooterCategoryColumns } from './footer/FooterCategoryColumns';

export const Footer: React.FC = () => {
  const { openAuth, notify } = useUI();
  const { user, isAuthenticated } = useAuth();
  const { categories } = useCategories();
  const [, setSearchParams] = useSearchParams();

  const [activeModal, setActiveModal] = useState<FooterModalType>(null);

  const handleDownloadApk = (e: React.MouseEvent) => {
    e.preventDefault();
    notify('Начало загрузки APK-файла приложения Adverts PRO...', 'info');
  };

  const handleAppStoreClick = (storeName: string) => {
    notify(`Приложение ${storeName} будет доступно в ближайшем обновлении`, 'info');
  };

  const handlePostAd = () => {
    setSearchParams({ view: 'create-ad' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (categoryName: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('view', 'filter');
        next.set('category', categoryName);
        next.set('page', '1');
        return next;
      },
      { pathname: '/filter' }
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
    notify(`Фильтр по разделу: "${categoryName}"`, 'info');
  };

  const handleCabinetClick = () => {
    if (!isAuthenticated) {
      openAuth();
      notify('Для входа в личный кабинет авторизуйтесь', 'info');
    } else {
      setSearchParams({ view: 'profile' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#1f1f1f] text-[#f5f5f5] pt-10 pb-8 font-sans antialiased" id="main-footer">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Actions Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-8 border-b border-neutral-700/60">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isAuthenticated ? (
              <>
                <button
                  id="btn-footer-login"
                  type="button"
                  onClick={openAuth}
                  className="px-8 py-2.5 rounded-full border border-neutral-400/60 hover:border-white text-sm font-semibold text-white bg-transparent transition-all cursor-pointer"
                >
                  Войти
                </button>
                <button
                  id="btn-footer-google-login"
                  type="button"
                  onClick={openAuth}
                  className="flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full border border-black text-sm font-semibold text-white bg-black hover:bg-neutral-900 transition-all cursor-pointer"
                >
                  <span className="font-bold text-base leading-none">G</span>
                  <span>Google</span>
                </button>
              </>
            ) : (
              <button
                id="btn-footer-profile"
                type="button"
                onClick={handleCabinetClick}
                className="flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full border border-neutral-400/60 text-sm font-semibold text-white bg-transparent hover:bg-neutral-800 transition-all cursor-pointer"
              >
                <UserIcon className="w-4 h-4 text-white" />
                <span suppressHydrationWarning>{user?.full_name || 'Личный кабинет'}</span>
              </button>
            )}
          </div>

          {isAuthenticated && (
            <button
              id="btn-footer-post-ad"
              type="button"
              onClick={handlePostAd}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-2.5 rounded-full border border-black text-sm font-semibold text-white bg-black hover:bg-neutral-900 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Опубликовать объявление</span>
            </button>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8">
          <FooterAppDownload
            onDownloadApk={handleDownloadApk}
            onAppStoreClick={handleAppStoreClick}
          />

          <FooterCategoryColumns
            categories={categories}
            onCategoryClick={handleCategoryClick}
            onOpenModal={setActiveModal}
          />
        </div>

        {/* Bottom Copyright & Social Icons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-300 font-light">
          <div>
            <p>© 2024 LLC. Все права защищены. Создание сайта PROLab Agency.</p>
          </div>
          <FooterSocialIcons />
        </div>

      </div>

      <FooterModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </footer>
  );
};
