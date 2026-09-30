import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdItem, AdsResponse } from '../../types/api';
import { apiService } from '../../api/endpoints';

interface AdsState {
  items: AdItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  selectedAd: AdItem | null;
  searchQuery: string;
  activeCategoryFilter: number | null;
  favoriteIds: number[];
  isLoading: boolean;
  isLoaded: boolean;
  isPosting: boolean;
  error: string | null;
}

const initialState: AdsState = {
  items: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  selectedAd: null,
  searchQuery: '',
  activeCategoryFilter: null,
  favoriteIds: [],
  isLoading: false,
  isLoaded: false,
  isPosting: false,
  error: null,
};

export const fetchAds = createAsyncThunk(
  'ads/fetchAds',
  async (
    params: { page?: number; category?: number | string; parent_category?: number | string; search?: string; region?: number | string; user?: number | string; force?: boolean } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const res = await apiService.getAds(params);
      return res;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Ошибка загрузки объявлений';
      return rejectWithValue(errorMsg);
    }
  },
  {
    condition: (params, { getState }) => {
      const state = (getState() as any).ads as AdsState;
      if (state.isLoading) {
        return false; // Skip if already loading
      }
      // If already loaded and default list is requested without force, skip
      if (!params?.force && (!params || Object.keys(params).length === 0) && state.isLoaded) {
        return false;
      }
      return true;
    },
  }
);

export const createNewAd = createAsyncThunk(
  'ads/createNewAd',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await apiService.createAd(formData);
      return res;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Ошибка публикации объявления';
      return rejectWithValue(errorMsg);
    }
  }
);

export const toggleAdFavorite = createAsyncThunk(
  'ads/toggleFavorite',
  async (adId: number) => {
    try {
      await apiService.toggleFavorite(adId);
    } catch {
      // Optimistic handling
    }
    return adId;
  }
);

export const adsSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSelectedAd: (state, action: PayloadAction<AdItem | null>) => {
      state.selectedAd = action.payload;
      if (typeof window !== 'undefined') {
        try {
          if (action.payload) {
            sessionStorage.setItem('adverts_selected_ad', JSON.stringify(action.payload));
            localStorage.setItem('adverts_last_selected_ad', JSON.stringify(action.payload));
          } else {
            sessionStorage.removeItem('adverts_selected_ad');
          }
        } catch {}
      }
    },
    setCategoryFilter: (state, action: PayloadAction<number | null>) => {
      state.activeCategoryFilter = action.payload;
      state.currentPage = 1;
    },
    toggleLocalFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.favoriteIds.includes(id)) {
        state.favoriteIds = state.favoriteIds.filter((favId) => favId !== id);
      } else {
        state.favoriteIds.push(id);
      }
      try {
        localStorage.setItem('adverts_favorites', JSON.stringify(state.favoriteIds));
      } catch {}
    },
    setFavoriteIds: (state, action: PayloadAction<number[]>) => {
      state.favoriteIds = action.payload;
    },
    addLocalAd: (state, action: PayloadAction<AdItem>) => {
      // Prevent duplicates
      state.items = [action.payload, ...state.items.filter((item) => item.id !== action.payload.id)];
      state.totalCount = state.items.length;
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('adverts_local_ads');
          const saved: AdItem[] = raw ? JSON.parse(raw) : [];
          const updated = [action.payload, ...saved.filter((item) => item.id !== action.payload.id)].slice(0, 50);
          localStorage.setItem('adverts_local_ads', JSON.stringify(updated));
        } catch {}
      }
    },
    removeLocalAd: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((ad) => ad.id !== action.payload);
      state.totalCount = Math.max(0, state.totalCount - 1);
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('adverts_local_ads');
          if (raw) {
            const saved: AdItem[] = JSON.parse(raw);
            localStorage.setItem('adverts_local_ads', JSON.stringify(saved.filter((item) => item.id !== action.payload)));
          }
        } catch {}
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoaded = true;
        state.error = null;

        // Extract array from results or payload directly
        const rawResults = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.results || [];

        const apiAds: AdItem[] = rawResults.map((item: any) => ({
          ...item,
          subCategoryTitle: item.category?.name || item.parent_category?.name || 'Объявление',
          formattedDate: item.added_date ? `Дата: ${item.added_date}` : `${item.price || 0} сом`,
        }));

        let localAds: AdItem[] = [];
        if (typeof window !== 'undefined') {
          try {
            const raw = localStorage.getItem('adverts_local_ads');
            if (raw) localAds = JSON.parse(raw);
          } catch {}
        }

        const combined = [...localAds];
        apiAds.forEach((ad) => {
          if (!combined.some((item) => item.id === ad.id)) {
            combined.push(ad);
          }
        });

        state.items = combined;
        state.totalCount =
          typeof action.payload?.count === 'number'
            ? action.payload.count
            : apiAds.length;
        state.totalPages =
          typeof action.payload?.total_pages === 'number'
            ? action.payload.total_pages
            : Math.max(1, Math.ceil(state.totalCount / 20));
        state.currentPage = action.payload?.current_page || 1;
      })
      .addCase(fetchAds.rejected, (state, action) => {
        state.isLoading = false;
        let localAds: AdItem[] = [];
        if (typeof window !== 'undefined') {
          try {
            const raw = localStorage.getItem('adverts_local_ads');
            if (raw) localAds = JSON.parse(raw);
          } catch {}
        }
        if (state.items.length === 0 && localAds.length > 0) {
          state.items = localAds;
          state.totalCount = localAds.length;
          state.totalPages = Math.max(1, Math.ceil(localAds.length / 20));
        }
        state.error = (action.payload as string) || 'Не удалось загрузить объявления с сервера';
      })
      .addCase(createNewAd.pending, (state) => {
        state.isPosting = true;
      })
      .addCase(createNewAd.fulfilled, (state, action) => {
        state.isPosting = false;
        if (action.payload && action.payload.id) {
          const idx = state.items.findIndex((item) => item.id === action.payload.id);
          if (idx >= 0) {
            state.items[idx] = action.payload;
          } else {
            state.items.unshift(action.payload);
            state.totalCount += 1;
          }
        }
      })
      .addCase(createNewAd.rejected, (state) => {
        state.isPosting = false;
      })
      .addCase(toggleAdFavorite.fulfilled, (state, action) => {
        const id = action.payload;
        if (state.favoriteIds.includes(id)) {
          state.favoriteIds = state.favoriteIds.filter((favId) => favId !== id);
        } else {
          state.favoriteIds.push(id);
        }
        try {
          localStorage.setItem('adverts_favorites', JSON.stringify(state.favoriteIds));
        } catch {}
      })
      .addCase('auth/logout', (state) => {
        state.favoriteIds = [];
        try {
          localStorage.removeItem('adverts_favorites');
        } catch {}
      });
  },
});

export const {
  setSearchQuery,
  setCurrentPage,
  setSelectedAd,
  setCategoryFilter,
  toggleLocalFavorite,
  setFavoriteIds,
  addLocalAd,
  removeLocalAd,
} = adsSlice.actions;

export default adsSlice.reducer;
