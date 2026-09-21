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
  isPosting: false,
  error: null,
};

export const fetchAds = createAsyncThunk(
  'ads/fetchAds',
  async (
    params: { page?: number; category?: number | string; parent_category?: number | string; search?: string } | undefined,
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
      state.items.unshift(action.payload);
      state.totalCount += 1;
    },
    removeLocalAd: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((ad) => ad.id !== action.payload);
      state.totalCount = Math.max(0, state.totalCount - 1);
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
        state.error = null;

        // Extract array from results or payload directly
        const rawResults = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.results || [];

        const apiAds: AdItem[] = rawResults.map((item: any) => ({
          ...item,
          subCategoryTitle: item.category?.name || item.parent_category?.name || 'Объявление',
          formattedDate: item.added_date ? `Дата: ${item.added_date}` : `${item.price || 0} Руб`,
        }));

        state.items = apiAds;
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
        state.items = [];
        state.totalCount = 0;
        state.totalPages = 1;
        state.error = (action.payload as string) || 'Не удалось загрузить объявления с сервера';
      })
      .addCase(createNewAd.pending, (state) => {
        state.isPosting = true;
      })
      .addCase(createNewAd.fulfilled, (state, action) => {
        state.isPosting = false;
        state.items.unshift(action.payload);
        state.totalCount += 1;
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
