'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { SideBanners } from './SideBanners';
import { AdCard } from './AdCard';
import { useAds } from '../hooks/useAds';
import { useSearchParams } from '../hooks/useSearchParams';
import { useUI } from '../hooks/useUI';
import { SellerHeaderCard } from './seller/SellerHeaderCard';
import { DEFAULT_USER_AVATAR, isSamePhoneNumber } from '../utils/authStorage';
import { apiService } from '../api/endpoints';
import { AdItem } from '../types/api';

export const SellerProfilePage: React.FC = () => {
  const { items } = useAds();
  const { notify } = useUI();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get seller info from query or defaults
  const sellerId = searchParams.get('seller_id') || searchParams.get('user') || searchParams.get('user_id');
  const querySellerName = searchParams.get('seller_name') || searchParams.get('name');
  const querySellerPhone = searchParams.get('seller_phone') || searchParams.get('phone');
  const querySellerAvatar = searchParams.get('seller_avatar');

  const [backendSellerAds, setBackendSellerAds] = useState<AdItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch from backend if sellerId is provided
  useEffect(() => {
    if (!sellerId) return;

    let isSubscribed = true;
    setIsLoading(true);

    apiService
      .getAds({ user: sellerId })
      .then((res) => {
        if (isSubscribed && res?.results) {
          setBackendSellerAds(res.results);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch seller ads:', err.message);
      })
      .finally(() => {
        if (isSubscribed) setIsLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [sellerId]);

  // Determine active ads list
  const sellerAds = backendSellerAds ?? items.filter((ad) => {
    if (sellerId && ad.user?.id) {
      return String(ad.user.id) === String(sellerId);
    }
    if (querySellerName) {
      if (ad.user?.full_name?.toLowerCase() === querySellerName.toLowerCase()) return true;
    }
    if (querySellerPhone) {
      if (ad.user?.phone_number && isSamePhoneNumber(ad.user.phone_number, querySellerPhone)) return true;
      if (ad.phone_number && isSamePhoneNumber(ad.phone_number, querySellerPhone)) return true;
    }
    return false;
  });

  const firstAd = sellerAds[0];
  const sellerName = firstAd?.user?.full_name || querySellerName || 'Продавец';
  const sellerPhone = firstAd?.phone_number || firstAd?.whatsapp_number || querySellerPhone || '+996 700 600 600';
  const sellerAvatar = firstAd?.user?.avatar || querySellerAvatar || DEFAULT_USER_AVATAR;

  const totalPages = Math.max(1, Math.ceil(sellerAds.length / itemsPerPage));
  const currentAds = sellerAds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setSearchParams({ view: 'home' });
    }
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      notify('Ссылка на профиль скопирована в буфер обмена', 'success');
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-[calc(100vh-80px)] py-6" id="seller-profile-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Grid: Left Banners, Right Content */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Column: Side Ad Banners */}
          <div className="w-full lg:w-72 xl:w-80 shrink-0">
            <SideBanners count={4} />
          </div>

          {/* Right Column: Seller Profile Header + Ads Grid */}
          <div className="flex-1 w-full space-y-5">
            <SellerHeaderCard
              name={sellerName}
              phone={sellerPhone}
              avatar={sellerAvatar}
              adsCount={sellerAds.length}
              onBack={handleBack}
              onShare={handleShare}
            />

            {/* Seller Ads Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">
                  Объявления продавца ({sellerAds.length})
                </h3>
              </div>

              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-gray-500 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#1976D2]" />
                  <span className="text-xs font-medium">Загрузка объявлений продавца...</span>
                </div>
              ) : currentAds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentAds.map((ad) => (
                    <AdCard key={ad.id} ad={ad} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-500 text-sm">
                  У этого продавца пока нет активных объявлений.
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-6 pb-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-xl font-bold text-sm transition cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-[#1976D2] text-white shadow-xs'
                            : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {totalPages > 5 && (
                    <>
                      <span className="px-1 text-gray-400 text-sm">...</span>
                      <button
                        type="button"
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-9 h-9 rounded-xl font-bold text-sm border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
