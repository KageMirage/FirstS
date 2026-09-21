import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isPostAdOpen: boolean;
  isAuthModalOpen: boolean;
  isCategoryMenuOpen: boolean;
  isAdDetailOpen: boolean;
  isPartnerBannerOpen: boolean;
  selectedBannerType: 'aiza-med' | 'real-estate' | null;
  toastMessage: string | null;
  toastType: 'success' | 'info' | 'error';
}

const initialState: UIState = {
  isPostAdOpen: false,
  isAuthModalOpen: false,
  isCategoryMenuOpen: false,
  isAdDetailOpen: false,
  isPartnerBannerOpen: false,
  selectedBannerType: null,
  toastMessage: null,
  toastType: 'info',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setPostAdOpen: (state, action: PayloadAction<boolean>) => {
      state.isPostAdOpen = action.payload;
    },
    setAuthModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAuthModalOpen = action.payload;
    },
    setCategoryMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isCategoryMenuOpen = action.payload;
    },
    setAdDetailOpen: (state, action: PayloadAction<boolean>) => {
      state.isAdDetailOpen = action.payload;
    },
    setPartnerBannerOpen: (state, action: PayloadAction<{ open: boolean; type?: 'aiza-med' | 'real-estate' }>) => {
      state.isPartnerBannerOpen = action.payload.open;
      state.selectedBannerType = action.payload.type || null;
    },
    showToast: (state, action: PayloadAction<{ message: string; type?: 'success' | 'info' | 'error' }>) => {
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type || 'info';
    },
    hideToast: (state) => {
      state.toastMessage = null;
    },
  },
});

export const {
  setPostAdOpen,
  setAuthModalOpen,
  setCategoryMenuOpen,
  setAdDetailOpen,
  setPartnerBannerOpen,
  showToast,
  hideToast,
} = uiSlice.actions;

export default uiSlice.reducer;
