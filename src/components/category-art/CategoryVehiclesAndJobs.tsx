import React from 'react';

// 1. Briefcase (Работа) - Rich 3D brown leather briefcase with brass locks and handle
export const BriefcaseArt: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 84 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="bf-body" x1="10" y1="24" x2="74" y2="72" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A0522D" />
        <stop offset="0.3" stopColor="#8B4513" />
        <stop offset="0.7" stopColor="#70360D" />
        <stop offset="1" stopColor="#4A1E06" />
      </linearGradient>
      <linearGradient id="bf-flap" x1="12" y1="24" x2="72" y2="54" gradientUnits="userSpaceOnUse">
        <stop stopColor="#B45309" />
        <stop offset="0.5" stopColor="#92400E" />
        <stop offset="1" stopColor="#6A2E05" />
      </linearGradient>
      <linearGradient id="bf-gold" x1="36" y1="46" x2="48" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEF08A" />
        <stop offset="0.4" stopColor="#F59E0B" />
        <stop offset="0.8" stopColor="#D97706" />
        <stop offset="1" stopColor="#92400E" />
      </linearGradient>
      <linearGradient id="bf-strap" x1="0" y1="24" x2="0" y2="70" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6A2E05" />
        <stop offset="1" stopColor="#3E1A04" />
      </linearGradient>
    </defs>
    <ellipse cx="42" cy="74" rx="34" ry="4" fill="#000000" fillOpacity="0.22" />
    <path d="M30 25 C30 14, 54 14, 54 25" stroke="#3E1A04" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M30 25 C30 15.5, 54 15.5, 54 25" stroke="#92400E" strokeWidth="3" strokeLinecap="round" fill="none" />
    <rect x="27" y="23" width="7" height="5" rx="2" fill="url(#bf-gold)" stroke="#78350F" strokeWidth="0.5" />
    <rect x="50" y="23" width="7" height="5" rx="2" fill="url(#bf-gold)" stroke="#78350F" strokeWidth="0.5" />
    <rect x="10" y="26" width="64" height="46" rx="7" fill="url(#bf-body)" stroke="#4A1E06" strokeWidth="1" />
    <rect x="12.5" y="28.5" width="59" height="41" rx="5" stroke="#FDE68A" strokeOpacity="0.4" strokeWidth="0.8" strokeDasharray="2.5 1.5" fill="none" />
    <rect x="22" y="26" width="5" height="46" fill="url(#bf-strap)" />
    <rect x="22" y="52" width="5" height="5" rx="1" fill="url(#bf-gold)" />
    <rect x="57" y="26" width="5" height="46" fill="url(#bf-strap)" />
    <rect x="57" y="52" width="5" height="5" rx="1" fill="url(#bf-gold)" />
    <path d="M10 26 H74 V46 Q74 52 66 54 L46 58 Q42 59 38 58 L18 54 Q10 52 10 46 Z" fill="url(#bf-flap)" stroke="#4A1E06" strokeWidth="0.8" />
    <path d="M12.5 28 H71.5 V45 Q71.5 50.5 64 52.5 L45 56.5 Q42 57.2 39 56.5 L20 52.5 Q12.5 50.5 12.5 45 Z" stroke="#FDE68A" strokeOpacity="0.45" strokeWidth="0.8" strokeDasharray="2.5 1.5" fill="none" />
    <rect x="37" y="49" width="10" height="12" rx="2.5" fill="url(#bf-gold)" stroke="#78350F" strokeWidth="0.6" />
    <circle cx="42" cy="54" r="1.8" fill="#3E1A04" />
    <rect x="41.2" y="54" width="1.6" height="3.5" fill="#3E1A04" rx="0.5" />
    <path d="M10 63 Q10 72 19 72" stroke="url(#bf-gold)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M74 63 Q74 72 65 72" stroke="url(#bf-gold)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

// 2. White Semi-Trailer Truck (Подработка) - Modern heavy freight truck cab
export const WhiteTruckArt: React.FC<{ className?: string }> = ({ className = 'w-16 h-12' }) => (
  <svg viewBox="0 0 94 62" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="wt-cab" x1="52" y1="12" x2="86" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="0.6" stopColor="#F1F5F9" />
        <stop offset="1" stopColor="#CBD5E1" />
      </linearGradient>
      <linearGradient id="wt-trailer" x1="4" y1="14" x2="56" y2="46" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="0.4" stopColor="#F8FAFC" />
        <stop offset="0.8" stopColor="#E2E8F0" />
        <stop offset="1" stopColor="#CBD5E1" />
      </linearGradient>
    </defs>
    <ellipse cx="46" cy="53" rx="42" ry="4" fill="#000000" fillOpacity="0.22" />
    <rect x="5" y="15" width="49" height="30" rx="3" fill="url(#wt-trailer)" stroke="#94A3B8" strokeWidth="0.8" />
    <line x1="14" y1="16" x2="14" y2="44" stroke="#E2E8F0" strokeWidth="1.2" />
    <line x1="23" y1="16" x2="23" y2="44" stroke="#E2E8F0" strokeWidth="1.2" />
    <line x1="32" y1="16" x2="32" y2="44" stroke="#E2E8F0" strokeWidth="1.2" />
    <line x1="41" y1="16" x2="41" y2="44" stroke="#E2E8F0" strokeWidth="1.2" />
    <line x1="50" y1="16" x2="50" y2="44" stroke="#E2E8F0" strokeWidth="1.2" />
    <rect x="8" y="44" width="43" height="4" fill="#334155" />
    <path d="M52 23 H66 L78 28 L84 36 L86 46 Q86 48 83 48 H52 Z" fill="url(#wt-cab)" stroke="#94A3B8" strokeWidth="0.8" />
    <path d="M54 23 L63 15 L70 23 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.5" />
    <path d="M66 25 L76 29 L76 36 H63 L63 25 Z" fill="#38BDF8" fillOpacity="0.55" stroke="#334155" strokeWidth="0.8" />
    <rect x="55" y="25" width="7" height="9" rx="1" fill="#38BDF8" fillOpacity="0.45" stroke="#334155" strokeWidth="0.6" />
    <rect x="78" y="38" width="7.5" height="9" rx="1.5" fill="#1E293B" />
    <line x1="79" y1="40" x2="84.5" y2="40" stroke="#94A3B8" strokeWidth="0.8" />
    <line x1="79" y1="42.5" x2="84.5" y2="42.5" stroke="#94A3B8" strokeWidth="0.8" />
    <line x1="79" y1="45" x2="84.5" y2="45" stroke="#94A3B8" strokeWidth="0.8" />
    <rect x="82.5" y="44" width="3.5" height="3" fill="#FEF08A" rx="0.5" stroke="#F59E0B" strokeWidth="0.5" />
    <circle cx="15" cy="49" r="5.5" fill="#0F172A" />
    <circle cx="15" cy="49" r="3" fill="#94A3B8" />
    <circle cx="27" cy="49" r="5.5" fill="#0F172A" />
    <circle cx="27" cy="49" r="3" fill="#94A3B8" />
    <circle cx="65" cy="49" r="6" fill="#0F172A" />
    <circle cx="65" cy="49" r="3.2" fill="#94A3B8" />
    <circle cx="80" cy="49" r="6" fill="#0F172A" />
    <circle cx="80" cy="49" r="3.2" fill="#94A3B8" />
  </svg>
);

// 3. Orange Backpack (Ищу работу) - 3D Outdoor expedition backpack
export const OrangeBackpackArt: React.FC<{ className?: string }> = ({ className = 'w-13 h-14' }) => (
  <svg viewBox="0 0 66 78" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="bp-orange" x1="14" y1="14" x2="52" y2="70" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FB923C" />
        <stop offset="0.3" stopColor="#F97316" />
        <stop offset="0.7" stopColor="#EA580C" />
        <stop offset="1" stopColor="#C2410C" />
      </linearGradient>
      <linearGradient id="bp-grey" x1="18" y1="30" x2="48" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#64748B" />
        <stop offset="1" stopColor="#334155" />
      </linearGradient>
    </defs>
    <ellipse cx="33" cy="73" rx="22" ry="4" fill="#000000" fillOpacity="0.22" />
    <path d="M16 22 C16 14, 50 14, 50 22 L52 63 C52 70, 14 70, 14 63 Z" fill="url(#bp-orange)" stroke="#9A3412" strokeWidth="0.8" />
    <path d="M14 16 C14 8, 52 8, 52 16 L53 26 H13 Z" fill="#F97316" stroke="#C2410C" strokeWidth="0.8" />
    <path d="M26 10 C26 6, 40 6, 40 10" stroke="#334155" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M20 30 H46 V55 C46 59, 20 59, 20 55 Z" fill="url(#bp-grey)" stroke="#1E293B" strokeWidth="0.8" />
    <path d="M23 34 L43 40 L23 46 L43 52" stroke="#FEF08A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <rect x="21" y="24" width="2.5" height="12" fill="#0F172A" />
    <rect x="42.5" y="24" width="2.5" height="12" fill="#0F172A" />
    <rect x="20" y="34" width="4.5" height="3" rx="0.5" fill="#E2E8F0" />
    <rect x="41.5" y="34" width="4.5" height="3" rx="0.5" fill="#E2E8F0" />
    <path d="M14 38 H10 V52 H14 Z" fill="#C2410C" stroke="#7C2D12" strokeWidth="0.5" />
    <path d="M52 38 H56 V52 H52 Z" fill="#C2410C" stroke="#7C2D12" strokeWidth="0.5" />
    <path d="M14 58 H52 V65 C52 70, 14 70, 14 65 Z" fill="#7C2D12" />
  </svg>
);

// 4. Silver Minivan (Такси заезд-выезд) - Modern silver family minivan
export const SilverMinivanArt: React.FC<{ className?: string }> = ({ className = 'w-16 h-12' }) => (
  <svg viewBox="0 0 94 58" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="mv-silver" x1="10" y1="16" x2="86" y2="46" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="0.3" stopColor="#F1F5F9" />
        <stop offset="0.65" stopColor="#CBD5E1" />
        <stop offset="1" stopColor="#94A3B8" />
      </linearGradient>
      <linearGradient id="mv-glass" x1="20" y1="18" x2="76" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" stopOpacity="0.6" />
        <stop offset="1" stopColor="#0F172A" stopOpacity="0.85" />
      </linearGradient>
    </defs>
    <ellipse cx="47" cy="49" rx="38" ry="4" fill="#000000" fillOpacity="0.22" />
    <path d="M10 34 L16 22 Q26 16 42 16 L66 18 Q78 21 85 29 L88 38 Q88 43 82 43 H14 Q10 43 10 37 Z" fill="url(#mv-silver)" stroke="#94A3B8" strokeWidth="0.8" />
    <path d="M22 21 H38 V29 H17 L22 21 Z" fill="url(#mv-glass)" />
    <path d="M40 21 H58 V29 H40 V21 Z" fill="url(#mv-glass)" />
    <path d="M60 21 H70 L78 29 H60 V21 Z" fill="url(#mv-glass)" />
    <path d="M84 31 L87 35 L81 37 Z" fill="#FEF08A" stroke="#E2E8F0" strokeWidth="0.5" />
    <rect x="83" y="35" width="4.5" height="4.5" rx="1" fill="#334155" />
    <line x1="18" y1="33" x2="80" y2="33" stroke="#94A3B8" strokeWidth="0.8" />
    <rect x="38" y="31" width="4.5" height="1.5" rx="0.5" fill="#64748B" />
    <rect x="56" y="31" width="4.5" height="1.5" rx="0.5" fill="#64748B" />
    <circle cx="26" cy="42" r="7.5" fill="#0F172A" />
    <circle cx="26" cy="42" r="4.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
    <circle cx="72" cy="42" r="7.5" fill="#0F172A" />
    <circle cx="72" cy="42" r="4.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
  </svg>
);

// 5. Blue Heavy Truck (Грузоперевозка) - Robust royal blue freight cab
export const BlueTruckArt: React.FC<{ className?: string }> = ({ className = 'w-15 h-14' }) => (
  <svg viewBox="0 0 88 66" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="bt-blue" x1="18" y1="12" x2="78" y2="54" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60A5FA" />
        <stop offset="0.3" stopColor="#2563EB" />
        <stop offset="0.75" stopColor="#1D4ED8" />
        <stop offset="1" stopColor="#1E3A8A" />
      </linearGradient>
    </defs>
    <ellipse cx="44" cy="56" rx="38" ry="4" fill="#000000" fillOpacity="0.22" />
    <path d="M12 48 H20 V26 H62 V14 H22 Q12 14 12 26 Z" fill="url(#bt-blue)" stroke="#1D4ED8" strokeWidth="0.8" />
    <rect x="22" y="16" width="38" height="32" rx="2" fill="url(#bt-blue)" stroke="#1E40AF" strokeWidth="0.8" />
    <rect x="62" y="22" width="22" height="26" rx="3" fill="url(#bt-blue)" stroke="#1E40AF" strokeWidth="0.8" />
    <path d="M64 24 H76 L82 32 H64 V24 Z" fill="#38BDF8" fillOpacity="0.6" stroke="#0F172A" strokeWidth="0.8" />
    <rect x="76" y="34" width="7" height="9" rx="1" fill="#1E293B" />
    <rect x="78" y="44" width="5" height="3" rx="0.5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="0.5" />
    <circle cx="32" cy="52" r="6.5" fill="#0F172A" />
    <circle cx="32" cy="52" r="3.5" fill="#CBD5E1" />
    <circle cx="48" cy="52" r="6.5" fill="#0F172A" />
    <circle cx="48" cy="52" r="3.5" fill="#CBD5E1" />
    <circle cx="74" cy="52" r="6.5" fill="#0F172A" />
    <circle cx="74" cy="52" r="3.5" fill="#CBD5E1" />
  </svg>
);
