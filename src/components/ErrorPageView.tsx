'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from '../hooks/useSearchParams';

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
      {/* ========================================================================= */}
      {/* Background Floating Decorative SVG Shapes (Pastel purple/blue accents) */}
      {/* ========================================================================= */}

      {/* 1. Top-Left Folded Ribbon Emblem */}
      <div 
        className="absolute top-10 left-[8%] sm:left-[12%] text-[#ECE8FE] pointer-events-none opacity-80"
        aria-hidden="true"
      >
        <svg width="68" height="68" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 C65 0, 85 15, 85 35 C85 45, 80 50, 75 55 L90 70 C100 80, 85 95, 70 90 L55 75 C50 80, 45 85, 35 85 C15 85, 0 65, 0 50 C0 35, 15 15, 35 15 L50 0 Z" opacity="0.85" />
          <circle cx="50" cy="50" r="14" fill="#FFFFFF" />
        </svg>
      </div>

      {/* 2. Top-Right 4-Petal Cross Flower */}
      <div 
        className="absolute top-12 right-[12%] sm:right-[18%] text-[#EDE7FC] pointer-events-none opacity-85"
        aria-hidden="true"
      >
        <svg width="74" height="74" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="24" r="20" />
          <circle cx="50" cy="76" r="20" />
          <circle cx="24" cy="50" r="20" />
          <circle cx="76" cy="50" r="20" />
          <circle cx="50" cy="50" r="16" fill="#FFFFFF" />
        </svg>
      </div>

      {/* 3. Middle-Left Geometric Badge */}
      <div 
        className="absolute top-[46%] left-[6%] sm:left-[10%] text-[#EDE8FC] pointer-events-none opacity-75"
        aria-hidden="true"
      >
        <svg width="72" height="72" viewBox="0 0 100 100" fill="currentColor">
          <path d="M15 15 L85 15 L85 85 L50 85 L15 50 Z" rx="16" />
          <rect x="22" y="22" width="28" height="28" rx="8" fill="#FFFFFF" />
        </svg>
      </div>

      {/* 4. Middle-Right 3-Leaf Clover (Trefoil with stem) */}
      <div 
        className="absolute top-[42%] right-[4%] sm:right-[8%] text-[#EFEAFC] pointer-events-none opacity-80"
        aria-hidden="true"
      >
        <svg width="76" height="76" viewBox="0 0 100 100" fill="currentColor">
          {/* Top Leaf */}
          <circle cx="50" cy="30" r="19" />
          {/* Left Leaf */}
          <circle cx="32" cy="56" r="19" />
          {/* Right Leaf */}
          <circle cx="68" cy="56" r="19" />
          {/* Center stem */}
          <path d="M47 55 C47 75, 42 85, 36 90 L44 90 C50 84, 53 74, 53 55 Z" />
        </svg>
      </div>

      {/* 5. Bottom-Left Star In Rounded Square */}
      <div 
        className="absolute bottom-10 left-[18%] sm:left-[28%] text-[#EDE8FC] pointer-events-none opacity-80"
        aria-hidden="true"
      >
        <svg width="100" height="100" viewBox="0 0 120 120" fill="currentColor">
          <rect x="10" y="10" width="100" height="100" rx="36" />
          {/* Inner 4-point star cutout */}
          <path 
            d="M60 25 C60 48, 48 60, 25 60 C48 60, 60 72, 60 95 C60 72, 72 60, 95 60 C72 60, 60 48, 60 25 Z" 
            fill="#FFFFFF" 
          />
        </svg>
      </div>

      {/* 6. Bottom-Right Curved Plus / Cross */}
      <div 
        className="absolute bottom-16 right-[7%] sm:right-[11%] text-[#EAE4FC] pointer-events-none opacity-80"
        aria-hidden="true"
      >
        <svg width="74" height="74" viewBox="0 0 100 100" fill="currentColor">
          <path 
            d="M38 12 C38 6, 44 0, 50 0 C56 0, 62 6, 62 12 L62 38 L88 38 C94 38, 100 44, 100 50 C100 56, 94 62, 88 62 L62 62 L62 88 C62 94, 56 100, 50 100 C44 100, 38 94, 38 88 L38 62 L12 62 C6 62, 0 56, 0 50 C0 44, 6 38, 12 38 L38 38 Z" 
            rx="10"
          />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* Central Content Block */}
      {/* ========================================================================= */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
        
        {/* Large Brand Numerals with Overlaid Geometric Florals */}
        <div className="relative inline-flex items-center justify-center select-none">
          
          {/* Massive Display Digits */}
          <h1 
            className="text-[140px] sm:text-[200px] md:text-[260px] font-black tracking-[-0.04em] leading-[0.88] text-[#1E75D8] drop-shadow-sm font-sans"
            style={{ letterSpacing: '-0.05em' }}
          >
            {code}
          </h1>

          {/* Center Digit Star/Snowflake Floral Vector Overlay */}
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <div className="w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 text-white/35">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                {/* 8-Point Floral Star */}
                <path d="M50 0 L58 35 L90 20 L68 45 L100 50 L68 55 L90 80 L58 65 L50 100 L42 65 L10 80 L32 55 L0 50 L32 45 L10 20 L42 35 Z" opacity="0.8" />
                <circle cx="50" cy="50" r="8" fill="#1E75D8" opacity="0.5" />
              </svg>
            </div>
          </div>

          {/* Left Corner Petal Accent */}
          <div 
            className="absolute left-[6%] sm:left-[10%] top-[45%] pointer-events-none text-white/30"
            aria-hidden="true"
          >
            <svg width="36" height="36" viewBox="0 0 40 40" fill="currentColor">
              <path d="M20 0 C28 10, 35 20, 20 40 C5 20, 12 10, 20 0 Z" />
            </svg>
          </div>

          {/* Right Corner Petal Accent */}
          <div 
            className="absolute right-[6%] sm:right-[10%] top-[45%] pointer-events-none text-white/30"
            aria-hidden="true"
          >
            <svg width="36" height="36" viewBox="0 0 40 40" fill="currentColor">
              <path d="M20 0 C28 10, 35 20, 20 40 C5 20, 12 10, 20 0 Z" />
            </svg>
          </div>
        </div>

        {/* Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-6 sm:mt-8 mb-6 sm:mb-8">
          {displayTitle}
        </h2>

        {description && (
          <p className="text-base text-gray-500 max-w-md mb-6">
            {description}
          </p>
        )}

        {/* Primary Action Button ("На главную") */}
        <button
          type="button"
          onClick={handleHomeClick}
          id="btn-error-home"
          className="inline-flex items-center justify-center px-9 py-3.5 rounded-full bg-[#1976D2] hover:bg-[#1565C0] active:scale-[0.98] text-white text-base font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ErrorPageView;
