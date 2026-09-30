import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '../../types/api';
import { apiService } from '../../api/endpoints';
import {
  findUserByCredentials,
  saveRegisteredUser,
  normalizePhoneNumber,
  generateUniqueUsername,
  DEFAULT_USER_AVATAR,
  RegisteredAccount,
} from '../../utils/authStorage';

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

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  otpSent: false,
  otpMethod: null,
  pendingPhone: '',
};

export const loginWithPassword = createAsyncThunk(
  'auth/loginWithPassword',
  async (payload: { phone_number: string; password?: string }, { rejectWithValue }) => {
    // 1. Check local registered accounts first
    const localUser = findUserByCredentials(payload.phone_number, payload.password);
    if (localUser) {
      const userProfile: UserProfile = {
        id: localUser.id,
        full_name: localUser.full_name,
        phone_number: localUser.phone_number,
        email: localUser.email,
        avatar: localUser.avatar,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('adverts_token', `local-token-${localUser.id}`);
        localStorage.setItem('adverts_user', JSON.stringify(userProfile));
      }
      return { access: `local-token-${localUser.id}`, token: `local-token-${localUser.id}`, user: userProfile };
    }

    // 2. Call backend API endpoint
    try {
      const res: any = await apiService.login(payload);
      const token = res.token_key || res.token || res.access || `token-${Date.now()}`;
      const user: UserProfile = res.user || {
        id: res.id || 74,
        full_name: res.full_name || 'Пользователь',
        phone_number: res.phone_number || payload.phone_number,
        email: res.email,
        avatar: res.avatar,
        whatsapp_number: res.whatsapp_number,
        telegram_number: res.telegram_number,
      };

      if (token && typeof window !== 'undefined') {
        localStorage.setItem('adverts_token', token);
        localStorage.setItem('adverts_user', JSON.stringify(user));
      }
      return { access: token, token, user };
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.detail || 'Неверный номер телефона или пароль';
      return rejectWithValue(msg);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload: { phone_number: string; password?: string; full_name?: string; email?: string }, { rejectWithValue }) => {
    try {
      const generatedName = payload.full_name && payload.full_name !== 'Пользователь' 
        ? payload.full_name 
        : generateUniqueUsername('user');

      // 1. Try upstream registration
      let upstreamToken: string | null = null;
      let upstreamUser: UserProfile | null = null;

      try {
        const res: any = await apiService.register({
          phone_number: payload.phone_number,
          password: payload.password,
          full_name: generatedName,
          email: payload.email,
        });
        upstreamToken = res.token || res.token_key || res.access || null;
        upstreamUser = res.user || {
          id: res.id,
          full_name: res.full_name || generatedName,
          phone_number: res.phone_number || payload.phone_number,
          email: res.email,
          avatar: res.avatar,
        };
      } catch (upstreamErr: any) {
        console.warn('[Register upstream warning]', upstreamErr?.response?.data);
      }

      // 2. Also save to local storage database for instant persistence
      const created = saveRegisteredUser({
        phone_number: payload.phone_number,
        password: payload.password,
        full_name: generatedName,
        email: payload.email,
        avatar: DEFAULT_USER_AVATAR,
      });

      const userProfile: UserProfile = upstreamUser || {
        id: created.id,
        full_name: created.full_name,
        phone_number: created.phone_number,
        email: created.email,
        avatar: created.avatar || DEFAULT_USER_AVATAR,
      };

      const finalToken = upstreamToken || `local-token-${created.id}`;

      if (typeof window !== 'undefined') {
        localStorage.setItem('adverts_token', finalToken);
        localStorage.setItem('adverts_user', JSON.stringify(userProfile));
      }

      return { access: finalToken, token: finalToken, user: userProfile };
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Ошибка регистрации');
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
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        'Не удалось отправить код';
      return rejectWithValue(errorMsg);
    }
  }
);

export const verifyOTPThunk = createAsyncThunk(
  'auth/verifyOTP',
  async (payload: { phone_number: string; otp: string }, { rejectWithValue }) => {
    try {
      const res = await apiService.verifyOTP(payload);
      if (res.access || res.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('adverts_token', (res.access || res.token)!);
        }
      }
      return res;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        'Неверный код подтверждения';
      return rejectWithValue(errorMsg);
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adverts_token');
        localStorage.removeItem('adverts_user');
      }
    },
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('adverts_user', JSON.stringify(action.payload));
        } catch {}
      }
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
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginWithPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || {
          id: 1,
          full_name: 'Пользователь',
          phone_number: action.meta.arg.phone_number,
        };
        state.token = action.payload.access || action.payload.token || 'auth-token';
        state.error = null;
      })
      .addCase(loginWithPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Неправильный логин или пароль';
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || {
          id: Date.now(),
          full_name: action.meta.arg.full_name || 'Пользователь',
          phone_number: action.meta.arg.phone_number,
        };
        state.token = action.payload.access || 'reg-token';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка регистрации';
      })

      // OTP Request
      .addCase(requestOTPThunk.fulfilled, (state, action) => {
        state.otpSent = true;
        state.otpMethod = action.payload.method;
        state.pendingPhone = action.payload.phone_number;
      });
  },
});

export const { logout, setUser, hydrateAuth, resetOtpState } = authSlice.actions;
export default authSlice.reducer;
