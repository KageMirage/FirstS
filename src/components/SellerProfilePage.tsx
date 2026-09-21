'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Share2
} from 'lucide-react';
import { SideBanners } from './SideBanners';
import { AdCard } from './AdCard';
import { useAds } from '../hooks/useAds';
import { useSearchParams } from '../hooks/useSearchParams';
import { useUI } from '../hooks/useUI';

export const SellerProfilePage: React.FC = () => {
  const { items } = useAds();
  const { notify } = useUI();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get seller info from query or defaults matching the user's Figma screenshot
  const sellerName = searchParams.get('seller_name') || searchParams.get('name') || 'Asanova Asana';
  const sellerPhone = searchParams.get('seller_phone') || searchParams.get('phone') || '+996 700 600 600';
  const sellerAvatar = searchParams.get('seller_avatar') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter ads for this seller
  const sellerAds = items.filter((ad) => {
    if (ad.user?.full_name?.toLowerCase().includes('asana') || ad.user?.full_name?.toLowerCase().includes(sellerName.toLowerCase().split(' ')[0])) {
      return true;
    }
    return true; // Display ads in seller catalog
  });

  const totalPages = Math.max(1, Math.ceil(sellerAds.length / itemsPerPage));
  const currentAds = sellerAds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleBack = () => {
    // If ad_id or previous view is available, go back, else home/filter
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setSearchParams({ view: 'home' });
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      notify('Ссылка на профиль скопирована в буфер обмена', 'success');
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-[calc(100vh-80px)] py-6" id="seller-profile-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Grid: Left Banners, Right Content (matching screenshot 1) */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Column: Side Ad Banners (Villa, АЙЗА-МЕД, etc.) */}
          <div className="w-full lg:w-72 xl:w-80 shrink-0">
            <SideBanners count={4} />
          </div>

          {/* Right Column: Seller Profile Header + Ads Grid */}
          <div className="flex-1 w-full space-y-5">
            
            {/* Top Seller Card Banner */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              {/* Seller Avatar, Name & Phone */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-sm shrink-0">
                  <img
                    src={sellerAvatar}
                    alt={sellerName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900 truncate">
                      {sellerName}
                    </h1>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Подтвержден</span>
                    </span>
                  </div>
                  <a
                    href={`tel:${sellerPhone.replace(/\s+/g, '')}`}
                    className="text-sm font-semibold text-gray-600 hover:text-[#1a73e8] flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#1a73e8]" />
                    <span>{sellerPhone}</span>
                  </a>
                  <p className="text-xs text-gray-400">
                    На сервисе с 2024 года • {sellerAds.length} объявлений
                  </p>
                </div>
              </div>

              {/* Right: "Вернуться" and "Поделиться" Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={handleShare}
                  title="Поделиться профилем"
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  id="btn-seller-back"
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Вернуться</span>
                </button>
              </div>

            </div>

            {/* Seller Ads Grid (2 columns matching screenshot 1) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">
                  Объявления продавца ({sellerAds.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentAds.map((ad) => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>

              {/* Pagination matching bottom < 1 2 3 ... 10 > in screenshot 1 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-6 pb-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-[#1a73e8] text-white shadow-sm'
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
                        onClick={() => setCurrentPage(totalPages)}
                        className={`w-9 h-9 rounded-xl font-bold text-sm border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all cursor-pointer`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer"
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
