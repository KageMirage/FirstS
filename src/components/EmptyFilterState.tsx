'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';

interface EmptyFilterStateProps {
  onReset: () => void;
}

export const EmptyFilterState: React.FC<EmptyFilterStateProps> = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-3xl border border-gray-100/90 shadow-sm w-full my-4" id="empty-filter-state">
      
      {/* SVG Illustration of Warehouse Shelves and Open Blue Delivery Box */}
      <div className="w-full max-w-[340px] mb-8">
        <svg
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-sm"
        >
          {/* Shelving Frame Lines */}
          <line x1="60" y1="260" x2="340" y2="260" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          <line x1="90" y1="260" x2="90" y2="70" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="170" y1="260" x2="170" y2="70" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="250" y1="260" x2="250" y2="70" stroke="#CBD5E1" strokeWidth="2" />
          
          {/* Diagonal Cross Supports */}
          <line x1="90" y1="70" x2="170" y2="150" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="170" y1="70" x2="90" y2="150" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="170" y1="70" x2="250" y2="150" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="250" y1="70" x2="170" y2="150" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Shelves */}
          <line x1="80" y1="150" x2="260" y2="150" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="80" y1="230" x2="260" y2="230" stroke="#CBD5E1" strokeWidth="2" />

          {/* Hand Truck / Pallet Jack on Right */}
          <rect x="270" y="195" width="6" height="60" rx="3" fill="#64748B" />
          <circle cx="273" cy="255" r="7" fill="#334155" />
          <circle cx="273" cy="255" r="3" fill="#F8FAFC" />
          <path d="M273 195 L273 130 C273 120 285 120 285 130 L285 195" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          <line x1="265" y1="245" x2="295" y2="245" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

          {/* Top Stacked Cardboard Boxes */}
          <rect x="105" y="105" width="55" height="42" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="105" y1="126" x2="160" y2="126" stroke="#E2E8F0" strokeWidth="1" />
          
          <rect x="180" y="90" width="60" height="57" rx="2" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="210" y1="90" x2="210" y2="147" stroke="#E2E8F0" strokeWidth="1" />

          {/* Middle Stacked Boxes */}
          <rect x="100" y="180" width="70" height="48" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="100" y1="204" x2="170" y2="204" stroke="#E2E8F0" strokeWidth="1" />

          {/* Blue Open Shipping Box (Hero Accent) */}
          {/* Box back flap */}
          <polygon points="175,200 215,185 240,195 200,210" fill="#1d4ed8" />
          
          {/* Main Box Body */}
          <polygon points="170,210 230,210 240,250 160,250" fill="#2563eb" />
          <polygon points="160,250 240,250 240,265 160,265" fill="#1e40af" />
          
          {/* Front Opening / Open Flaps */}
          <polygon points="150,210 170,210 165,190 145,190" fill="#3b82f6" />
          <polygon points="230,210 250,210 255,190 235,190" fill="#3b82f6" />
          <polygon points="170,210 230,210 220,230 180,230" fill="#1d4ed8" />
          
          {/* Tape stripe */}
          <rect x="195" y="210" width="10" height="40" fill="#60a5fa" opacity="0.6" />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
        Ничего Не Нашлось
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-6 font-normal">
        Попробуйте изменить формулировку или сбросить фильтры — возможно, мы спрятали это слишком глубоко.
      </p>

      {/* Action Button */}
      <button
        id="btn-empty-reset-filters"
        onClick={onReset}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1a73e8] hover:bg-[#1557b0] active:bg-[#10448e] text-white text-sm font-semibold rounded-xl transition-all duration-150 shadow-sm hover:shadow cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Сбросить фильтры</span>
      </button>

    </div>
  );
};
