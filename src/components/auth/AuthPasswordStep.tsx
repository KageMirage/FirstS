'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthPasswordStepProps {
  onSubmit: (password: string, confirmPassword: string) => void;
  error?: string;
  idPrefix?: string;
}

export const AuthPasswordStep: React.FC<AuthPasswordStepProps> = ({
  onSubmit,
  error = '',
  idPrefix = 'register',
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isRegister = idPrefix === 'register';

  const title = isRegister ? 'Придумайте пароль' : 'Новый пароль';
  const subtitle = isRegister
    ? 'Используйте не менее 6 символов для создания аккаунта'
    : 'Используйте не менее 6 символов для смены пароля';

  const firstPlaceholder = isRegister ? 'Пароль' : 'Новый пароль';
  const secondPlaceholder = 'Подтвердить пароль';
  const buttonText = isRegister ? 'Зарегистрироваться' : 'Сохранить новый пароль';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password, confirmPassword);
  };

  return (
    <div className="animate-in fade-in duration-150">
      <div className="text-center mb-6">
        <h2 className="text-[24px] sm:text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
          {title}
        </h2>
        <p className="text-sm text-gray-500 mt-2 max-w-[340px] mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" id={`form-${idPrefix}-password`}>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 px-1">
            {firstPlaceholder}
          </label>
          <div className="relative flex items-center">
            <input
              id={`input-${idPrefix}-password-1`}
              type={showPassword ? 'text' : 'password'}
              placeholder={firstPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-4 pr-12 py-3.5 bg-white text-base text-gray-900 placeholder:text-gray-400 rounded-2xl border transition-all outline-none ${
                error 
                  ? 'border-red-500 ring-1 ring-red-500/20' 
                  : 'border-gray-200 focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              id={`btn-toggle-${idPrefix}-password-1`}
            >
              {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 px-1">
            {secondPlaceholder}
          </label>
          <div className="relative flex items-center">
            <input
              id={`input-${idPrefix}-password-2`}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={secondPlaceholder}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full pl-4 pr-12 py-3.5 bg-white text-base text-gray-900 placeholder:text-gray-400 rounded-2xl border transition-all outline-none ${
                error 
                  ? 'border-red-500 ring-1 ring-red-500/20' 
                  : 'border-gray-200 focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              id={`btn-toggle-${idPrefix}-password-2`}
            >
              {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-xs mt-1.5 px-1 font-medium animate-in fade-in">
              {error}
            </p>
          )}
        </div>

        <button
          id={`btn-${idPrefix}-submit-password`}
          type="submit"
          className="w-full py-3.5 bg-[#1976D2] hover:bg-[#1565C0] text-white font-semibold text-base rounded-2xl shadow-sm hover:shadow transition-all active:scale-[0.99] flex items-center justify-center mt-2 cursor-pointer"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};
