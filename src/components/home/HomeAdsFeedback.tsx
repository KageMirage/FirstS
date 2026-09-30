'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Inbox, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HomeAdsFeedbackProps {
  error: string | null;
  onRetry: () => void;
  onPostAd: () => void;
}

export const HomeAdsFeedback: React.FC<HomeAdsFeedbackProps> = ({
  error,
  onRetry,
  onPostAd,
}) => {
  const { isAuthenticated } = useAuth();
  if (error) {
    return (
      <div className="bg-red-50/70 border border-red-200 rounded-2xl p-6 sm:p-8 text-center space-y-3.5 my-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-100 flex items-center justify-center text-red-600">
          <AlertCircle className="w-6 h-6 stroke-[1.8]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            Ошибка соединения с сервером
          </h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            {error}
          </p>
        </div>
        <p className="text-xs text-gray-400">
          Запросы логируются в консоль браузера (F12) для проверки работы API.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1976D2] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Повторить запрос
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-8 sm:p-12 text-center space-y-4 my-2">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1976D2]">
        <Inbox className="w-8 h-8 stroke-[1.5]" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-gray-900">
          Объявлений пока нет
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          В базе данных пока отсутствуют записи. Добавьте данные в бекенд или создайте первое объявление.
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Обновить
        </button>
        {isAuthenticated && (
          <button
            type="button"
            onClick={onPostAd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1976D2] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Подать объявление
          </button>
        )}
      </div>
    </div>
  );
};
