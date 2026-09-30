'use client';

import React, { Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { Footer } from './components/Footer';
import { ToastNotification } from './components/ToastNotification';
import { MobileBottomNav } from './components/MobileBottomNav';
import { useSearchParams } from './hooks/useSearchParams';

// Lazy load secondary routes & heavy modals to minimize initial bundle size and avoid data overload
const FilterPage = React.lazy(() => import('./components/FilterPage').then((m) => ({ default: m.FilterPage })));
const AdDetailPage = React.lazy(() => import('./components/AdDetailPage').then((m) => ({ default: m.AdDetailPage })));
const CreateAdPage = React.lazy(() => import('./components/CreateAdPage').then((m) => ({ default: m.CreateAdPage })));
const CabinetPage = React.lazy(() => import('./components/CabinetPage').then((m) => ({ default: m.CabinetPage })));
const SellerProfilePage = React.lazy(() => import('./components/SellerProfilePage').then((m) => ({ default: m.SellerProfilePage })));
const PostAdModal = React.lazy(() => import('./components/PostAdModal').then((m) => ({ default: m.PostAdModal })));
const AdDetailModal = React.lazy(() => import('./components/AdDetailModal').then((m) => ({ default: m.AdDetailModal })));
const AuthModal = React.lazy(() => import('./components/AuthModal').then((m) => ({ default: m.AuthModal })));
const CategoryDropdownModal = React.lazy(() => import('./components/CategoryDropdownModal').then((m) => ({ default: m.CategoryDropdownModal })));
const PartnerBannerModal = React.lazy(() => import('./components/PartnerBannerModal').then((m) => ({ default: m.PartnerBannerModal })));

function PageLoadingFallback() {
  return (
    <div className="min-h-[450px] flex flex-col items-center justify-center py-24 space-y-3">
      <div className="w-9 h-9 rounded-full border-3 border-gray-200 border-t-[#1976D2] animate-spin" />
      <span className="text-xs text-gray-400 font-medium">Загрузка страницы...</span>
    </div>
  );
}

export function App() {
  const [searchParams, , pathname] = useSearchParams();

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
        <Suspense fallback={<PageLoadingFallback />}>
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
        </Suspense>
      </main>

      {/* Dark Footer with App download and links */}
      <Footer />

      {/* Mobile Floating Bottom Navigation Bar (Screenshots 2, 3, 4) */}
      <MobileBottomNav />

      {/* Modals & Overlays (Loaded lazily on-demand) */}
      <Suspense fallback={null}>
        <PostAdModal />
        <AdDetailModal />
        <AuthModal />
        <CategoryDropdownModal />
        <PartnerBannerModal />
      </Suspense>

      <ToastNotification />

    </div>
  );
}

export default App;
