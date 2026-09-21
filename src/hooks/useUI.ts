import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import {
  setPostAdOpen,
  setAuthModalOpen,
  setCategoryMenuOpen,
  setAdDetailOpen,
  setPartnerBannerOpen,
  showToast,
  hideToast,
} from '../store/slices/uiSlice';

export const useUI = () => {
  const dispatch = useAppDispatch();
  const {
    isPostAdOpen,
    isAuthModalOpen,
    isCategoryMenuOpen,
    isAdDetailOpen,
    isPartnerBannerOpen,
    selectedBannerType,
    toastMessage,
    toastType,
  } = useAppSelector((state) => state.ui);

  const openPostAd = useCallback(() => dispatch(setPostAdOpen(true)), [dispatch]);
  const closePostAd = useCallback(() => dispatch(setPostAdOpen(false)), [dispatch]);

  const openAuth = useCallback(() => dispatch(setAuthModalOpen(true)), [dispatch]);
  const closeAuth = useCallback(() => dispatch(setAuthModalOpen(false)), [dispatch]);

  const openCategoryMenu = useCallback(() => dispatch(setCategoryMenuOpen(true)), [dispatch]);
  const closeCategoryMenu = useCallback(() => dispatch(setCategoryMenuOpen(false)), [dispatch]);
  const toggleCategoryMenu = useCallback(
    () => dispatch(setCategoryMenuOpen(!isCategoryMenuOpen)),
    [dispatch, isCategoryMenuOpen]
  );

  const openAdDetail = useCallback(() => dispatch(setAdDetailOpen(true)), [dispatch]);
  const closeAdDetail = useCallback(() => dispatch(setAdDetailOpen(false)), [dispatch]);

  const openPartnerBanner = useCallback(
    (type: 'aiza-med' | 'real-estate') => {
      dispatch(setPartnerBannerOpen({ open: true, type }));
    },
    [dispatch]
  );
  const closePartnerBanner = useCallback(() => {
    dispatch(setPartnerBannerOpen({ open: false }));
  }, [dispatch]);

  const notify = useCallback(
    (message: string, type: 'success' | 'info' | 'error' = 'info') => {
      dispatch(showToast({ message, type }));
      setTimeout(() => {
        dispatch(hideToast());
      }, 3500);
    },
    [dispatch]
  );

  return {
    isPostAdOpen,
    isAuthModalOpen,
    isCategoryMenuOpen,
    isAdDetailOpen,
    isPartnerBannerOpen,
    selectedBannerType,
    toastMessage,
    toastType,
    openPostAd,
    closePostAd,
    openAuth,
    closeAuth,
    openCategoryMenu,
    closeCategoryMenu,
    toggleCategoryMenu,
    openAdDetail,
    closeAdDetail,
    openPartnerBanner,
    closePartnerBanner,
    notify,
  };
};
