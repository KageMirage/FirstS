'use client';

import React from 'react';
import { useSearchParams } from '../hooks/useSearchParams';
import { ErrorDecorativeBackground } from './error/ErrorDecorativeBackground';

export interface ErrorPageViewProps {
  code?: '404' | '505' | '500' | string;
  title?: string;
  buttonText?: string;
  onNavigateHome?: () => void;
  description?: string;
}

export const ErrorPageView: React.FC<ErrorPageViewProps> = ({
  code = '404',
  title,
  buttonText = 'На главную',
  onNavigateHome,
  description,
}) => {
  const [, , , navigate] = useSearchParams();

  // Determine standard title based on error code
  const displayTitle =
    title ||
    (code === '404'
      ? 'Страница не найдена'
      : code === '505' || code === '500'
      ? 'Ошибка сервера'
      : 'Произошла ошибка');

  const handleHomeClick = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-140px)] w-full flex items-center justify-center overflow-hidden bg-white px-4 py-16 select-none">
      {/* Background Floating Decorative SVG Shapes */}
      <ErrorDecorativeBackground />

      {/* Main Center Stage */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto">
        {/* Giant Number (404 / 505) with exact color styling #4A3AFF */}
        <div 
          id="error-code-display"
          className="text-[130px] sm:text-[180px] md:text-[210px] font-black tracking-tight leading-none text-[#4A3AFF] select-none scale-100 animate-in fade-in zoom-in-90 duration-300"
          style={{
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {code}
        </div>

        {/* Title Headline */}
        <h1 
          id="error-title-text"
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E2022] mt-2 mb-3 tracking-tight"
        >
          {displayTitle}
        </h1>

        {/* Optional Description */}
        {description && (
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
            {description}
          </p>
        )}

        {/* Call to Action Primary Button (Matching Pill Shape & Color #4A3AFF) */}
        <div className="mt-5">
          <button
            id="btn-error-home"
            type="button"
            onClick={handleHomeClick}
            className="inline-flex items-center justify-center px-10 py-3.5 sm:py-4 rounded-full bg-[#4A3AFF] hover:bg-[#3D2FE6] active:scale-98 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};
