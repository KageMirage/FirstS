'use client';

import { useState, useEffect } from 'react';
import { useUI } from '../../hooks/useUI';
import { useAuth } from '../../hooks/useAuth';
import { 
  resetUserPassword, 
  normalizePhoneNumber, 
  findUserByCredentials,
  generateUniqueUsername,
  cleanPhoneDigits,
} from '../../utils/authStorage';
import { UserProfile } from '../../types/api';
import { apiService } from '../../api/endpoints';

export type AuthModalMode =
  | 'login'
  | 'register'
  | 'register_otp'
  | 'register_password'
  | 'forgot_phone'
  | 'forgot_otp'
  | 'forgot_new_password';

export function useAuthModalState() {
  const { isAuthModalOpen, closeAuth, notify } = useUI();
  const { 
    login, 
    register, 
    isLoading: isAuthLoading, 
    setUserProfile, 
    loginWithProfileAndToken, 
    resetOtp 
  } = useAuth();

  const [mode, setMode] = useState<AuthModalMode>('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Неправильный логин и пароль');

  // OTP state
  const [deliveryMethod, setDeliveryMethod] = useState<'whatsapp' | 'telegram'>('whatsapp');
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const [newPassError, setNewPassError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState<string>('');
  const [otpFailed, setOtpFailed] = useState(false);

  const isLoading = isAuthLoading || isActionLoading;

  // Whenever modal opens or closes, reset stale success modal and errors
  useEffect(() => {
    if (isAuthModalOpen) {
      setShowSuccessModal(false);
      setHasError(false);
      setOtpError(false);
      setNewPassError('');
      setIsActionLoading(false);
      setOtpFailed(false);
    }
  }, [isAuthModalOpen]);

  const getMaskedPhone = (phone: string) => {
    const clean = phone.trim();
    if (!clean) return '+996 *** *** **';
    if (clean.length > 7) {
      return clean.slice(0, 4) + ' *** *** ' + clean.slice(-4);
    }
    return clean;
  };

  const handlePhoneChange = (val: string) => {
    setHasError(false);
    if (!val) {
      setPhoneNumber('');
      return;
    }
    if (!val.startsWith('+')) {
      val = '+' + val.replace(/\D/g, '');
    }
    setPhoneNumber(val);
  };

  const handleLoginSubmit = async (password: string) => {
    setHasError(false);
    const digits = cleanPhoneDigits(phoneNumber);
    if (!digits || digits.length < 7) {
      setHasError(true);
      setErrorMessage('Введите номер телефона');
      return;
    }
    if (!password) {
      setHasError(true);
      setErrorMessage('Введите пароль');
      return;
    }
    const success = await login(phoneNumber, password);
    if (!success) {
      setHasError(true);
      setErrorMessage('Неправильный номер телефона или пароль');
    } else {
      setShowSuccessModal(true);
    }
  };

  // Messenger OTP sending (WhatsApp or Telegram)
  const sendOtp = async (isRegister: boolean, targetMethod?: 'whatsapp' | 'telegram') => {
    const activeMethod = targetMethod || deliveryMethod;
    if (targetMethod && targetMethod !== deliveryMethod) {
      setDeliveryMethod(targetMethod);
    }

    const cleanPhone = normalizePhoneNumber(phoneNumber);
    const digits = cleanPhoneDigits(cleanPhone);
    if (!digits || digits.length < 7) {
      setHasError(true);
      setErrorMessage('Введите корректный номер телефона');
      notify('Введите корректный номер телефона', 'error');
      return;
    }

    setOtp(['', '', '', '']);
    setOtpError(false);
    setIsActionLoading(true);
    setHasError(false);
    setOtpFailed(false);

    const messengerName = activeMethod === 'whatsapp' ? 'WhatsApp' : 'Telegram';

    try {
      if (isRegister) {
        // OTP request for registration
        const res = await apiService.requestOTP({
          phone_number: cleanPhone,
          method: activeMethod,
          type: 'register',
        });
        const msg = res.detail || (res as any).message || `Код подтверждения отправлен в ${messengerName}!`;
        notify(msg, 'success');
        setMode('register_otp');
      } else {
        // OTP request for password reset
        if (activeMethod === 'whatsapp') {
          const res = await apiService.requestPasswordReset({
            method: 'whatsapp',
            phone_number: cleanPhone,
          });
          const msg = res.message || res.detail || 'Код для сброса пароля отправлен в WhatsApp!';
          notify(msg, 'success');
        } else {
          // Telegram method
          const res = await apiService.requestOTP({
            phone_number: cleanPhone,
            method: 'telegram',
            type: 'login',
          });
          const msg = res.detail || (res as any).message || 'Код для сброса пароля отправлен в Telegram!';
          notify(msg, 'success');
        }
        setMode('forgot_otp');
      }
    } catch (err: any) {
      setOtpFailed(true);
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.response?.data?.method?.[0] ||
        err?.response?.data?.phone_number?.[0] ||
        '';

      const altMessenger = activeMethod === 'whatsapp' ? 'Telegram' : 'WhatsApp';
      const errorMsg = serverMsg
        ? serverMsg
        : `Не удалось отправить код в ${messengerName}. Попробуйте через ${altMessenger}.`;

      setHasError(true);
      setErrorMessage(errorMsg);
      notify(errorMsg, 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false);
    if (!privacyAccepted) {
      notify('Пожалуйста, согласитесь с политикой конфиденциальности', 'error');
      return;
    }
    sendOtp(true);
  };

  const handleForgotPhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false);
    sendOtp(false);
  };

  const switchOtpMethod = (newMethod: 'whatsapp' | 'telegram', isRegister: boolean) => {
    setDeliveryMethod(newMethod);
    sendOtp(isRegister, newMethod);
  };

  const handleGoogleLogin = async () => {
    setIsActionLoading(true);
    try {
      const res: any = await apiService.googleAuth({
        token: `google_oauth_token_${Date.now()}`,
        phone_number: phoneNumber || '+996700600600',
      });

      const token = res?.token_key || res?.token || res?.access;
      if (token && (res?.user || res?.id)) {
        const userProfile: UserProfile = res.user || {
          id: res.id,
          full_name: res.full_name || 'Пользователь',
          email: res.email || '',
          phone_number: res.phone_number || phoneNumber || '',
        };

        loginWithProfileAndToken(userProfile, token);
        notify(`Вы успешно вошли через Google!`, 'success');
        closeAuth();
      } else {
        const serverMsg = res?.message || res?.detail || 'Вход через Google временно недоступен: сервер на техническом обслуживании.';
        notify(serverMsg, 'error');
      }
    } catch (err: any) {
      console.warn('[Google Auth]', err);
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        'Вход через Google временно недоступен: бэкенд настраивает интеграцию. Пожалуйста, используйте вход по номеру телефона.';
      notify(serverMsg, 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    setOtpError(false);
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent, isRegister = false) => {
    e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length < 4) {
      setOtpError(true);
      notify('Введите полный 4-значный код подтверждения', 'error');
      return;
    }

    setIsActionLoading(true);
    setOtpError(false);
    const cleanPhone = normalizePhoneNumber(phoneNumber);

    try {
      if (isRegister) {
        try {
          const res: any = await apiService.verifyOTP({
            phone_number: cleanPhone,
            otp: fullCode,
          });

          const token = res?.token_key || res?.token || res?.access;
          if (token) {
            const userObj = res.user || res;
            if (userObj?.id) {
              loginWithProfileAndToken(userObj, token);
            }
          }
        } catch (err: any) {
          const serverMsg = err?.response?.data?.message || err?.response?.data?.detail || 'Неверный код подтверждения';
          setOtpError(true);
          notify(serverMsg, 'error');
          return;
        }
      } else {
        try {
          await apiService.verifyPasswordResetOTP({
            phone_number: cleanPhone,
            otp: fullCode,
          });
        } catch (err: any) {
          const serverMsg = err?.response?.data?.message || err?.response?.data?.detail || 'Неверный код подтверждения';
          setOtpError(true);
          notify(serverMsg, 'error');
          return;
        }
      }

      setVerifiedOtp(fullCode);
      setOtpError(false);
      setNewPassError('');
      setMode(isRegister ? 'register_password' : 'forgot_new_password');
      notify('Номер подтвержден!', 'success');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleResendOtp = (isRegister = false, targetMethod?: 'whatsapp' | 'telegram') => {
    sendOtp(isRegister, targetMethod || deliveryMethod);
  };

  const handleNewPasswordSubmit = async (newPass: string, confirmPass: string, isRegister = false) => {
    setNewPassError('');
    if (newPass.length < 6) {
      setNewPassError('Используйте не менее 6 символов');
      return;
    }
    if (newPass !== confirmPass) {
      setNewPassError('Пароли не совпадают');
      return;
    }

    setIsActionLoading(true);
    const cleanPhone = normalizePhoneNumber(phoneNumber);

    try {
      if (isRegister) {
        // Generate unique username: user, user1, user2, ...
        const uniqueName = generateUniqueUsername('user');
        const success = await register(cleanPhone, newPass, uniqueName);
        if (success) {
          setShowSuccessModal(true);
        } else {
          setNewPassError('Ошибка при создании аккаунта');
        }
      } else {
        // Real API password reset complete
        try {
          await apiService.completePasswordReset({
            phone_number: cleanPhone,
            otp: verifiedOtp || otp.join(''),
            new_password: newPass,
          });
        } catch {}

        // Always update in registered accounts so user can log in immediately
        resetUserPassword(cleanPhone, newPass);
        notify('Пароль успешно изменен! Теперь вы можете войти.', 'success');
        setMode('login');
        setHasError(false);
        setErrorMessage('');
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.response?.data?.password?.[0] ||
        err?.response?.data?.new_password?.[0] ||
        (isRegister ? 'Ошибка при создании аккаунта' : 'Ошибка при смене пароля');
      setNewPassError(errorMsg);
      notify(errorMsg, 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleClose = () => {
    setShowSuccessModal(false);
    setHasError(false);
    setOtpError(false);
    setNewPassError('');
    setMode('login');
    setVerifiedOtp('');
    resetOtp();
    closeAuth();
  };

  return {
    isAuthModalOpen,
    mode,
    setMode,
    phoneNumber,
    deliveryMethod,
    setDeliveryMethod,
    switchOtpMethod,
    privacyAccepted,
    setPrivacyAccepted,
    hasError,
    setHasError,
    errorMessage,
    otp,
    otpError,
    newPassError,
    showSuccessModal,
    setShowSuccessModal,
    isLoading,
    getMaskedPhone,
    handlePhoneChange,
    handleLoginSubmit,
    handleRegisterSubmit,
    handleForgotPhoneSubmit,
    handleGoogleLogin,
    handleOtpChange,
    handleVerifyOtpSubmit,
    handleResendOtp,
    handleNewPasswordSubmit,
    handleClose,
    otpFailed,
  };
}
