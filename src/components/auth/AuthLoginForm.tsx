'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthLoginFormProps {
  phoneNumber: string;
  onPhoneChange: (val: string) => void;
  onSubmit: (password: string) => void;
  onGoogleLogin: () => void;
  onForgotPassword: () => void;
  onSwitchToRegister: () => void;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
}

export const AuthLoginForm: React.FC<AuthLoginFormProps> = ({
  phoneNumber,
  onPhoneChange,
  onSubmit,
  onGoogleLogin,
  onForgotPassword,
  onSwitchToRegister,
  isLoading,
  hasError,
  errorMessage,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-[24px] sm:text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
          Добро пожаловать
        </h2>
        <p className="text-sm text-gray-500 mt-1.5 font-normal">
          Введите данные для входа в аккаунт
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" id="form-login">
        <div>
          <input
            id="input-phone-number"
            type="tel"
            placeholder="+996 700 600 600"
            value={phoneNumber}
            onChange={(e) => onPhoneChange(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
                onClick={onForgotPassword}
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
                onClick={onForgotPassword}
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
            onClick={onSwitchToRegister}
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
          onClick={onGoogleLogin}
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
  );
};
