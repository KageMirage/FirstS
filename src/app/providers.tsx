'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useAds } from '../hooks/useAds';
import { useAppDispatch } from '../hooks/redux';
import { hydrateAuth } from '../store/slices/authSlice';
import { setFavoriteIds } from '../store/slices/adsSlice';

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
      }
      const savedFavs = localStorage.getItem('adverts_favorites');
      if (savedFavs) {
        dispatch(setFavoriteIds(JSON.parse(savedFavs)));
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
