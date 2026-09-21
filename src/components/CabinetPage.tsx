'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  User as UserIcon, 
  Briefcase, 
  Heart, 
  LogOut, 
  Plus, 
  Trash2, 
  ExternalLink,
  ShieldCheck, 
  Phone, 
  Mail, 
  Camera, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  Calendar,
  Eye,
  Upload,
  RefreshCw,
  Pencil
} from 'lucide-react';
import { useAds } from '../hooks/useAds';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { useSearchParams } from '../hooks/useSearchParams';
import { AdCard } from './AdCard';
import { AdItem } from '../types/api';

export const CabinetPage: React.FC = () => {
  const { items, favoriteIds, removeAd } = useAds();
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { notify, openAuth } = useUI();
  const [searchParams, setSearchParams] = useSearchParams();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Read active tab from URL: 'ads' | 'favorites' | 'profile'
  const currentTab = (searchParams.get('tab') as 'ads' | 'favorites' | 'profile') || 'ads';
  const [activeTab, setActiveTab] = useState<'ads' | 'favorites' | 'profile'>(currentTab);

  // Profile form state for editing
  const [fullName, setFullName] = useState(user?.full_name || 'Асан');
  const [phone, setPhone] = useState(user?.phone_number || '+996');
  const [telegramNumber, setTelegramNumber] = useState(user?.telegram_number || '+996');
  const [whatsappNumber, setWhatsappNumber] = useState(user?.whatsapp_number || '+996');
  const [password, setPassword] = useState('••••••••••');
  const [email, setEmail] = useState(user?.email || 'umarerme@gmail.com');
  const [isSaved, setIsSaved] = useState(false);

  // Sync form when user state changes
  useEffect(() => {
    if (user) {
      if (user.full_name) setFullName(user.full_name);
      if (user.phone_number) setPhone(user.phone_number);
      if (user.telegram_number) setTelegramNumber(user.telegram_number);
      if (user.whatsapp_number) setWhatsappNumber(user.whatsapp_number);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  // Pagination for favorites
  const [favPage, setFavPage] = useState(1);
  const itemsPerPage = 6;

  // Handle avatar file selection & upload
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

    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const newAvatarUrl = event.target?.result as string;
      if (user) {
        updateProfile({
          ...user,
          avatar: newAvatarUrl,
        });
      } else {
        updateProfile({
          id: Date.now(),
          full_name: fullName,
          phone_number: phone,
          email: email,
          avatar: newAvatarUrl,
        });
      }
      setIsUploadingAvatar(false);
      notify('Фото профиля успешно обновлено!', 'success');
    };
    reader.onerror = () => {
      setIsUploadingAvatar(false);
      notify('Ошибка при загрузке фото', 'error');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleTriggerAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      updateProfile({
        ...user,
        avatar: undefined,
      });
      notify('Фото профиля удалено', 'info');
    }
  };

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as 'ads' | 'favorites' | 'profile';
    if (tabFromUrl && ['ads', 'favorites', 'profile'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'ads' | 'favorites' | 'profile') => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('view', 'profile');
      next.set('tab', tab);
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User's own ads: Filter ads belonging to user or fallback demo ads
  const myAds = items.filter((ad) => {
    if (user && ad.user?.id === user.id) return true;
    if (ad.user?.full_name === fullName || ad.user?.full_name === 'Asana' || ad.user?.full_name === 'Asanova Asana') return true;
    return false;
  });

  // Favorited ads
  const favoriteAds = items.filter((ad) => favoriteIds.includes(ad.id));
  const totalFavPages = Math.max(1, Math.ceil(favoriteAds.length / itemsPerPage));
  const paginatedFavorites = favoriteAds.slice((favPage - 1) * itemsPerPage, favPage * itemsPerPage);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateProfile({
        ...user,
        full_name: fullName,
        phone_number: phone,
        telegram_number: telegramNumber,
        whatsapp_number: whatsappNumber,
        email: email,
      });
    } else {
      updateProfile({
        id: Date.now(),
        full_name: fullName,
        phone_number: phone,
        telegram_number: telegramNumber,
        whatsapp_number: whatsappNumber,
        email: email,
      });
    }
    setIsSaved(true);
    notify('Данные профиля успешно сохранены!', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Вы уверены, что хотите удалить аккаунт? Все ваши объявления и избранное будут удалены.')) {
      logout();
      notify('Ваш аккаунт был успешно удален', 'info');
      setSearchParams({ view: 'home' });
    }
  };

  const handleOpenPublicProfile = () => {
    notify('Публичный профиль продавца', 'info');
  };

  const handleLogout = () => {
    logout();
    notify('Вы вышли из аккаунта', 'info');
    setSearchParams({ view: 'home' });
  };

  const navigateToCreateAd = () => {
    setSearchParams({ view: 'create-ad' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCatalog = () => {
    setSearchParams({ view: 'filter' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#f8f9fa] min-h-[calc(100vh-80px)] py-6 sm:py-8" id="personal-cabinet-page">
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/png, image/jpeg, image/webp, image/gif"
        className="hidden"
        id="profile-avatar-file-input"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Cabinet 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Sidebar Navigation Card */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 min-h-[480px] sm:min-h-[520px] flex flex-col justify-between sticky top-24">
              
              {/* Navigation Menu List */}
              <nav className="space-y-2" id="cabinet-sidebar-nav">
                
                {/* 1. Профиль */}
                <button
                  id="tab-btn-profile"
                  onClick={() => handleTabChange('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[15px] font-medium transition-all cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-[#e8f1ff] text-[#1a73e8]'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <UserIcon className={`w-5 h-5 ${activeTab === 'profile' ? 'text-[#1a73e8]' : 'text-gray-600'}`} />
                  <span>Профиль</span>
                </button>

                {/* 2. Мои объявления */}
                <button
                  id="tab-btn-my-ads"
                  onClick={() => handleTabChange('ads')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[15px] font-medium transition-all cursor-pointer ${
                    activeTab === 'ads'
                      ? 'bg-[#e8f1ff] text-[#1a73e8]'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className={`w-5 h-5 ${activeTab === 'ads' ? 'text-[#1a73e8]' : 'text-gray-600'}`} />
                    <span>Мои объявления</span>
                  </div>
                  {myAds.length > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      activeTab === 'ads' ? 'bg-[#1a73e8] text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {myAds.length}
                    </span>
                  )}
                </button>

                {/* 3. Мои избранные */}
                <button
                  id="tab-btn-favorites"
                  onClick={() => handleTabChange('favorites')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[15px] font-medium transition-all cursor-pointer ${
                    activeTab === 'favorites'
                      ? 'bg-[#e8f1ff] text-[#1a73e8]'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Heart className={`w-5 h-5 ${activeTab === 'favorites' ? 'text-[#1a73e8]' : 'text-gray-600'}`} />
                    <span>Мои избранные</span>
                  </div>
                  {favoriteAds.length > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      activeTab === 'favorites' ? 'bg-[#1a73e8] text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {favoriteAds.length}
                    </span>
                  )}
                </button>

              </nav>

              {/* Bottom: Выйти из аккаунта */}
              <div className="pt-4 mt-auto">
                <button
                  id="btn-cabinet-logout"
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2 text-[15px] font-medium text-[#ea4335] hover:text-[#d33828] hover:bg-rose-50/50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Выйти из аккаунта</span>
                </button>
              </div>

            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* ================= TAB 1: МОИ ОБЪЯВЛЕНИЯ ================= */}
            {activeTab === 'ads' && (
              <div className="space-y-6" id="my-ads-section">
                
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    Мои объявления
                  </h1>
                  <button
                    id="btn-cabinet-add-ad"
                    onClick={navigateToCreateAd}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1a73e8] hover:bg-[#1666d3] text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Добавить</span>
                  </button>
                </div>

                {/* Ads Content */}
                {myAds.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myAds.map((ad) => (
                      <div key={ad.id} className="relative group">
                        <AdCard ad={ad} />
                        
                        {/* Quick user manage bar overlay on hover */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Вы уверены, что хотите удалить это объявление?')) {
                                removeAd(ad.id);
                                notify('Объявление удалено', 'info');
                              }
                            }}
                            title="Удалить объявление"
                            className="p-1.5 bg-white/90 hover:bg-rose-50 text-gray-600 hover:text-rose-600 rounded-lg shadow-sm border border-gray-200 backdrop-blur-xs transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Exact Empty State from Screenshot 3 (Fishing scene) */
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center flex flex-col items-center justify-center min-h-[420px] shadow-sm">
                    
                    {/* SVG Vector: Fishing rod with ice hole, stool & box */}
                    <div className="w-56 h-44 mb-6 relative flex items-center justify-center">
                      <svg viewBox="0 0 240 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Soft ice/snow background floor */}
                        <ellipse cx="120" cy="155" rx="100" ry="16" fill="#f1f5f9" />
                        
                        {/* Ice hole / Water puddle */}
                        <ellipse cx="70" cy="152" rx="26" ry="8" fill="#e2e8f0" />
                        <ellipse cx="70" cy="152" rx="22" ry="6" fill="#38bdf8" fillOpacity="0.4" />
                        <path d="M62 150 C 66 148, 74 148, 78 150" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />
                        
                        {/* Fishing box / stool */}
                        <rect x="135" y="112" width="46" height="38" rx="6" fill="#3b82f6" />
                        <rect x="131" y="108" width="54" height="8" rx="3" fill="#1d4ed8" />
                        <rect x="148" y="126" width="20" height="12" rx="2" fill="#1e40af" />
                        <circle cx="158" cy="132" r="2.5" fill="#93c5fd" />
                        
                        {/* Fishing Rod */}
                        <path d="M150 110 L95 55 L70 148" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="95" cy="55" r="3" fill="#0284c7" />
                        <circle cx="125" cy="85" r="2" fill="#94a3b8" />
                        
                        {/* Fishing line to water */}
                        <path d="M70 70 L70 148" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                        <circle cx="70" cy="135" r="4" fill="#ef4444" />
                        
                        {/* Decorative floating ice crystals / clean vector details */}
                        <path d="M40 90 L44 95 L40 100 L36 95 Z" fill="#cbd5e1" />
                        <path d="M195 75 L198 79 L195 83 L192 79 Z" fill="#93c5fd" />
                        <circle cx="190" cy="120" r="3" fill="#e2e8f0" />
                      </svg>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      У Вас Еще Нет Активных Объявлений
                    </h2>
                    <p className="text-sm text-gray-500 max-w-sm mb-6">
                      Пора что-нибудь продать! Разместите первое объявление прямо сейчас.
                    </p>

                    <button
                      onClick={navigateToCreateAd}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a73e8] hover:bg-[#1666d3] text-white rounded-xl text-sm font-bold shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Подать объявление</span>
                    </button>

                  </div>
                )}

              </div>
            )}

            {/* ================= TAB 2: МОИ ИЗБРАННЫЕ ================= */}
            {activeTab === 'favorites' && (
              <div className="space-y-6" id="my-favorites-section">
                
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    Мои избранные
                  </h1>
                  {favoriteAds.length > 0 && (
                    <span className="text-sm font-semibold text-gray-500">
                      Всего: {favoriteAds.length}
                    </span>
                  )}
                </div>

                {/* Favorites Content */}
                {favoriteAds.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paginatedFavorites.map((ad) => (
                        <AdCard key={ad.id} ad={ad} />
                      ))}
                    </div>

                    {/* Pagination matching Screenshot 4 */}
                    {totalFavPages > 1 && (
                      <div className="flex items-center justify-center gap-1.5 pt-4">
                        <button
                          disabled={favPage <= 1}
                          onClick={() => setFavPage((p) => Math.max(1, p - 1))}
                          className="w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        {Array.from({ length: totalFavPages }).map((_, idx) => {
                          const pageNum = idx + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setFavPage(pageNum)}
                              className={`w-9 h-9 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                                favPage === pageNum
                                  ? 'bg-[#1a73e8] text-white shadow-sm'
                                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          disabled={favPage >= totalFavPages}
                          onClick={() => setFavPage((p) => Math.min(totalFavPages, p + 1))}
                          className="w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Exact Empty State from Screenshot 5 (Shelf with boxes) */
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center flex flex-col items-center justify-center min-h-[420px] shadow-sm">
                    
                    {/* SVG Vector: Empty shelf & wish box */}
                    <div className="w-56 h-44 mb-6 relative flex items-center justify-center">
                      <svg viewBox="0 0 240 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Floor shadow */}
                        <ellipse cx="120" cy="158" rx="85" ry="12" fill="#f1f5f9" />
                        
                        {/* Storage Shelves / Cabinet Unit */}
                        <rect x="50" y="30" width="140" height="115" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                        {/* Shelf Dividers */}
                        <line x1="50" y1="70" x2="190" y2="70" stroke="#cbd5e1" strokeWidth="2" />
                        <line x1="50" y1="108" x2="190" y2="108" stroke="#cbd5e1" strokeWidth="2" />
                        
                        {/* Boxes on Shelf */}
                        <rect x="65" y="42" width="30" height="24" rx="3" fill="#e2e8f0" />
                        <rect x="145" y="45" width="32" height="20" rx="3" fill="#93c5fd" />
                        <rect x="135" y="80" width="42" height="24" rx="3" fill="#e2e8f0" />
                        
                        {/* Big box on floor with Heart ribbon */}
                        <rect x="85" y="120" width="46" height="34" rx="4" fill="#3b82f6" />
                        <rect x="81" y="116" width="54" height="7" rx="2" fill="#1d4ed8" />
                        
                        {/* Heart icon badge on box */}
                        <circle cx="108" cy="138" r="9" fill="white" />
                        <path d="M108 143 L104 138 C102.5 136.5 102.5 134 104 133 C105.5 132 107.5 133 108 134.5 C108.5 133 110.5 132 112 133 C113.5 134 113.5 136.5 112 138 Z" fill="#ef4444" />
                        
                        {/* Floating sparks */}
                        <circle cx="160" cy="135" r="3" fill="#93c5fd" />
                        <circle cx="70" cy="140" r="2.5" fill="#cbd5e1" />
                      </svg>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Ваш Список Желаний Пуст
                    </h2>
                    <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
                      Сердце ждет, когда вы выберете что-нибудь особенное!
                    </p>

                    <button
                      onClick={navigateToCatalog}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a73e8] hover:bg-[#1666d3] text-white rounded-xl text-sm font-bold shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <span>Перейти в каталог</span>
                    </button>

                  </div>
                )}

              </div>
            )}

            {/* ================= TAB 3: ПРОФИЛЬ ================= */}
            {activeTab === 'profile' && (
              <div id="profile-info-section">
                
                {/* Profile Main Card matching screenshot */}
                <div className="bg-white rounded-3xl border border-gray-100/80 p-6 sm:p-10 shadow-sm">
                  
                  {/* Top Header: Avatar on left, Form Grid on right */}
                  <form onSubmit={handleSaveProfile}>
                    <div className="flex flex-col md:flex-row items-start gap-8 lg:gap-10">
                      
                      {/* Left Column: Avatar with circular pencil button */}
                      <div className="shrink-0 pt-1">
                        <div className="relative">
                          <div 
                            onClick={handleTriggerAvatarUpload}
                            title="Нажмите, чтобы изменить фото профиля"
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#eef2f6] border border-gray-200 cursor-pointer flex items-center justify-center group shadow-xs"
                          >
                            {user?.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={fullName} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                              />
                            ) : (
                              <UserIcon className="w-12 h-12 text-gray-400 stroke-[1.5]" />
                            )}
                          </div>

                          {/* Blue Circular Pencil Action Button */}
                          <button
                            type="button"
                            onClick={handleTriggerAvatarUpload}
                            title="Загрузить новое фото"
                            className="absolute bottom-1 right-1 w-7 h-7 bg-[#1976d2] hover:bg-[#1565c0] text-white rounded-full flex items-center justify-center shadow-sm border-2 border-white transition-all cursor-pointer hover:scale-110 active:scale-95"
                          >
                            <Pencil className="w-3.5 h-3.5 fill-current text-white stroke-[0]" />
                          </button>
                        </div>
                      </div>

                      {/* Right Form 2-Column Grid */}
                      <div className="flex-1 w-full space-y-6">
                        
                        {/* Row 1: ФИО & Номер телефона */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                          
                          {/* ФИО */}
                          <div>
                            <label className="block text-xs sm:text-[13px] font-medium text-gray-600 mb-1.5">
                              ФИО
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Асан"
                                className="w-full h-11 sm:h-12 pl-4 pr-11 bg-[#f9f9f9] hover:bg-[#f5f5f5] focus:bg-white text-gray-800 text-sm rounded-xl border border-transparent focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all placeholder:text-gray-400"
                              />
                              <button
                                type="button"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                title="Редактировать"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Номер телефона */}
                          <div>
                            <label className="block text-xs sm:text-[13px] font-medium text-gray-600 mb-1.5">
                              Номер телефона
                            </label>
                            <div className="relative">
                              <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+996"
                                className="w-full h-11 sm:h-12 pl-4 pr-11 bg-[#f9f9f9] hover:bg-[#f5f5f5] focus:bg-white text-gray-800 text-sm rounded-xl border border-transparent focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all placeholder:text-gray-400"
                              />
                              <button
                                type="button"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                title="Редактировать"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                        </div>

                        {/* Row 2: Telegram номер & WhatsApp номер */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                          
                          {/* Telegram номер */}
                          <div>
                            <label className="block text-xs sm:text-[13px] font-medium text-gray-600 mb-1.5">
                              Telegram номер
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={telegramNumber}
                                onChange={(e) => setTelegramNumber(e.target.value)}
                                placeholder="+996"
                                className="w-full h-11 sm:h-12 pl-4 pr-11 bg-[#f9f9f9] hover:bg-[#f5f5f5] focus:bg-white text-gray-800 text-sm rounded-xl border border-transparent focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all placeholder:text-gray-400"
                              />
                              <button
                                type="button"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                title="Редактировать"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* WhatsApp номер */}
                          <div>
                            <label className="block text-xs sm:text-[13px] font-medium text-gray-600 mb-1.5">
                              WhatsApp номер
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={whatsappNumber}
                                onChange={(e) => setWhatsappNumber(e.target.value)}
                                placeholder="+996"
                                className="w-full h-11 sm:h-12 pl-4 pr-11 bg-[#f9f9f9] hover:bg-[#f5f5f5] focus:bg-white text-gray-800 text-sm rounded-xl border border-transparent focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all placeholder:text-gray-400"
                              />
                              <button
                                type="button"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                title="Редактировать"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                        </div>

                        {/* Row 3: Пароль */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                          <div>
                            <label className="block text-xs sm:text-[13px] font-medium text-gray-600 mb-1.5">
                              Пароль
                            </label>
                            <div className="relative">
                              <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••"
                                className="w-full h-11 sm:h-12 pl-4 pr-11 bg-[#f9f9f9] hover:bg-[#f5f5f5] focus:bg-white text-gray-800 text-sm rounded-xl border border-transparent focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all"
                              />
                              <button
                                type="button"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                title="Изменить пароль"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Row 4: Action Buttons Row matching screenshot */}
                        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                          
                          {/* Left: Публичный профиль */}
                          <button
                            type="button"
                            onClick={handleOpenPublicProfile}
                            className="px-6 py-2.5 rounded-xl border border-[#1976d2] text-[#1976d2] hover:bg-[#1976d2]/5 text-sm font-medium transition-colors cursor-pointer text-center"
                          >
                            Публичный профиль
                          </button>

                          {/* Right: Google Circle Icon + Сохранить Button + Удалить аккаунт Button */}
                          <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
                            
                            {/* Google Circle Button with SVG */}
                            <button
                              type="button"
                              onClick={() => notify('Google аккаунт привязан', 'info')}
                              title="Привязать Google аккаунт"
                              className="w-10 h-10 rounded-full bg-[#f9f9f9] hover:bg-[#f0f2f5] border border-gray-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                            >
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.987" fillRule="evenodd" clipRule="evenodd" d="M8.11028 1.19334C8.9259 1.10222 9.40853 1.10222 10.2849 1.19334C11.8362 1.42295 13.2743 2.14001 14.3912 3.24084C13.6364 3.95425 12.8916 4.67807 12.1569 5.41209C10.7499 4.21959 9.1794 3.94434 7.4454 4.58634C6.1734 5.17134 5.28765 6.11934 4.78815 7.43034C3.9719 6.82265 3.16627 6.20081 2.37165 5.56509C2.31643 5.53603 2.25335 5.52538 2.19165 5.53472C3.4539 3.10097 5.4264 1.65347 8.10915 1.19222" fill="#F44336"/>
                                <path opacity="0.997" fillRule="evenodd" clipRule="evenodd" d="M2.18929 5.53484C2.25304 5.52509 2.31341 5.53521 2.37041 5.56521C3.16504 6.20093 3.97066 6.82277 4.78691 7.43046C4.65847 7.94128 4.5775 8.46287 4.54504 8.98859C4.57279 9.49709 4.65341 9.99621 4.78691 10.486L2.25004 12.5053C1.14529 10.1968 1.12504 7.87334 2.18929 5.53484Z" fill="#FFC107"/>
                                <path opacity="0.999" fillRule="evenodd" clipRule="evenodd" d="M14.2706 14.9516C13.4807 14.2549 12.6537 13.6015 11.7933 12.9941C12.6558 12.3851 13.1793 11.5496 13.3638 10.4876H9.13721V7.55245C11.5747 7.5322 14.0111 7.55282 16.4463 7.61432C16.9083 10.1231 16.3747 12.3851 14.8455 14.4003C14.6636 14.5936 14.471 14.7776 14.2706 14.9516Z" fill="#448AFF"/>
                                <path opacity="0.993" fillRule="evenodd" clipRule="evenodd" d="M4.78688 10.4863C5.70938 12.7791 7.40063 13.8493 9.86063 13.6971C10.5512 13.6171 11.2133 13.3759 11.7934 12.9928C12.6544 13.6018 13.4801 14.2543 14.2706 14.9503C13.0181 16.0758 11.4211 16.7437 9.74025 16.8448C9.35836 16.8754 8.97464 16.8754 8.59275 16.8448C5.72925 16.5073 3.615 15.0606 2.25 12.5046L4.78688 10.4863Z" fill="#43A047"/>
                              </svg>
                            </button>

                            {/* Сохранить Button */}
                            <button
                              type="submit"
                              className="px-7 py-2.5 bg-[#1976d2] hover:bg-[#1565c0] text-white rounded-xl text-sm font-medium shadow-xs transition-colors cursor-pointer"
                            >
                              Сохранить
                            </button>

                            {/* Удалить аккаунт Button */}
                            <button
                              type="button"
                              onClick={handleDeleteAccount}
                              className="px-5 py-2.5 rounded-xl border border-[#ea4335] text-[#ea4335] hover:bg-rose-50/50 text-sm font-medium transition-colors cursor-pointer"
                            >
                              Удалить аккаунт
                            </button>
                          </div>

                        </div>

                        {/* Notification when saved */}
                        {isSaved && (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 animate-in fade-in duration-200">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Изменения успешно сохранены!</span>
                          </div>
                        )}

                      </div>

                    </div>
                  </form>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
