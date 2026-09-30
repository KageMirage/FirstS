'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useAds } from '../hooks/useAds';
import { useAppDispatch } from '../hooks/redux';
import { hydrateAuth } from '../store/slices/authSlice';
import { setFavoriteIds, setSelectedAd, addLocalAd } from '../store/slices/adsSlice';
import { AdItem } from '../types/api';

function DataInitializer({ children }: { children: React.ReactNode }) {
  const { loadAds } = useAds();
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('adverts_user');
      const savedToken = localStorage.getItem('adverts_token');
      if (savedUser || savedToken) {
        dispatch(
          hydrateAuth({
            user: savedUser ? JSON.parse(savedUser) : null,
            token: savedToken || null,
          })
        );
        const savedFavs = localStorage.getItem('adverts_favorites');
        if (savedFavs) {
          dispatch(setFavoriteIds(JSON.parse(savedFavs)));
        }
      } else {
        dispatch(setFavoriteIds([]));
        localStorage.removeItem('adverts_favorites');
      }
      const savedSelected = sessionStorage.getItem('adverts_selected_ad') || localStorage.getItem('adverts_last_selected_ad');
      if (savedSelected) {
        dispatch(setSelectedAd(JSON.parse(savedSelected)));
      }
      const savedLocalAds = localStorage.getItem('adverts_local_ads');
      if (savedLocalAds) {
        const localAds = JSON.parse(savedLocalAds);
        if (Array.isArray(localAds)) {
          localAds.forEach((ad: AdItem) => dispatch(addLocalAd(ad)));
        }
      }
    } catch {}

    loadAds();
  }, [loadAds, dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <DataInitializer>{children}</DataInitializer>
    </Provider>
  );
}
