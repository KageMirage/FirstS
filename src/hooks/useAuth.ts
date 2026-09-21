import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { 
  loginWithPassword, 
  registerUser, 
  requestOTPThunk, 
  verifyOTPThunk, 
  logout as logoutAction, 
  resetOtpState,
  setUser
} from '../store/slices/authSlice';
import { setAuthModalOpen, showToast } from '../store/slices/uiSlice';
import { UserProfile } from '../types/api';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { 
    user, 
    token, 
    isAuthenticated, 
    isLoading, 
    error, 
    otpSent, 
    otpMethod, 
    pendingPhone 
  } = useAppSelector((state) => state.auth);

  const login = useCallback(async (phone_number: string, password?: string) => {
    try {
      await dispatch(loginWithPassword({ phone_number, password })).unwrap();
      dispatch(setAuthModalOpen(false));
      dispatch(showToast({ message: 'Успешный вход в аккаунт!', type: 'success' }));
      return true;
    } catch (err: any) {
      dispatch(showToast({ message: err || 'Ошибка входа', type: 'error' }));
      return false;
    }
  }, [dispatch]);

  const register = useCallback(async (phone_number: string, password?: string, full_name?: string) => {
    try {
      await dispatch(registerUser({ phone_number, password, full_name })).unwrap();
      dispatch(setAuthModalOpen(false));
      dispatch(showToast({ message: 'Регистрация успешна!', type: 'success' }));
      return true;
    } catch (err: any) {
      dispatch(showToast({ message: err || 'Ошибка регистрации', type: 'error' }));
      return false;
    }
  }, [dispatch]);

  const requestOTP = useCallback(async (phone_number: string, method: 'whatsapp' | 'telegram', type: 'login' | 'register' = 'login') => {
    try {
      await dispatch(requestOTPThunk({ phone_number, method, type })).unwrap();
      dispatch(showToast({ message: `Код подтверждения отправлен в ${method === 'whatsapp' ? 'WhatsApp' : 'Telegram'}!`, type: 'info' }));
      return true;
    } catch (err: any) {
      dispatch(showToast({ message: err || 'Не удалось отправить код', type: 'error' }));
      return false;
    }
  }, [dispatch]);

  const verifyOTP = useCallback(async (phone_number: string, otp: string) => {
    try {
      await dispatch(verifyOTPThunk({ phone_number, otp })).unwrap();
      dispatch(setAuthModalOpen(false));
      dispatch(showToast({ message: 'Авторизация по коду успешна!', type: 'success' }));
      return true;
    } catch (err: any) {
      dispatch(showToast({ message: err || 'Неверный код подтверждения', type: 'error' }));
      return false;
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutAction());
    dispatch(showToast({ message: 'Вы вышли из системы', type: 'info' }));
  }, [dispatch]);

  const updateProfile = useCallback((profile: UserProfile) => {
    dispatch(setUser(profile));
    dispatch(showToast({ message: 'Профиль обновлен', type: 'success' }));
  }, [dispatch]);

  const resetOtp = useCallback(() => {
    dispatch(resetOtpState());
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    otpSent,
    otpMethod,
    pendingPhone,
    login,
    register,
    requestOTP,
    verifyOTP,
    logout,
    updateProfile,
    setUserProfile: updateProfile,
    resetOtp,
  };
};
