'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, AlertCircle, Loader2, Heart, Share2 } from 'lucide-react';
import { useSearchParams } from '../hooks/useSearchParams';
import { useAds } from '../hooks/useAds';
import { useUI } from '../hooks/useUI';
import { AdLightboxModal } from './AdLightboxModal';
import { AdItem } from '../types/api';
import { apiService } from '../api/endpoints';
import { SideBanners } from './SideBanners';
import { AdGallery } from './ad-detail/AdGallery';
import { AdInfoBox } from './ad-detail/AdInfoBox';
import { AdCommentsSection } from './ad-detail/AdCommentsSection';
import { AdRecentAdsList } from './ad-detail/AdRecentAdsList';
import { DEFAULT_USER_AVATAR } from '../utils/authStorage';

const DEFAULT_GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=80',
];

export const AdDetailPage: React.FC = () => {
  const [searchParams, setSearchParams, , navigate] = useSearchParams();
  const { ads, selectedAd, favoriteIds, toggleFavorite, selectAd, isLoading } = useAds();
  const { openAuth, notify } = useUI();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [fetchedAd, setFetchedAd] = useState<AdItem | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const adIdParam = searchParams.get('ad_id') || searchParams.get('id');
  const targetId = adIdParam ? parseInt(adIdParam, 10) : null;

  // Immediate local cache resolution to avoid any flash on page reload
  useEffect(() => {
    if (!targetId) return;

    if (selectedAd && selectedAd.id === targetId) return;

    const inAds = ads.find((a) => a.id === targetId);
    if (inAds) {
      selectAd(inAds);
      setFetchedAd(inAds);
      return;
    }

    try {
      const saved = sessionStorage.getItem('adverts_selected_ad');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.id === targetId) {
          selectAd(parsed);
          setFetchedAd(parsed);
          return;
        }
      }
      const lastSaved = localStorage.getItem('adverts_last_selected_ad');
      if (lastSaved) {
        const parsed = JSON.parse(lastSaved);
        if (parsed.id === targetId) {
          selectAd(parsed);
          setFetchedAd(parsed);
          return;
        }
      }
      const localSaved = localStorage.getItem('adverts_local_ads');
      if (localSaved) {
        const list: AdItem[] = JSON.parse(localSaved);
        const match = list.find((i) => i.id === targetId);
        if (match) {
          selectAd(match);
          setFetchedAd(match);
          return;
        }
      }
    } catch {}

    let isSubscribed = true;
    setIsFetching(true);
    setIsNotFound(false);
    apiService
      .getAdById(targetId)
      .then((data) => {
        if (isSubscribed && data) {
          setFetchedAd(data);
          selectAd(data);
        }
      })
      .catch(() => {
        if (isSubscribed) {
          // Double check if loaded into ads in redux
          const fallback = ads.find((a) => a.id === targetId);
          if (fallback) {
            setFetchedAd(fallback);
            selectAd(fallback);
          } else {
            setIsNotFound(true);
          }
        }
      })
      .finally(() => {
        if (isSubscribed) setIsFetching(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [targetId, ads, selectedAd, selectAd]);

  // Synchronize if ads finishes loading later
  useEffect(() => {
    if (targetId && !fetchedAd && ads.length > 0) {
      const match = ads.find((a) => a.id === targetId);
      if (match) {
        setFetchedAd(match);
        selectAd(match);
        setIsNotFound(false);
      }
    }
  }, [ads, targetId, fetchedAd, selectAd]);

  const currentAd: AdItem | null = useMemo(() => {
    if (targetId) {
      if (selectedAd && selectedAd.id === targetId) return selectedAd;
      const found = ads.find((a) => a.id === targetId);
      if (found) return found;
      if (fetchedAd && fetchedAd.id === targetId) return fetchedAd;
      return null;
    }
    return selectedAd || (ads.length > 0 ? ads[0] : null);
  }, [targetId, selectedAd, ads, fetchedAd]);

  const galleryImages = useMemo(() => {
    if (!currentAd) return DEFAULT_GALLERY_IMAGES;
    const list: string[] = [];
    if (currentAd.image) list.push(currentAd.image);
    if (Array.isArray(currentAd.images)) {
      currentAd.images.forEach((imgItem) => {
        const url = typeof imgItem === 'string' ? imgItem : imgItem?.image;
        if (url && !list.includes(url)) list.push(url);
      });
    }
    if (list.length === 0) {
      DEFAULT_GALLERY_IMAGES.forEach((img) => list.push(img));
    }
    return list;
  }, [currentAd]);

  const handleBack = () => {
    if (window.history.length > 2) window.history.back();
    else navigate('/');
  };

  const handleSellerClick = () => {
    if (!currentAd) return;
    setSearchParams({
      view: 'seller',
      seller_id: currentAd.user?.id ? String(currentAd.user.id) : '',
      seller_name: currentAd.user?.full_name || 'Продавец',
      seller_phone: currentAd.phone_number || currentAd.whatsapp_number || '+996 700 600 600',
      seller_avatar: currentAd.user?.avatar || DEFAULT_USER_AVATAR,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // While waiting for ad details to resolve on refresh, show loader, not 404
  const isResolvingAd = Boolean(targetId && !currentAd && !isNotFound);

  if (isResolvingAd || (isFetching && !currentAd) || (isLoading && ads.length === 0 && !currentAd)) {
    return (
      <div className="min-h-screen bg-[#fcfdfe] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-[#1976D2] animate-spin mb-3" />
        <p className="text-gray-500 font-medium">Загрузка объявления...</p>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="min-h-screen bg-[#fcfdfe] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Объявление не найдено</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          Возможно, оно было снято с публикации или удалено автором.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-[#1976D2] text-white rounded-xl font-semibold hover:bg-[#1565C0] cursor-pointer"
        >
          Ко всем объявлениям
        </button>
      </div>
    );
  }

  if (!currentAd) return null;

  return (
    <div className="bg-[#fcfdfe] min-h-screen pb-16" id="ad-detail-page-container">
      <div className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button type="button" onClick={handleBack} className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#1976D2] transition-colors cursor-pointer">
            <ChevronLeft className="w-5 h-5 text-gray-400" />
            <span>Назад ко всем объявлениям</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  notify('Ссылка скопирована в буфер обмена', 'info');
                }
              }}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
              title="Поделиться"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(currentAd.id)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                favoriteIds.includes(currentAd.id)
                  ? 'bg-rose-50 text-rose-500'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title="В избранное"
            >
              <Heart
                className={`w-4 h-4 ${
                  favoriteIds.includes(currentAd.id) ? 'fill-rose-500 stroke-rose-500' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0 space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start" id="ad-detail-hero">
              <div className="md:col-span-6">
                <AdGallery
                  images={galleryImages}
                  activeIndex={activeImageIndex}
                  adTitle={currentAd.title}
                  onSelectIndex={setActiveImageIndex}
                  onOpenLightbox={(idx) => { setActiveImageIndex(idx); setIsLightboxOpen(true); }}
                />
              </div>
              <div className="md:col-span-6">
                <AdInfoBox ad={currentAd} onSellerClick={handleSellerClick} />
              </div>
            </div>

            <AdCommentsSection
              adId={currentAd.id}
              initialComments={currentAd.comments}
              onOpenAuth={openAuth}
              onNotify={notify}
            />

            <AdRecentAdsList
              ads={ads.slice(0, 4)}
              favoriteIds={favoriteIds}
              onSelectAd={(ad) => { selectAd(ad); setSearchParams({ view: 'ad', id: String(ad.id) }, { pathname: '/ad' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              onToggleFavorite={toggleFavorite}
            />
          </div>

          <div className="hidden lg:block">
            <SideBanners count={4} />
          </div>
        </div>
      </div>

      <AdLightboxModal
        isOpen={isLightboxOpen}
        images={galleryImages}
        currentIndex={activeImageIndex}
        onClose={() => setIsLightboxOpen(false)}
        onSelectIndex={setActiveImageIndex}
      />
    </div>
  );
};
