'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  User as UserIcon,
  X,
} from 'lucide-react';
import { useUI } from '../hooks/useUI';
import { useAuth } from '../hooks/useAuth';
import { useCategories } from '../hooks/useCategories';
import { useSearchParams } from '../hooks/useSearchParams';

export const Footer: React.FC = () => {
  const { openAuth, notify } = useUI();
  const { user, isAuthenticated } = useAuth();
  const { categories } = useCategories();
  const [, setSearchParams] = useSearchParams();

  // Legal & Contact Modals
  const [activeModal, setActiveModal] = useState<'contacts' | 'privacy' | 'terms' | null>(null);

  // Split categories from API/DB into 2 columns
  const half = Math.ceil(categories.length / 2);
  const col1Categories = categories.slice(0, half);
  const col2Categories = categories.slice(half);

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
          
          {/* Left Buttons: Войти + Google / Профиль */}
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

                {/* Google Sign In Button */}
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

          {/* Right Button: + Опубликовать объявление */}
          <button
            id="btn-footer-post-ad"
            type="button"
            onClick={handlePostAd}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-2.5 rounded-full border border-black text-sm font-semibold text-white bg-black hover:bg-neutral-900 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Опубликовать объявление</span>
          </button>

        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8">
          
          {/* Left Column: Download App (5 cols) */}
          <div className="md:col-span-5 space-y-3 pr-0 md:pr-4">
            <h4 className="text-base font-normal text-white">
              Скачайте приложение
            </h4>
            <div className="text-xs text-neutral-300 leading-relaxed font-light space-y-0.5">
              <p>Не упустите возможность купить технику по самым выгодным ценам.</p>
              <p>Мы уже собрали более 200 компаний-партнеров!</p>
            </div>
            
            <div className="pt-1">
              <button
                type="button"
                onClick={handleDownloadApk}
                className="text-xs text-neutral-300 underline underline-offset-2 hover:text-white transition-colors cursor-pointer"
              >
                APK-файл для Android
              </button>
            </div>

            {/* App Badges */}
            <div className="flex items-center gap-3 pt-3">
              {/* Google Play Badge */}
              <button
                type="button"
                onClick={() => handleAppStoreClick('Google Play')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black hover:bg-neutral-900 border border-neutral-700/80 text-left transition-colors cursor-pointer min-w-[135px]"
              >
                <svg className="w-5 h-6 shrink-0" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.0077 15.9687L0.127808 30.6588C0.128329 30.6618 0.129372 30.6644 0.129893 30.6674C0.555553 32.2624 2.01661 33.437 3.75067 33.437C4.44385 33.437 5.09466 33.2501 5.65277 32.9221L5.6971 32.8962L21.3207 23.9064L14.0077 15.9687Z" fill="#EA4335"/>
                  <path d="M28.0501 13.4672L28.0368 13.4581L21.2917 9.55902L13.6925 16.3019L21.3181 23.9048L28.0276 20.0444C29.204 19.4112 30.0025 18.1746 30.0025 16.7487C30.0025 15.333 29.2147 14.1025 28.0501 13.4672Z" fill="#FBBC04"/>
                  <path d="M0.127294 2.7777C0.0438569 3.0845 0 3.40586 0 3.73956V29.6974C0 30.0305 0.0433351 30.353 0.127815 30.6587L14.4854 16.3445L0.127294 2.7777Z" fill="#4285F4"/>
                  <path d="M14.1101 16.7183L21.2943 9.55656L5.6884 0.534302C5.12115 0.195522 4.45914 3.8147e-06 3.7507 3.8147e-06C2.01665 3.8147e-06 0.55363 1.17663 0.127841 2.77368C0.127319 2.77524 0.127319 2.77628 0.127319 2.77771L14.1101 16.7183Z" fill="#34A853"/>
                </svg>
                <div className="leading-tight">
                  <p className="text-[7px] uppercase tracking-wider text-neutral-400">СКАЧАЙТЕ</p>
                  <p className="text-[11px] font-bold text-white">Google Play</p>
                </div>
              </button>

              {/* App Store Badge */}
              <button
                type="button"
                onClick={() => handleAppStoreClick('App Store')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black hover:bg-neutral-900 border border-neutral-700/80 text-left transition-colors cursor-pointer min-w-[135px]"
              >
                <svg className="w-5 h-6 shrink-0" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.2365 15.0545C19.2647 12.8692 20.4383 10.8014 22.3 9.65679C21.1255 7.97937 19.1583 6.91584 17.1115 6.8518C14.9285 6.62267 12.8122 8.15808 11.6998 8.15808C10.5658 8.15808 8.85305 6.87455 7.00871 6.9125C4.60468 6.99017 2.36352 8.35697 1.19391 10.4587C-1.32029 14.8117 0.555077 21.209 2.96347 24.7276C4.16844 26.4506 5.5767 28.3752 7.41939 28.3069C9.22257 28.2321 9.89602 27.1571 12.0726 27.1571C14.229 27.1571 14.8608 28.3069 16.7409 28.2635C18.6758 28.2321 19.8949 26.5329 21.0576 24.7936C21.9233 23.566 22.5895 22.2091 23.0315 20.7734C20.7577 19.8117 19.2392 17.5233 19.2365 15.0545Z" fill="white"/>
                  <path d="M15.6853 4.53781C16.7403 3.27133 17.2601 1.6435 17.1342 0C15.5224 0.169287 14.0336 0.939613 12.9644 2.15749C11.9188 3.34742 11.3747 4.94661 11.4775 6.5273C13.0899 6.5439 14.675 5.79446 15.6853 4.53781Z" fill="white"/>
                </svg>
                <div className="leading-tight">
                  <p className="text-[7px] uppercase tracking-wider text-neutral-400">СКАЧАЙТЕ</p>
                  <p className="text-[11px] font-bold text-white">App Store</p>
                </div>
              </button>
            </div>
          </div>

          {/* Right Columns (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-neutral-300 font-light">
            
            {/* Column 1: Categories dynamically from DB */}
            <div className="space-y-3">
              {col1Categories.length === 0 ? (
                <p className="text-neutral-500">Загрузка...</p>
              ) : (
                col1Categories.map((cat) => (
                  <p key={cat.id}>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(cat.name)}
                      className="hover:text-white transition-colors cursor-pointer text-left truncate block max-w-[200px]"
                    >
                      {cat.name}
                    </button>
                  </p>
                ))
              )}
            </div>

            {/* Column 2: Categories dynamically from DB */}
            <div className="space-y-3">
              {col2Categories.map((cat) => (
                <p key={cat.id}>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(cat.name)}
                    className="hover:text-white transition-colors cursor-pointer text-left truncate block max-w-[200px]"
                  >
                    {cat.name}
                  </button>
                </p>
              ))}
            </div>

            {/* Column 3: Contacts, Policies */}
            <div className="space-y-3">
              <p>
                <button
                  type="button"
                  onClick={() => setActiveModal('contacts')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Контакты
                </button>
              </p>
              <p>
                <button
                  type="button"
                  onClick={() => setActiveModal('privacy')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Политика конфиденциальности
                </button>
              </p>
              <p>
                <button
                  type="button"
                  onClick={() => setActiveModal('terms')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Условия пользования
                </button>
              </p>
            </div>

          </div>

        </div>

        {/* Bottom Copyright & Social Icons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-300 font-light">
          <div>
            <p>© 2024 LLC. Все права защищены. Создание сайта PROLab Agency.</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Facebook */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-white hover:opacity-80 transition-opacity"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
              </svg>
            </a>

            {/* Twitter/X */}
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-white hover:opacity-80 transition-opacity"
              aria-label="Twitter"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-white hover:opacity-80 transition-opacity"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* TikTok */}
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-white hover:opacity-80 transition-opacity"
              aria-label="TikTok"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43c.25-.26.47-.54.67-.84V11.2a8.16 8.16 0 0 0 5.06 1.76v-3.5a4.78 4.78 0 0 1-3.45-1.27z" />
              </svg>
            </a>
          </div>
        </div>

      </div>

      {/* Info Modals */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white text-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'contacts' && (
              <div>
                <h3 className="text-lg font-bold mb-3">Контакты службы поддержки</h3>
                <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
                  <p><strong>Служба заботы:</strong> support@adverts.kg</p>
                  <p><strong>Телефон / WhatsApp:</strong> +996 (555) 123-456</p>
                  <p><strong>Режим работы:</strong> Пн - Вс, 09:00 — 21:00</p>
                  <p><strong>Офис:</strong> г. Бишкек, пр. Чуй, 114</p>
                </div>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div>
                <h3 className="text-lg font-bold mb-3">Политика конфиденциальности</h3>
                <div className="text-sm text-gray-600 max-h-60 overflow-y-auto space-y-2 pr-1">
                  <p>Мы бережно относимся к безопасности ваших персональных данных.</p>
                  <p>Вся передаваемая информация (телефон, имя, геолокация) используется исключительно для связи между покупателем и продавцом.</p>
                  <p>Мы не передаем данные третьим лицам без вашего прямого согласия.</p>
                </div>
              </div>
            )}

            {activeModal === 'terms' && (
              <div>
                <h3 className="text-lg font-bold mb-3">Условия пользования</h3>
                <div className="text-sm text-gray-600 max-h-60 overflow-y-auto space-y-2 pr-1">
                  <p>1. Публикуемые объявления должны соответствовать действующему законодательству.</p>
                  <p>2. Запрещается размещение заведомо недостоверной информации и дубликатов.</p>
                  <p>3. Администрация оставляет за собой право модерации объявлений.</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="mt-5 w-full py-2 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-xl transition-colors"
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
