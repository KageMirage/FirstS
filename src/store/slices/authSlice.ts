import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '../../types/api';
import { apiService } from '../../api/endpoints';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  otpMethod: 'whatsapp' | 'telegram' | null;
  pendingPhone: string;
}

const DEFAULT_USER: UserProfile = {
  id: 74,
  full_name: 'Umar Ermekbaev',
  phone_number: '+996 555 123 456',
  avatar: undefined,
  email: 'umarerme@gmail.com',
};

const initialState: AuthState = {
  user: DEFAULT_USER,
  token: null,
  isAuthenticated: true, // default demo authenticated state
  isLoading: false,
  error: null,
  otpSent: false,
  otpMethod: null,
  pendingPhone: '',
};

export const loginWithPassword = createAsyncThunk(
  'auth/loginWithPassword',
  async (payload: { phone_number: string; password?: string }, { rejectWithValue }) => {
    try {
      const res = await apiService.login(payload);
      if (res.access || res.token) {
        const token = (res.access || res.token)!;
        localStorage.setItem('adverts_token', token);
      }
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || err.message || 'Ошибка входа');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload: { phone_number: string; password?: string; full_name?: string }, { rejectWithValue }) => {
    try {
      const res = await apiService.register(payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || err.message || 'Ошибка регистрации');
    }
  }
);

export const requestOTPThunk = createAsyncThunk(
  'auth/requestOTP',
  async (payload: { phone_number: string; method: 'whatsapp' | 'telegram'; type: 'login' | 'register' }, { rejectWithValue }) => {
    try {
      const res = await apiService.requestOTP(payload);
      return { ...res, phone_number: payload.phone_number, method: payload.method };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || err.message || 'Не удалось отправить код');
    }
  }
);

export const verifyOTPThunk = createAsyncThunk(
  'auth/verifyOTP',
  async (payload: { phone_number: string; otp: string }, { rejectWithValue }) => {
    try {
      const res = await apiService.verifyOTP(payload);
      if (res.access || res.token) {
        localStorage.setItem('adverts_token', (res.access || res.token)!);
      }
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || err.message || 'Неверный OTP-код');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      localStorage.removeItem('adverts_token');
      localStorage.removeItem('adverts_user');
    },
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      try {
        localStorage.setItem('adverts_user', JSON.stringify(action.payload));
      } catch {}
    },
    hydrateAuth: (state, action: PayloadAction<{ user?: UserProfile | null; token?: string | null }>) => {
      if (action.payload.user) {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      }
      if (action.payload.token) {
        state.token = action.payload.token;
        state.isAuthenticated = true;
      }
    },
    resetOtpState: (state) => {
      state.otpSent = false;
      state.otpMethod = null;
      state.pendingPhone = '';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.access || action.payload.token || null;
        if (action.payload.user) {
          state.user = action.payload.user;
          localStorage.setItem('adverts_user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginWithPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(requestOTPThunk.fulfilled, (state, action) => {
        state.otpSent = true;
        state.otpMethod = action.payload.method;
        state.pendingPhone = action.payload.phone_number;
      })
      .addCase(verifyOTPThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.otpSent = false;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      });
  },
});

export const { logout, setUser, hydrateAuth, resetOtpState } = authSlice.actions;
export default authSlice.reducer;
