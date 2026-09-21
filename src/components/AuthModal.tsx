'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, X, Check } from 'lucide-react';
import { useUI } from '../hooks/useUI';
import { useAuth } from '../hooks/useAuth';
import { SuccessLoginModal } from './SuccessLoginModal';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

type AuthModalMode = 
  | 'login'
  | 'register'
  | 'register_messenger'
  | 'register_otp'
  | 'register_password'
  | 'forgot_phone'
  | 'forgot_messenger'
  | 'forgot_otp'
  | 'forgot_new_password';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuth, notify } = useUI();
  const { 
    login, 
    register, 
    isLoading, 
    setUserProfile,
    resetOtp 
  } = useAuth();

  // Mode management matching Figma flows exactly
  const [mode, setMode] = useState<AuthModalMode>('login');
  
  // Login & Register Form fields
  const [phoneNumber, setPhoneNumber] = useState('+996 700 600 600');
  const [password, setPassword] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Неправильный логин и пароль');

  // OTP fields
  const [otp, setOtp] = useState<string[]>(['1', '2', '3', '3']);
  const [otpError, setOtpError] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassError, setNewPassError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (mode === 'forgot_otp' || mode === 'register_otp') {
      otpInputRefs.current[0]?.focus();
    }
  }, [mode]);

  if (!isAuthModalOpen) return null;

  // Masked phone format for OTP subtitle (e.g. "+996 *** *** 60 00" or "+7 *** *** 00 00")
  const getMaskedPhone = (phone: string) => {
    const clean = phone.trim();
    if (!clean) return '+7 *** *** 00 00';
    if (clean.startsWith('+996')) {
      return '+996 *** *** ' + clean.slice(-4, -2) + ' ' + clean.slice(-2);
    }
    if (clean.startsWith('+7')) {
      return '+7 *** *** 00 00';
    }
    return clean.slice(0, 4) + ' *** *** ' + clean.slice(-4);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    setHasError(false);
    if (!val.startsWith('+')) {
      val = '+' + val.replace(/\D/g, '');
    }
    setPhoneNumber(val);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setHasError(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false);

    if (!phoneNumber.trim()) {
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
      setErrorMessage('Неправильный логин и пароль');
    } else {
      setShowSuccessModal(true);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false);

    if (!phoneNumber.trim()) {
      setHasError(true);
      setErrorMessage('Введите номер телефона');
      return;
    }

    if (!privacyAccepted) {
      notify('Пожалуйста, согласитесь с политикой конфиденциальности', 'error');
      return;
    }

    // Step 2: Messenger Confirmation
    setMode('register_messenger');
  };

  const handleGoogleLogin = () => {
    setUserProfile({
      id: Date.now(),
      full_name: 'Пользователь Google',
      email: 'user@gmail.com',
      phone_number: phoneNumber || '+996 700 600 600',
      avatar: undefined,
    });
    notify('Вы успешно вошли через Google!', 'success');
    closeAuth();
  };

  const handleForgotPasswordStart = () => {
    setHasError(false);
    setMode('forgot_phone');
  };

  const handleGetCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setHasError(true);
      return;
    }
    setMode('forgot_messenger');
  };

  const handleSelectWhatsApp = (isRegister = false) => {
    setOtp(['1', '2', '3', '3']);
    setOtpError(false);
    if (isRegister) {
      setMode('register_otp');
    } else {
      setMode('forgot_otp');
    }
    notify(`Код подтверждения отправлен в WhatsApp на номер ${phoneNumber}`, 'info');
  };

  // OTP single-digit handlers
  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = clean;
    setOtp(newOtp);
    setOtpError(false);

    if (clean && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent, isRegister = false) => {
    e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length < 4) {
      setOtpError(true);
      return;
    }

    if (fullCode === '0000') {
      setOtpError(true);
      notify('Неверный код подтверждения', 'error');
      return;
    }

    setOtpError(false);
    setNewPassword('');
    setConfirmNewPassword('');
    setNewPassError('');
    if (isRegister) {
      setMode('register_password');
    } else {
      setMode('forgot_new_password');
    }
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '']);
    setOtpError(false);
    otpInputRefs.current[0]?.focus();
    notify(`Новый 4-значный код отправлен на ${phoneNumber}`, 'info');
  };

  const handleNewPasswordSubmit = async (e: React.FormEvent, isRegister = false) => {
    e.preventDefault();
    setNewPassError('');

    if (newPassword.length < 8) {
      setNewPassError('Используйте не менее 8 символов');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setNewPassError('Пароли не совпадают');
      return;
    }

    if (isRegister) {
      const success = await register(phoneNumber, newPassword, 'Пользователь');
      if (success) {
        setShowSuccessModal(true);
      } else {
        setNewPassError('Ошибка при регистрации аккаунта');
      }
    } else {
      notify('Пароль успешно изменен! Теперь вы можете войти.', 'success');
      setPassword(newPassword);
      setMode('login');
    }
  };

  const handleClose = () => {
    setShowSuccessModal(false);
    setHasError(false);
    setOtpError(false);
    setNewPassError('');
    setMode('login');
    resetOtp();
    closeAuth();
  };

  if (showSuccessModal) {
    return (
      <SuccessLoginModal
        isOpen={true}
        onClose={handleClose}
        onConfirm={handleClose}
      />
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200" 
      id="modal-auth"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-t-[32px] sm:rounded-[28px] max-w-[460px] w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative flex flex-col transition-all max-h-[90vh] overflow-y-auto">
        
        {/* Handle for mobile bottom sheet */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden shrink-0" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100/80 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          title="Закрыть"
          id="btn-close-auth"
        >
          <X className="w-4 h-4" />
        </button>

        {/* =========================================================
           1. LOGIN FORM (Вход)
           ========================================================= */}
        {mode === 'login' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-[24px] sm:text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
                Добро пожаловать
              </h2>
              <p className="text-sm text-gray-500 mt-1.5 font-normal">
                Введите данные для входа в аккаунт
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4" id="form-login">
              <div>
                <input
                  id="input-phone-number"
                  type="tel"
                  placeholder="Номер телефона"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className={`w-full px-4 py-3.5 bg-white text-base text-gray-900 placeholder:text-gray-400 rounded-2xl border transition-all outline-none ${
                    hasError 
                      ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/20' 
                      : 'border-gray-200 focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10'
                  }`}
                />
              </div>

              <div>
                <div className="relative flex items-center">
                  <input
                    id="input-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Пароль"
                    value={password}
                    onChange={handlePasswordChange}
                    className={`w-full pl-4 pr-12 py-3.5 bg-white text-base text-gray-900 placeholder:text-gray-400 rounded-2xl border transition-all outline-none ${
                      hasError 
                        ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/20' 
                        : 'border-gray-200 focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    id="btn-toggle-password-visibility"
                    title={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5 text-gray-400" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {hasError ? (
                  <div className="flex items-center justify-between mt-2.5 px-1 text-xs sm:text-sm">
                    <span className="text-red-500 font-normal animate-in fade-in">
                      {errorMessage}
                    </span>
                    <button
                      type="button"
                      id="btn-forgot-password-link"
                      onClick={handleForgotPasswordStart}
                      className="text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      Забыли пароль?
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-end mt-1.5 px-1">
                    <button
                      type="button"
                      id="btn-forgot-password-link"
                      onClick={handleForgotPasswordStart}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      Забыли пароль?
                    </button>
                  </div>
                )}
              </div>

              <button
                id="btn-submit-login"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#1976D2] hover:bg-[#1565C0] text-white font-semibold text-base rounded-2xl shadow-sm hover:shadow transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Войти'
                )}
              </button>

              <div className="flex items-center justify-between pt-1 px-1 text-sm">
                <span className="text-gray-500">
                  У вас еще нет аккаунта
                </span>
                <button
                  type="button"
                  id="btn-switch-to-register"
                  onClick={() => {
                    setHasError(false);
                    setMode('register');
                  }}
                  className="font-medium text-[#1976D2] hover:text-[#1565C0] transition-colors cursor-pointer"
                >
                  Создать аккаунт
                </button>
              </div>

              <div className="relative py-2.5 flex items-center justify-center">
                <div className="w-full border-t border-gray-200" />
                <span className="absolute bg-white px-3 text-xs uppercase tracking-wider text-gray-400 font-medium">
                  или
                </span>
              </div>

              <button
                type="button"
                id="btn-google-login"
                onClick={handleGoogleLogin}
                className="w-full py-3.5 px-4 bg-gray-50/80 hover:bg-gray-100 text-gray-800 font-medium text-sm sm:text-base rounded-2xl border border-gray-200/80 shadow-2xs hover:border-gray-300 transition-all flex items-center justify-center gap-3 active:scale-[0.99] cursor-pointer"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Войти с Google</span>
              </button>
            </form>
          </div>
        )}

        {/* =========================================================
           2. REGISTER FORM 1 (Добро пожаловать - Регистрация)
           ========================================================= */}
        {mode === 'register' && (
          <div className="animate-in fade-in duration-150">
            <div className="text-center mb-6">
              <h2 className="text-[24px] sm:text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
                Добро пожаловать
              </h2>
              <p className="text-sm text-gray-500 mt-1.5 font-normal">
                Введите данные для входа в аккаунт
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4" id="form-register">
              <div>
                <input
                  id="input-register-phone"
                  type="tel"
                  placeholder="Номер телефона"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className={`w-full px-4 py-3.5 bg-white text-base text-gray-900 placeholder:text-gray-400 rounded-2xl border transition-all outline-none ${
                    hasError && !phoneNumber.trim()
                      ? 'border-red-500 ring-1 ring-red-500/20'
                      : 'border-gray-200 focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10'
                  }`}
                />
              </div>

              {/* Privacy Policy Checkbox */}
              <div className="flex items-center gap-2.5 px-1 py-1">
                <button
                  type="button"
                  onClick={() => setPrivacyAccepted(!privacyAccepted)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                    privacyAccepted 
                      ? 'bg-[#1976D2] border-[#1976D2] text-white' 
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                  id="checkbox-privacy"
                >
                  {privacyAccepted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <span 
                  onClick={() => setPrivacyAccepted(!privacyAccepted)}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer select-none"
                >
                  Политика конфиденциальности
                </span>
              </div>

              <button
                id="btn-submit-register"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#1976D2] hover:bg-[#1565C0] text-white font-semibold text-base rounded-2xl shadow-sm hover:shadow transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Зарегистрироваться'
                )}
              </button>

              <div className="flex items-center justify-between pt-1 px-1 text-sm">
                <span className="text-gray-500">
                  Уже есть аккаунт
                </span>
                <button
                  type="button"
                  id="btn-switch-to-login"
                  onClick={() => {
                    setHasError(false);
                    setMode('login');
                  }}
                  className="font-medium text-[#1976D2] hover:text-[#1565C0] transition-colors cursor-pointer"
                >
                  Войти
                </button>
              </div>

              <div className="relative py-2.5 flex items-center justify-center">
                <div className="w-full border-t border-gray-200" />
                <span className="absolute bg-white px-3 text-xs uppercase tracking-wider text-gray-400 font-medium">
                  или
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3.5 px-4 bg-gray-50/80 hover:bg-gray-100 text-gray-800 font-medium text-sm sm:text-base rounded-2xl border border-gray-200/80 shadow-2xs hover:border-gray-300 transition-all flex items-center justify-center gap-3 active:scale-[0.99] cursor-pointer"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Войти с Google</span>
              </button>
            </form>
          </div>
        )}

        {/* =========================================================
           2b. REGISTER STEP 2 (Подтвердите номер - WhatsApp)
           ========================================================= */}
        {mode === 'register_messenger' && (
          <div className="animate-in fade-in duration-150">
            <div className="text-center mb-6">
              <h2 className="text-[24px] sm:text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
                Подтвердите номер
              </h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Код отправится на выбранный мессенджер
              </p>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                id="btn-whatsapp-register"
                onClick={() => handleSelectWhatsApp(true)}
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-base rounded-2xl shadow-sm hover:shadow transition-all active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
                <span>WhatsApp</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  Изменить номер телефона
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
           2c. REGISTER STEP 3-5 (Введите код OTP)
           ========================================================= */}
        {mode === 'register_otp' && (
          <div className="animate-in fade-in duration-150">
            <div className="text-center mb-6">
              <h2 className="text-[24px] sm:text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
                Введите код
              </h2>
              <p className="text-sm text-gray-500 mt-2 max-w-[340px] mx-auto leading-relaxed">
                Мы отправили СМС с 4-значным кодом на номер {getMaskedPhone(phoneNumber)}.
              </p>
            </div>

            <form onSubmit={(e) => handleVerifyOtpSubmit(e, true)} className="space-y-6" id="form-register-verify-otp">
              {/* 4 Square Inputs */}
              <div className="flex items-center justify-center gap-3">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpInputRefs.current[index] = el;
                    }}
                    id={`input-register-otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[index] || ''}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-bold rounded-2xl border transition-all outline-none bg-white ${
                      otpError
                        ? 'border-red-500 text-red-600 ring-1 ring-red-500/20'
                        : otp[index]
                        ? 'border-[#1976D2] text-gray-900 ring-1 ring-[#1976D2]/20'
                        : 'border-gray-200 text-gray-900 focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10'
                    }`}
                  />
                ))}
              </div>

              {/* Confirm Button */}
              <button
                id="btn-register-submit-otp"
                type="submit"
                className={`w-full py-3.5 font-semibold text-base rounded-2xl transition-all active:scale-[0.99] flex items-center justify-center cursor-pointer ${
                  otpError
                    ? 'border-2 border-red-500 text-red-500 bg-white hover:bg-red-50'
                    : 'bg-[#1976D2] hover:bg-[#1565C0] text-white shadow-sm hover:shadow'
                }`}
              >
                Подтвердить
              </button>

              {/* Resend Code Button */}
              <button
                type="button"
                id="btn-register-resend-otp"
                onClick={handleResendOtp}
                className="w-full py-3.5 bg-gray-50/80 hover:bg-gray-100 text-gray-800 font-medium text-base rounded-2xl border border-gray-100 transition-all active:scale-[0.99] flex items-center justify-center cursor-pointer"
              >
                Повторно отправить код
              </button>
            </form>
          </div>
        )}

        {/* =========================================================
           2d. REGISTER STEP 6-7 (Придумайте новый пароль)
           ========================================================= */}
        {mode === 'register_password' && (
          <div className="animate-in fade-in duration-150">
            <div className="text-center mb-6">
              <h2 className="text-[24px] sm:text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
                Придумайте новый пароль
              </h2>
              <p className="text-sm text-gray-500 mt-2 max-w-[340px] mx-auto leading-relaxed">
                Используйте не менее 8 символов, включая цифры и латинские буквы.
              </p>
            </div>

            <form onSubmit={(e) => handleNewPasswordSubmit(e, true)} className="space-y-4" id="form-register-new-password">
              <div>
                <div className="relative flex items-center">
                  <input
                    id="input-register-new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Новый пароль"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setNewPassError('');
                    }}
                    className={`w-full pl-4 pr-12 py-3.5 bg-white text-base text-gray-900 placeholder:text-gray-400 rounded-2xl border transition-all outline-none ${
                      newPassError 
                        ? 'border-red-500 ring-1 ring-red-500/20' 
                        : 'border-gray-200 focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    id="btn-toggle-register-new-password"
                  >
                    {showNewPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <div className="relative flex items-center">
                  <input
                    id="input-register-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Поменять пароль"
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                      setNewPassError('');
                    }}
                    className={`w-full pl-4 pr-12 py-3.5 bg-white text-base text-gray-900 placeholder:text-gray-400 rounded-2xl border transition-all outline-none ${
                      newPassError 
                        ? 'border-red-500 ring-1 ring-red-500/20' 
                        : 'border-gray-200 focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    id="btn-toggle-register-confirm-password"
                  >
                    {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
                {newPassError && (
                  <p className="text-red-500 text-xs mt-1.5 px-1 font-medium animate-in fade-in">
                    {newPassError}
                  </p>
                )}
              </div>

              <button
                id="btn-register-submit-new-password"
                type="submit"
                className="w-full py-3.5 bg-[#1976D2] hover:bg-[#1565C0] text-white font-semibold text-base rounded-2xl shadow-sm hover:shadow transition-all active:scale-[0.99] flex items-center justify-center mt-2 cursor-pointer"
              >
                Подтвердить
              </button>
            </form>
          </div>
        )}

        {/* =========================================================
           3. SCREEN 1: "Забыли пароль?" - ENTER PHONE
           ========================================================= */}
        {mode === 'forgot_phone' && (
          <div className="animate-in fade-in duration-150">
            <div className="text-center mb-6">
              <h2 className="text-[24px] sm:text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
                Забыли пароль?
              </h2>
              <p className="text-sm text-gray-500 mt-2 max-w-[340px] mx-auto leading-relaxed">
                Введите номер, указанный при регистрации, и мы отправим вам ссылку для сброса.
              </p>
            </div>

            <form onSubmit={handleGetCodeSubmit} className="space-y-4" id="form-forgot-phone">
              <div>
                <input
                  id="input-forgot-phone"
                  type="tel"
                  placeholder="+996 700 600 600"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="w-full px-4 py-3.5 bg-white text-base text-gray-900 placeholder:text-gray-400 rounded-2xl border border-gray-200 focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10 transition-all outline-none"
                />
              </div>

              <button
                id="btn-get-code"
                type="submit"
                className="w-full py-3.5 bg-[#1976D2] hover:bg-[#1565C0] text-white font-semibold text-base rounded-2xl shadow-sm hover:shadow transition-all active:scale-[0.99] flex items-center justify-center cursor-pointer"
              >
                Получить код
              </button>

              <button
                type="button"
                id="btn-back-to-login"
                onClick={() => setMode('login')}
                className="w-full py-3.5 bg-gray-50/80 hover:bg-gray-100 text-[#1976D2] font-semibold text-base rounded-2xl border border-gray-100 transition-all active:scale-[0.99] flex items-center justify-center cursor-pointer"
              >
                Вернуться
              </button>
            </form>
          </div>
        )}

        {/* =========================================================
           4. SCREEN 2: "Подтвердите номер" (WhatsApp selection)
           ========================================================= */}
        {mode === 'forgot_messenger' && (
          <div className="animate-in fade-in duration-150">
            <div className="text-center mb-6">
              <h2 className="text-[24px] sm:text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
                Подтвердите номер
              </h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Код отправится на выбранный мессенджер
              </p>
            </div>

            <div className="space-y-4">
              <button
                id="btn-whatsapp-forgot"
                type="button"
                onClick={() => handleSelectWhatsApp(false)}
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-base rounded-2xl shadow-sm hover:shadow transition-all active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
                <span>WhatsApp</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('forgot_phone')}
                  className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  Изменить номер телефона
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
           5. SCREEN 3-5: "Введите код" (OTP verification & error states)
           ========================================================= */}
        {mode === 'forgot_otp' && (
          <div className="animate-in fade-in duration-150">
            <div className="text-center mb-6">
              <h2 className="text-[24px] sm:text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
                Введите код
              </h2>
              <p className="text-sm text-gray-500 mt-2 max-w-[340px] mx-auto leading-relaxed">
                Мы отправили СМС с 4-значным кодом на номер {getMaskedPhone(phoneNumber)}.
              </p>
            </div>

            <form onSubmit={(e) => handleVerifyOtpSubmit(e, false)} className="space-y-6" id="form-verify-otp">
              {/* 4 Square Inputs */}
              <div className="flex items-center justify-center gap-3">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpInputRefs.current[index] = el;
                    }}
                    id={`input-otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[index] || ''}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-bold rounded-2xl border transition-all outline-none bg-white ${
                      otpError
                        ? 'border-red-500 text-red-600 ring-1 ring-red-500/20'
                        : otp[index]
                        ? 'border-[#1976D2] text-gray-900 ring-1 ring-[#1976D2]/20'
                        : 'border-gray-200 text-gray-900 focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10'
                    }`}
                  />
                ))}
              </div>

              {/* Confirm Button */}
              <button
                id="btn-submit-otp"
                type="submit"
                className={`w-full py-3.5 font-semibold text-base rounded-2xl transition-all active:scale-[0.99] flex items-center justify-center cursor-pointer ${
                  otpError
                    ? 'border-2 border-red-500 text-red-500 bg-white hover:bg-red-50'
                    : 'bg-[#1976D2] hover:bg-[#1565C0] text-white shadow-sm hover:shadow'
                }`}
              >
                Подтвердить
              </button>

              {/* Resend Code Button */}
              <button
                type="button"
                id="btn-resend-otp"
                onClick={handleResendOtp}
                className="w-full py-3.5 bg-gray-50/80 hover:bg-gray-100 text-gray-800 font-medium text-base rounded-2xl border border-gray-100 transition-all active:scale-[0.99] flex items-center justify-center cursor-pointer"
              >
                Повторно отправить код
              </button>
            </form>
          </div>
        )}

        {/* =========================================================
           6. SCREEN 6: "Придумайте новый пароль"
           ========================================================= */}
        {mode === 'forgot_new_password' && (
          <div className="animate-in fade-in duration-150">
            <div className="text-center mb-6">
              <h2 className="text-[24px] sm:text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
                Придумайте новый пароль
              </h2>
              <p className="text-sm text-gray-500 mt-2 max-w-[340px] mx-auto leading-relaxed">
                Используйте не менее 8 символов, включая цифры и латинские буквы.
              </p>
            </div>

            <form onSubmit={(e) => handleNewPasswordSubmit(e, false)} className="space-y-4" id="form-new-password">
              <div>
                <div className="relative flex items-center">
                  <input
                    id="input-new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Новый пароль"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setNewPassError('');
                    }}
                    className={`w-full pl-4 pr-12 py-3.5 bg-white text-base text-gray-900 placeholder:text-gray-400 rounded-2xl border transition-all outline-none ${
                      newPassError 
                        ? 'border-red-500 ring-1 ring-red-500/20' 
                        : 'border-gray-200 focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    id="btn-toggle-new-password"
                  >
                    {showNewPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <div className="relative flex items-center">
                  <input
                    id="input-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Поменять пароль"
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                      setNewPassError('');
                    }}
                    className={`w-full pl-4 pr-12 py-3.5 bg-white text-base text-gray-900 placeholder:text-gray-400 rounded-2xl border transition-all outline-none ${
                      newPassError 
                        ? 'border-red-500 ring-1 ring-red-500/20' 
                        : 'border-gray-200 focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    id="btn-toggle-confirm-password"
                  >
                    {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
                {newPassError && (
                  <p className="text-red-500 text-xs mt-1.5 px-1 font-medium animate-in fade-in">
                    {newPassError}
                  </p>
                )}
              </div>

              <button
                id="btn-submit-new-password"
                type="submit"
                className="w-full py-3.5 bg-[#1976D2] hover:bg-[#1565C0] text-white font-semibold text-base rounded-2xl shadow-sm hover:shadow transition-all active:scale-[0.99] flex items-center justify-center mt-2 cursor-pointer"
              >
                Подтвердить
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
