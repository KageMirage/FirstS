'use client';

import React, { useRef, useEffect, useState } from 'react';
import { RefreshCw, AlertCircle, Check } from 'lucide-react';

interface AuthOtpStepProps {
  otp: string[];
  otpError: boolean;
  maskedPhone: string;
  deliveryMethod?: 'whatsapp' | 'telegram';
  isLoading?: boolean;
  onOtpChange: (index: number, val: string) => void;
  onOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
  onSwitchMethod?: (newMethod: 'whatsapp' | 'telegram') => void;
  onChangePhone?: () => void;
  idPrefix?: string;
}

export const AuthOtpStep: React.FC<AuthOtpStepProps> = ({
  otp,
  otpError,
  maskedPhone,
  deliveryMethod = 'whatsapp',
  isLoading = false,
  onOtpChange,
  onOtpKeyDown,
  onSubmit,
  onResend,
  onSwitchMethod,
  onChangePhone,
  idPrefix = 'register',
}) => {
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(60);

  const isTg = deliveryMethod === 'telegram';
  const messengerName = isTg ? 'Telegram' : 'WhatsApp';
  const altMethod: 'whatsapp' | 'telegram' = isTg ? 'whatsapp' : 'telegram';
  const altMessengerName = isTg ? 'WhatsApp' : 'Telegram';

  useEffect(() => {
    otpInputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendClick = () => {
    if (countdown > 0 || isLoading) return;
    setCountdown(60);
    onResend();
  };

  const handleSwitchMessenger = () => {
    if (isLoading) return;
    setCountdown(60);
    if (onSwitchMethod) {
      onSwitchMethod(altMethod);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-in fade-in duration-150">
      <div className="text-center mb-5">
        <h2 className="text-[24px] sm:text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
          Подтверждение номера
        </h2>
        <p className="text-sm text-gray-500 mt-2 max-w-[340px] mx-auto leading-relaxed">
          Код подтверждения для номера <span className="font-semibold text-gray-800">{maskedPhone}</span>
        </p>
      </div>

      {/* Real Messenger Delivery Card */}
      <div
        className={`mb-4 p-4 rounded-2xl flex items-center justify-between gap-3 border ${
          isTg
            ? 'bg-sky-50/90 border-sky-200/80 text-sky-950'
            : 'bg-emerald-50/90 border-emerald-200/80 text-emerald-950'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isTg ? 'bg-sky-100 text-sky-600' : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="text-xs leading-snug min-w-0">
            <p className={`font-bold flex items-center gap-1.5 ${isTg ? 'text-sky-900' : 'text-emerald-900'}`}>
              <span>Запрос отправлен в {messengerName}</span>
            </p>
            <p className={`text-[11px] mt-0.5 truncate ${isTg ? 'text-sky-700' : 'text-emerald-700'}`}>
              Ожидается код на номер {maskedPhone}
            </p>
          </div>
        </div>

        {/* Quick switch button right in the card */}
        {onSwitchMethod && (
          <button
            type="button"
            onClick={handleSwitchMessenger}
            disabled={isLoading}
            className={`shrink-0 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition border cursor-pointer ${
              isTg
                ? 'bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs'
                : 'bg-white hover:bg-sky-50 text-sky-700 border-sky-200 shadow-2xs'
            }`}
            title={`Отправить через ${altMessengerName}`}
          >
            В {altMessengerName} →
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-5" id={`form-${idPrefix}-verify-otp`}>
        {/* 4 Square Inputs */}
        <div className="flex items-center justify-center gap-3">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              ref={(el) => {
                otpInputRefs.current[index] = el;
              }}
              id={`input-${idPrefix}-otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              autoComplete="one-time-code"
              value={otp[index] || ''}
              onChange={(e) => {
                const clean = e.target.value.replace(/\D/g, '').slice(-1);
                onOtpChange(index, clean);
                if (clean && index < 3) {
                  otpInputRefs.current[index + 1]?.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !otp[index] && index > 0) {
                  otpInputRefs.current[index - 1]?.focus();
                }
                onOtpKeyDown(index, e);
              }}
              className={`w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-bold rounded-2xl border transition-all outline-none bg-white ${
                otpError
                  ? 'border-red-500 text-red-600 ring-2 ring-red-500/20'
                  : otp[index]
                  ? 'border-[#1976D2] text-gray-900 ring-2 ring-[#1976D2]/20'
                  : 'border-gray-200 text-gray-900 focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10'
              }`}
            />
          ))}
        </div>

        {otpError && (
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-red-500 bg-red-50 py-2.5 px-3 rounded-xl animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Неверный код подтверждения. Пожалуйста, проверьте {messengerName}</span>
          </div>
        )}

        {/* Confirm Button */}
        <button
          id={`btn-${idPrefix}-submit-otp`}
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 font-semibold text-base rounded-2xl bg-[#1976D2] hover:bg-[#1565C0] text-white shadow-sm hover:shadow transition-all active:scale-[0.99] flex items-center justify-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Проверка кода...</span>
            </>
          ) : (
            <span>Подтвердить</span>
          )}
        </button>

        {/* Resend Code Button / Messenger Switch / Change Phone */}
        <div className="space-y-3 pt-1 text-center">
          {countdown > 0 ? (
            <p className="text-xs text-gray-400">
              Повторная отправка в {messengerName} через{' '}
              <span className="font-semibold text-gray-600 font-mono">{formatTimer(countdown)}</span>
            </p>
          ) : (
            <button
              type="button"
              id={`btn-${idPrefix}-resend-otp`}
              onClick={handleResendClick}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1976D2] hover:text-[#1565C0] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Отправить код в {messengerName} повторно</span>
            </button>
          )}

          {/* Alternative Messenger Button */}
          {onSwitchMethod && (
            <div className="pt-1">
              <button
                type="button"
                onClick={handleSwitchMessenger}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100/90 hover:bg-gray-200/80 px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                <span>Не приходит код? Отправить в </span>
                <span className={`font-bold ${isTg ? 'text-emerald-600' : 'text-sky-600'}`}>
                  {altMessengerName}
                </span>
              </button>
            </div>
          )}

          {onChangePhone && (
            <div>
              <button
                type="button"
                onClick={onChangePhone}
                className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Изменить номер телефона
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
