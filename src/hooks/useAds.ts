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
import { showToast } from '../store/slices/uiSlice';

export const useAds = () => {
  const dispatch = useAppDispatch();
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
    isPosting, 
    error 
  } = useAppSelector((state) => state.ads);

  const loadAds = useCallback((params?: { page?: number; category?: number; search?: string }) => {
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
    const isFav = favoriteIds.includes(adId);
    dispatch(toggleAdFavorite(adId));
    dispatch(showToast({
      message: isFav ? 'Удалено из избранного' : 'Добавлено в избранное',
      type: 'info',
    }));
  }, [dispatch, favoriteIds]);

  const removeAd = useCallback((adId: number) => {
    dispatch(removeLocalAd(adId));
    dispatch(showToast({ message: 'Объявление удалено', type: 'info' }));
  }, [dispatch]);

  const publishAd = useCallback(async (formData: FormData, localItem?: AdItem) => {
    try {
      await dispatch(createNewAd(formData)).unwrap();
      dispatch(showToast({ message: 'Объявление успешно опубликовано!', type: 'success' }));
      return true;
    } catch (e: any) {
      if (localItem) {
        dispatch(addLocalAd(localItem));
        dispatch(showToast({ message: 'Объявление добавлено в ленту!', type: 'success' }));
        return true;
      }
      dispatch(showToast({ message: e || 'Ошибка при публикации', type: 'error' }));
      return false;
    }
  }, [dispatch]);

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
