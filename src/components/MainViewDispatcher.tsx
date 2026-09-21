'use client';

import React from 'react';
import { HomePage } from './HomePage';
import { FilterPage } from './FilterPage';
import { AdDetailPage } from './AdDetailPage';
import { CreateAdPage } from './CreateAdPage';
import { CabinetPage } from './CabinetPage';
import { SellerProfilePage } from './SellerProfilePage';
import { ErrorPageView } from './ErrorPageView';
import { useSearchParams } from '../hooks/useSearchParams';

export const MainViewDispatcher: React.FC = () => {
  const [searchParams, , pathname] = useSearchParams();

  const viewParam = searchParams.get('view');
  const hasAdId = Boolean(searchParams.get('id') || searchParams.get('ad_id'));

  // Priority 0: Explicit 404 / 505 / 500 error pages
  if (pathname === '/404' || viewParam === '404') {
    return <ErrorPageView code="404" title="Страница не найдена" buttonText="На главную" />;
  }
  if (pathname === '/505' || pathname === '/500' || viewParam === '505' || viewParam === '500') {
    return <ErrorPageView code="505" title="Ошибка сервера" buttonText="На главную" />;
  }

  // Priority 1: Ad Detail Page (if view is ad, or path is /ad, or an ad is explicitly requested)
  const isAdDetailPage =
    pathname === '/ad' ||
    pathname.startsWith('/ad/') ||
    viewParam === 'ad' ||
    (viewParam === 'detail' && hasAdId);

  // Priority 2: Create Ad Page
  const isCreateAdPage =
    pathname === '/create' ||
    pathname === '/create-ad' ||
    pathname === '/post-ad' ||
    viewParam === 'create' ||
    viewParam === 'create-ad' ||
    viewParam === 'post-ad';

  // Priority 3: Cabinet / Profile / Favorites / Messages
  const isCabinetPage =
    pathname === '/profile' ||
    pathname === '/cabinet' ||
    pathname === '/messages' ||
    pathname === '/my-ads' ||
    pathname === '/favorites' ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/cabinet') ||
    viewParam === 'profile' ||
    viewParam === 'cabinet' ||
    viewParam === 'messages' ||
    viewParam === 'my-ads' ||
    viewParam === 'favorites';

  // Priority 4: Seller Profile Page
  const isSellerPage =
    pathname === '/seller' ||
    pathname.startsWith('/seller') ||
    viewParam === 'seller';

  // Priority 5: Filter / Search Results Page
  const isFilterPage =
    pathname === '/filter' ||
    pathname.startsWith('/filter') ||
    viewParam === 'filter' ||
    Boolean(
      searchParams.get('category') ||
      searchParams.get('q') ||
      searchParams.get('min_price') ||
      searchParams.get('max_price') ||
      searchParams.get('has_photo') ||
      searchParams.get('pill')
    );

  if (isAdDetailPage) return <AdDetailPage />;
  if (isCreateAdPage) return <CreateAdPage />;
  if (isCabinetPage) return <CabinetPage />;
  if (isSellerPage) return <SellerProfilePage />;
  if (isFilterPage) return <FilterPage />;
  
  if (pathname === '/' || pathname === '' || !pathname) {
    return <HomePage />;
  }

  // Fallback for any unknown route
  return <ErrorPageView code="404" title="Страница не найдена" buttonText="На главную" />;
};

export default MainViewDispatcher;
