import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category, ChildCategory } from '../../types/api';
import { apiService } from '../../api/endpoints';

export interface FeaturedCategoryCard {
  id: string;
  name: string;
  count: number;
  image: string;
  icon?: string;
  slug: string;
  color?: string;
  order?: number;
}

export interface TopCategoryPill {
  id: string;
  name: string;
  icon?: string;
  image?: string;
  count?: number;
  color?: string;
}

interface CategoriesState {
  categories: Category[];
  childCategories: ChildCategory[];
  featuredCategories: FeaturedCategoryCard[];
  topPills: TopCategoryPill[];
  activePillId: string;
  selectedCategory: Category | null;
  isLoading: boolean;
  isCategoriesLoaded: boolean;
  isChildLoading: boolean;
  isChildCategoriesLoaded: boolean;
  error: string | null;
}

const initialPills: TopCategoryPill[] = [
  { id: 'popular', name: 'Все', icon: 'Star' },
];

const initialState: CategoriesState = {
  categories: [],
  childCategories: [],
  featuredCategories: [],
  topPills: initialPills,
  activePillId: 'popular',
  selectedCategory: null,
  isLoading: false,
  isCategoriesLoaded: false,
  isChildLoading: false,
  isChildCategoriesLoaded: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiService.getCategories();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки категорий');
    }
  },
  {
    condition: (_, { getState }) => {
      const state = (getState() as any).categories as CategoriesState;
      // Skip if already loading or already successfully loaded
      if (state.isLoading || state.isCategoriesLoaded) {
        return false;
      }
      return true;
    },
  }
);

export const fetchChildCategories = createAsyncThunk(
  'categories/fetchChildCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiService.getChildCategories();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки подкатегорий');
    }
  },
  {
    condition: (_, { getState }) => {
      const state = (getState() as any).categories as CategoriesState;
      // Skip if already loading or already successfully loaded
      if (state.isChildLoading || state.isChildCategoriesLoaded) {
        return false;
      }
      return true;
    },
  }
);

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setActivePill: (state, action: PayloadAction<string>) => {
      state.activePillId = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCategoriesLoaded = true;
        state.categories = action.payload;
        
        // Dynamically build featured category cards with exact backend names, images, and real num_of_ads
        state.featuredCategories = action.payload.map((cat) => ({
          id: String(cat.id),
          name: cat.name,
          count: typeof cat.num_of_ads === 'number' ? cat.num_of_ads : 0,
          image: cat.image || '',
          icon: cat.icon || '',
          slug: String(cat.id),
          color: cat.color || '#713ae0',
          order: cat.order || 0,
        }));

        // Dynamically build top category pills with backend data
        const totalAds = action.payload.reduce((acc, c) => acc + (c.num_of_ads || 0), 0);
        state.topPills = [
          { id: 'popular', name: 'Все', icon: 'Star', count: totalAds },
          ...action.payload.map((cat) => ({
            id: String(cat.id),
            name: cat.name,
            icon: cat.icon || cat.image || '',
            image: cat.image || '',
            count: typeof cat.num_of_ads === 'number' ? cat.num_of_ads : 0,
            color: cat.color || '#713ae0',
          })),
        ];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchChildCategories.pending, (state) => {
        state.isChildLoading = true;
      })
      .addCase(fetchChildCategories.fulfilled, (state, action) => {
        state.isChildLoading = false;
        state.isChildCategoriesLoaded = true;
        state.childCategories = action.payload;
      })
      .addCase(fetchChildCategories.rejected, (state) => {
        state.isChildLoading = false;
      });
  },
});

export const { setActivePill, setSelectedCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
