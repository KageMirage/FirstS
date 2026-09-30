'use client';

import React from 'react';

export const ErrorDecorativeBackground: React.FC = () => {
  return (
    <>
      {/* Top-Left Folded Ribbon Emblem */}
      <div 
        className="absolute top-10 left-[8%] sm:left-[12%] text-[#ECE8FE] pointer-events-none opacity-80"
        aria-hidden="true"
      >
        <svg width="68" height="68" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 C65 0, 85 15, 85 35 C85 45, 80 50, 75 55 L90 70 C100 80, 85 95, 70 90 L55 75 C50 80, 45 85, 35 85 C15 85, 0 65, 0 50 C0 35, 15 15, 35 15 L50 0 Z" opacity="0.85" />
          <circle cx="50" cy="50" r="14" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Top-Right 4-Petal Cross Flower */}
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

      {/* Left Mid Spiral/Swirl Galaxy */}
      <div 
        className="absolute top-[48%] left-[4%] sm:left-[9%] text-[#EAE4FE] pointer-events-none opacity-75"
        aria-hidden="true"
      >
        <svg width="64" height="64" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round">
          <path d="M50 50 m -6, 0 a 6,6 0 1,0 12,0 a 14,14 0 1,0 -28,0 a 24,24 0 1,0 48,0 a 34,34 0 1,0 -68,0" />
        </svg>
      </div>

      {/* Right Mid Sunburst / Sparkle */}
      <div 
        className="absolute top-[45%] right-[6%] sm:right-[11%] text-[#EFEAFE] pointer-events-none opacity-85"
        aria-hidden="true"
      >
        <svg width="76" height="76" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 L58 35 L93 20 L68 46 L100 50 L68 54 L93 80 L58 65 L50 100 L42 65 L7 80 L32 54 L0 50 L32 46 L7 20 L42 35 Z" />
        </svg>
      </div>

      {/* Bottom-Left 4-Pointed Soft Star */}
      <div 
        className="absolute bottom-12 left-[10%] sm:left-[15%] text-[#EAE3FD] pointer-events-none opacity-80"
        aria-hidden="true"
      >
        <svg width="66" height="66" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 C50 32, 68 50, 100 50 C68 50, 50 68, 50 100 C50 68, 32 50, 0 50 C32 50, 50 32, 50 0 Z" />
        </svg>
      </div>

      {/* Bottom-Right Target / Donut Concentric Rings */}
      <div 
        className="absolute bottom-10 right-[9%] sm:right-[14%] text-[#EAE4FE] pointer-events-none opacity-75"
        aria-hidden="true"
      >
        <svg width="62" height="62" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="8" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="7" />
          <circle cx="50" cy="50" r="10" />
        </svg>
      </div>
    </>
  );
};
