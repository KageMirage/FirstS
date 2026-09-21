'use client';

import React from 'react';
import '../index.css';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-white text-gray-900 font-sans antialiased flex items-center justify-center p-4">
        <div className="text-center max-w-md space-y-4">
          <div className="text-6xl font-black text-red-500">500</div>
          <h1 className="text-2xl font-bold text-gray-900">Произошла непредвиденная ошибка</h1>
          <p className="text-gray-600 text-sm">
            Мы уже работаем над исправлением. Попробуйте обновить страницу.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                reset();
                if (typeof window !== 'undefined') {
                  window.location.href = '/';
                }
              }}
              className="px-6 py-2.5 bg-[#1976D2] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              На главную
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
