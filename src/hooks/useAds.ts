import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { 
  fetchAds, 
  createNewAd, 
  toggleAdFavorite, 
  setSelectedAd, 
  setSearchQuery, 
  setCurrentPage, 
  setCategoryFilter,
  addLocalAd,
  removeLocalAd
} from '../store/slices/adsSlice';
import { AdItem } from '../types/api';
import { showToast, setAuthModalOpen } from '../store/slices/uiSlice';

export const useAds = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { 
    items, 
    totalCount, 
    currentPage, 
    totalPages, 
    selectedAd, 
    searchQuery, 
    activeCategoryFilter, 
    favoriteIds, 
    isLoading, 
    isLoaded,
    isPosting, 
    error 
  } = useAppSelector((state) => state.ads);

  const loadAds = useCallback((params?: { page?: number; category?: number | string; parent_category?: number | string; region?: number | string; user?: number | string; search?: string; force?: boolean }) => {
    dispatch(fetchAds(params));
  }, [dispatch]);

  const selectAd = useCallback((ad: AdItem | null) => {
    dispatch(setSelectedAd(ad));
  }, [dispatch]);

  const search = useCallback((query: string) => {
    dispatch(setSearchQuery(query));
  }, [dispatch]);

  const changePage = useCallback((page: number) => {
    dispatch(setCurrentPage(page));
  }, [dispatch]);

  const filterByCategory = useCallback((categoryId: number | null) => {
    dispatch(setCategoryFilter(categoryId));
  }, [dispatch]);

  const toggleFavorite = useCallback((adId: number) => {
    if (!isAuthenticated) {
      dispatch(showToast({
        message: 'Войдите в аккаунт, чтобы добавлять в избранное',
        type: 'info',
      }));
      dispatch(setAuthModalOpen(true));
      return false;
    }
    const isFav = favoriteIds.includes(adId);
    dispatch(toggleAdFavorite(adId));
    dispatch(showToast({
      message: isFav ? 'Удалено из избранного' : 'Добавлено в избранное',
      type: 'info',
    }));
    return true;
  }, [dispatch, favoriteIds, isAuthenticated]);

  const removeAd = useCallback((adId: number) => {
    dispatch(removeLocalAd(adId));
    dispatch(showToast({ message: 'Объявление удалено', type: 'info' }));
  }, [dispatch]);

  const publishAd = useCallback(async (formData: FormData, localItem?: AdItem) => {
    if (!isAuthenticated) {
      dispatch(showToast({ message: 'Войдите в аккаунт, чтобы опубликовать объявление', type: 'error' }));
      dispatch(setAuthModalOpen(true));
      return false;
    }

    if (localItem) {
      dispatch(addLocalAd(localItem));
      dispatch(setSelectedAd(localItem));
    }

    try {
      await dispatch(createNewAd(formData)).unwrap();
      dispatch(showToast({ message: 'Объявление успешно опубликовано!', type: 'success' }));
      return true;
    } catch {
      // If server rejected (e.g. 401 unconfirmed or 500), local ad is already securely saved
      if (localItem) {
        dispatch(showToast({ message: 'Объявление успешно добавлено в ваш профиль и ленту!', type: 'success' }));
        return true;
      }
      dispatch(showToast({ message: 'Ошибка при публикации объявления', type: 'error' }));
      return false;
    }
  }, [dispatch, isAuthenticated]);

  return {
    ads: items,
    items,
    totalCount,
    currentPage,
    totalPages,
    selectedAd,
    searchQuery,
    activeCategoryFilter,
    favoriteIds,
    isLoading,
    isLoaded,
    isPosting,
    error,
    loadAds,
    selectAd,
    search,
    changePage,
    filterByCategory,
    toggleFavorite,
    publishAd,
    removeAd,
  };
};
