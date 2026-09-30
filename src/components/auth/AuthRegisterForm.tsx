'use client';

import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';

interface AuthRegisterFormProps {
  phoneNumber: string;
  onPhoneChange: (val: string) => void;
  deliveryMethod?: 'whatsapp' | 'telegram';
  onDeliveryMethodChange?: (method: 'whatsapp' | 'telegram') => void;
  privacyAccepted: boolean;
  onTogglePrivacy: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleLogin: () => void;
  onSwitchToLogin: () => void;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export const AuthRegisterForm: React.FC<AuthRegisterFormProps> = ({
  phoneNumber,
  onPhoneChange,
  deliveryMethod = 'whatsapp',
  onDeliveryMethodChange,
  privacyAccepted,
  onTogglePrivacy,
  onSubmit,
  onGoogleLogin,
  onSwitchToLogin,
  isLoading,
  hasError,
  errorMessage,
}) => {
  const isAlreadyExists = errorMessage?.toLowerCase().includes('уже существует');
  const isTg = deliveryMethod === 'telegram';
  const messengerName = isTg ? 'Telegram' : 'WhatsApp';

  return (
    <div className="animate-in fade-in duration-150">
      <div className="text-center mb-5">
        <h2 className="text-[24px] sm:text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
          Регистрация
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 font-normal">
          Получите код подтверждения в мессенджер
        </p>
      </div>

      {/* Form: Via Messenger OTP with confirmation */}
      <form onSubmit={onSubmit} className="space-y-3.5" id="form-register-otp">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Куда отправить 4-значный код:
          </label>
          <div className="flex items-center gap-1.5 p-1 bg-gray-100/90 rounded-2xl border border-gray-200/50">
            <button
              type="button"
              id="btn-register-select-whatsapp"
              onClick={() => onDeliveryMethodChange?.('whatsapp')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !isTg
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span>WhatsApp</span>
            </button>
            <button
              type="button"
              id="btn-register-select-telegram"
              onClick={() => onDeliveryMethodChange?.('telegram')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isTg
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
              <span>Telegram</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Номер телефона:
          </label>
          <input
            id="input-register-phone"
            type="tel"
            placeholder="+996 700 600 600"
            value={phoneNumber}
            onChange={(e) => onPhoneChange(e.target.value)}
            className={`w-full px-4 py-3.5 bg-white text-base text-gray-900 placeholder:text-gray-400 rounded-2xl border transition-all outline-none ${
              hasError
                ? 'border-red-500 ring-1 ring-red-500/20'
                : 'border-gray-200 focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10'
            }`}
          />
          {hasError && (
            <div className="space-y-2 mt-2">
              <div className="text-xs text-red-500 px-1 font-medium animate-in fade-in">
                {errorMessage || 'Введите корректный номер телефона'}
              </div>
              {isAlreadyExists && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between animate-in fade-in">
                  <span>Номер уже зарегистрирован</span>
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="font-bold text-[#1976D2] hover:underline cursor-pointer ml-2 whitespace-nowrap"
                  >
                    Войти в аккаунт
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Privacy Policy Checkbox */}
        <div className="flex items-center gap-2.5 px-1 py-0.5">
          <button
            type="button"
            onClick={onTogglePrivacy}
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
            onClick={onTogglePrivacy}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors cursor-pointer select-none"
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
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>{'Отправить код в ' + messengerName}</span>
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="flex items-center justify-between pt-3 px-1 text-sm">
        <span className="text-gray-500 text-xs sm:text-sm">
          Уже есть аккаунт?
        </span>
        <button
          type="button"
          id="btn-switch-to-login"
          onClick={onSwitchToLogin}
          className="font-medium text-xs sm:text-sm text-[#1976D2] hover:text-[#1565C0] transition-colors cursor-pointer"
        >
          Войти
        </button>
      </div>

      <div className="relative py-2.5 flex items-center justify-center">
        <div className="w-full border-t border-gray-200" />
        <span className="absolute bg-white px-3 text-[11px] uppercase tracking-wider text-gray-400 font-medium">
          или
        </span>
      </div>

      {/* Google Login button */}
      <button
        type="button"
        onClick={onGoogleLogin}
        className="w-full py-3 px-4 bg-gray-50/80 hover:bg-gray-100 text-gray-800 font-medium text-sm rounded-2xl border border-gray-200/80 shadow-2xs hover:border-gray-300 transition-all flex items-center justify-center gap-3 active:scale-[0.99] cursor-pointer"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
        </svg>
        <span>Войти с Google</span>
      </button>
    </div>
  );
};
