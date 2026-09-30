'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AuthForgotPhoneProps {
  phoneNumber: string;
  onPhoneChange: (val: string) => void;
  deliveryMethod?: 'whatsapp' | 'telegram';
  onDeliveryMethodChange?: (method: 'whatsapp' | 'telegram') => void;
  onSubmit: (e: React.FormEvent) => void;
  onBackToLogin: () => void;
  onSwitchToRegister?: () => void;
  hasError?: boolean;
  errorMessage?: string;
  isLoading?: boolean;
}

export const AuthForgotPhone: React.FC<AuthForgotPhoneProps> = ({
  phoneNumber,
  onPhoneChange,
  deliveryMethod = 'whatsapp',
  onDeliveryMethodChange,
  onSubmit,
  onBackToLogin,
  onSwitchToRegister,
  hasError = false,
  errorMessage,
  isLoading = false,
}) => {
  const isNotFound = 
    errorMessage?.toLowerCase().includes('не найден') || 
    errorMessage?.toLowerCase().includes('не существует');
  const isSendFailed = errorMessage?.toLowerCase().includes('не удалось отправить');
  const isTg = deliveryMethod === 'telegram';
  const messengerName = isTg ? 'Telegram' : 'WhatsApp';
  const altMethod: 'whatsapp' | 'telegram' = isTg ? 'whatsapp' : 'telegram';
  const altMessengerName = isTg ? 'WhatsApp' : 'Telegram';

  return (
    <div className="animate-in fade-in duration-150">
      <div className="text-center mb-5">
        <h2 className="text-[24px] sm:text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
          Забыли пароль?
        </h2>
        <p className="text-sm text-gray-500 mt-2 max-w-[340px] mx-auto leading-relaxed">
          Укажите номер телефона для сброса пароля через {messengerName}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" id="form-forgot-phone">
        {/* Messenger Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Куда отправить код сброса:
          </label>
          <div className="flex items-center gap-1.5 p-1 bg-gray-100/90 rounded-2xl border border-gray-200/50">
            <button
              type="button"
              id="btn-forgot-select-whatsapp"
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
              id="btn-forgot-select-telegram"
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
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Номер телефона:
          </label>
          <input
            id="input-forgot-phone"
            type="tel"
            placeholder="+996 700 600 600"
            value={phoneNumber}
            onChange={(e) => onPhoneChange(e.target.value)}
            disabled={isLoading}
            className={`w-full px-4 py-3.5 bg-white text-base text-gray-900 placeholder:text-gray-400 rounded-2xl border transition-all outline-none ${
              hasError
                ? 'border-red-500 text-red-900 ring-2 ring-red-500/20'
                : 'border-gray-200 focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10'
            }`}
          />
          {hasError && (
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-red-500 px-1 font-medium animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage || 'Пожалуйста, введите корректный номер телефона'}</span>
              </div>
              {isNotFound && onSwitchToRegister && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-center justify-between animate-in fade-in">
                  <span>Этот номер еще не зарегистрирован</span>
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="font-bold text-[#1976D2] hover:underline cursor-pointer ml-2 whitespace-nowrap"
                  >
                    Зарегистрироваться
                  </button>
                </div>
              )}
              {isSendFailed && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-2 animate-in fade-in">
                  <div className="font-semibold">Не удалось отправить код в {messengerName}</div>
                  <div className="text-gray-700 leading-relaxed text-[11px]">
                    Шлюз {messengerName} вернул ошибку отправки. Попробуйте переключиться на {altMessengerName}.
                  </div>
                  {onDeliveryMethodChange && (
                    <button
                      type="button"
                      onClick={() => onDeliveryMethodChange(altMethod)}
                      className="inline-flex items-center gap-1.5 font-bold text-[#1976D2] hover:underline cursor-pointer"
                    >
                      <span>Переключить на {altMessengerName} и повторить</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          id="btn-get-code"
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-[#1976D2] hover:bg-[#1565C0] text-white font-semibold text-base rounded-2xl shadow-sm hover:shadow transition-all active:scale-[0.99] flex items-center justify-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Отправка кода...</span>
            </>
          ) : (
            'Получить код'
          )}
        </button>

        <button
          type="button"
          id="btn-back-to-login"
          onClick={onBackToLogin}
          disabled={isLoading}
          className="w-full py-3.5 bg-gray-50/80 hover:bg-gray-100 text-[#1976D2] font-semibold text-base rounded-2xl border border-gray-100 transition-all active:scale-[0.99] flex items-center justify-center cursor-pointer disabled:opacity-60"
        >
          Вернуться к входу
        </button>
      </form>
    </div>
  );
};
