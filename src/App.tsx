'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { FilterPage } from './components/FilterPage';
import { AdDetailPage } from './components/AdDetailPage';
import { CreateAdPage } from './components/CreateAdPage';
import { CabinetPage } from './components/CabinetPage';
import { SellerProfilePage } from './components/SellerProfilePage';
import { Footer } from './components/Footer';
import { PostAdModal } from './components/PostAdModal';
import { AdDetailModal } from './components/AdDetailModal';
import { AuthModal } from './components/AuthModal';
import { CategoryDropdownModal } from './components/CategoryDropdownModal';
import { PartnerBannerModal } from './components/PartnerBannerModal';
import { ToastNotification } from './components/ToastNotification';
import { MobileBottomNav } from './components/MobileBottomNav';
import { useAds } from './hooks/useAds';
import { useSearchParams } from './hooks/useSearchParams';

export function App() {
  const { loadAds } = useAds();
  const [searchParams, , pathname] = useSearchParams();

  useEffect(() => {
    // Initial fetch from the REST API
    loadAds();
  }, [loadAds]);

  const isCabinetPage =
    pathname === '/profile' ||
    pathname === '/cabinet' ||
    pathname === '/messages' ||
    pathname === '/my-ads' ||
    pathname === '/favorites' ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/cabinet') ||
    searchParams.get('view') === 'profile' ||
    searchParams.get('view') === 'cabinet' ||
    searchParams.get('view') === 'messages' ||
    searchParams.get('view') === 'my-ads' ||
    searchParams.get('view') === 'favorites';

  const isSellerPage =
    pathname === '/seller' ||
    pathname.startsWith('/seller') ||
    searchParams.get('view') === 'seller';

  const isCreateAdPage = 
    pathname === '/create' ||
    pathname === '/create-ad' ||
    pathname === '/post-ad' ||
    searchParams.get('view') === 'create' ||
    searchParams.get('view') === 'create-ad' ||
    searchParams.get('view') === 'post-ad';

  const isAdDetailPage = 
    pathname === '/ad' ||
    pathname.startsWith('/ad/') ||
    searchParams.get('view') === 'ad' ||
    Boolean(searchParams.get('ad_id'));

  const isFilterPage = 
    pathname === '/filter' || 
    pathname.startsWith('/filter') ||
    searchParams.get('view') === 'filter' ||
    Boolean(
      searchParams.get('category') || 
      searchParams.get('q') || 
      searchParams.get('search') ||
      searchParams.get('min_price') || 
      searchParams.get('max_price') || 
      searchParams.get('has_photo') ||
      searchParams.get('pill')
    );

  return (
    <div className="min-h-screen bg-[#fcfdfe] text-gray-900 flex flex-col font-sans antialiased selection:bg-[#1976D2] selection:text-white pb-20 sm:pb-0" id="adverts-pro-app">
      
      {/* 1. Top Navbar Header */}
      <Navbar />

      {/* Main Content: Cabinet, Seller Profile, Create Ad, Ad Detail, Filter, or Home Page */}
      <main className="flex-1">
        {isCabinetPage ? (
          <CabinetPage />
        ) : isSellerPage ? (
          <SellerProfilePage />
        ) : isCreateAdPage ? (
          <CreateAdPage />
        ) : isAdDetailPage ? (
          <AdDetailPage />
        ) : isFilterPage ? (
          <FilterPage />
        ) : (
          <HomePage />
        )}
      </main>

      {/* Dark Footer with App download and links */}
      <Footer />

      {/* Mobile Floating Bottom Navigation Bar (Screenshots 2, 3, 4) */}
      <MobileBottomNav />

      {/* Modals & Overlays */}
      <PostAdModal />
      <AdDetailModal />
      <AuthModal />
      <CategoryDropdownModal />
      <PartnerBannerModal />
      <ToastNotification />

    </div>
  );
}

export default App;
