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
    {/* Ground Shadow */}
    <ellipse cx="42" cy="74" rx="34" ry="4" fill="#000000" fillOpacity="0.22" />
    {/* Sturdy Curved Leather Handle */}
    <path d="M30 25 C30 14, 54 14, 54 25" stroke="#3E1A04" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M30 25 C30 15.5, 54 15.5, 54 25" stroke="#92400E" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Handle Gold Mounts */}
    <rect x="27" y="23" width="7" height="5" rx="2" fill="url(#bf-gold)" stroke="#78350F" strokeWidth="0.5" />
    <rect x="50" y="23" width="7" height="5" rx="2" fill="url(#bf-gold)" stroke="#78350F" strokeWidth="0.5" />
    {/* Main Briefcase Body */}
    <rect x="10" y="26" width="64" height="46" rx="7" fill="url(#bf-body)" stroke="#4A1E06" strokeWidth="1" />
    {/* Perimeter Stitching Line */}
    <rect x="12.5" y="28.5" width="59" height="41" rx="5" stroke="#FDE68A" strokeOpacity="0.4" strokeWidth="0.8" strokeDasharray="2.5 1.5" fill="none" />
    {/* Vertical Leather Belts */}
    <rect x="22" y="26" width="5" height="46" fill="url(#bf-strap)" />
    <rect x="22" y="52" width="5" height="5" rx="1" fill="url(#bf-gold)" />
    <rect x="57" y="26" width="5" height="46" fill="url(#bf-strap)" />
    <rect x="57" y="52" width="5" height="5" rx="1" fill="url(#bf-gold)" />
    {/* Main Flap with Curved Contour */}
    <path d="M10 26 H74 V46 Q74 52 66 54 L46 58 Q42 59 38 58 L18 54 Q10 52 10 46 Z" fill="url(#bf-flap)" stroke="#4A1E06" strokeWidth="0.8" />
    {/* Flap Edge Stitching */}
    <path d="M12.5 28 H71.5 V45 Q71.5 50.5 64 52.5 L45 56.5 Q42 57.2 39 56.5 L20 52.5 Q12.5 50.5 12.5 45 Z" stroke="#FDE68A" strokeOpacity="0.45" strokeWidth="0.8" strokeDasharray="2.5 1.5" fill="none" />
    {/* Center Polished Brass Clasp */}
    <rect x="37" y="49" width="10" height="12" rx="2.5" fill="url(#bf-gold)" stroke="#78350F" strokeWidth="0.6" />
    <circle cx="42" cy="54" r="1.8" fill="#3E1A04" />
    <rect x="41.2" y="54" width="1.6" height="3.5" fill="#3E1A04" rx="0.5" />
    {/* Bottom Corner Protective Guards */}
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
    {/* Shadow */}
    <ellipse cx="46" cy="53" rx="42" ry="4" fill="#000000" fillOpacity="0.22" />
    {/* White Cargo Container */}
    <rect x="5" y="15" width="49" height="30" rx="3" fill="url(#wt-trailer)" stroke="#94A3B8" strokeWidth="0.8" />
    {/* Corrugated Trailer Ribs */}
    <line x1="14" y1="16" x2="14" y2="44" stroke="#E2E8F0" strokeWidth="1.2" />
    <line x1="23" y1="16" x2="23" y2="44" stroke="#E2E8F0" strokeWidth="1.2" />
    <line x1="32" y1="16" x2="32" y2="44" stroke="#E2E8F0" strokeWidth="1.2" />
    <line x1="41" y1="16" x2="41" y2="44" stroke="#E2E8F0" strokeWidth="1.2" />
    <line x1="50" y1="16" x2="50" y2="44" stroke="#E2E8F0" strokeWidth="1.2" />
    {/* Trailer Chassis & Mudguard */}
    <rect x="8" y="44" width="43" height="4" fill="#334155" />
    {/* Modern Truck Cab with Roof Fairing */}
    <path d="M52 23 H66 L78 28 L84 36 L86 46 Q86 48 83 48 H52 Z" fill="url(#wt-cab)" stroke="#94A3B8" strokeWidth="0.8" />
    {/* Aerodynamic Roof Spoiler */}
    <path d="M54 23 L63 15 L70 23 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.5" />
    {/* Tinted Windshield */}
    <path d="M66 25 L76 29 L76 36 H63 L63 25 Z" fill="#38BDF8" fillOpacity="0.55" stroke="#334155" strokeWidth="0.8" />
    {/* Side Driver Window */}
    <rect x="55" y="25" width="7" height="9" rx="1" fill="#38BDF8" fillOpacity="0.45" stroke="#334155" strokeWidth="0.6" />
    {/* Front Radiator Grille */}
    <rect x="78" y="38" width="7.5" height="9" rx="1.5" fill="#1E293B" />
    <line x1="79" y1="40" x2="84.5" y2="40" stroke="#94A3B8" strokeWidth="0.8" />
    <line x1="79" y1="42.5" x2="84.5" y2="42.5" stroke="#94A3B8" strokeWidth="0.8" />
    <line x1="79" y1="45" x2="84.5" y2="45" stroke="#94A3B8" strokeWidth="0.8" />
    {/* Headlights with glow */}
    <rect x="82.5" y="44" width="3.5" height="3" fill="#FEF08A" rx="0.5" stroke="#F59E0B" strokeWidth="0.5" />
    {/* Heavy-Duty Wheels */}
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
    {/* Shadow */}
    <ellipse cx="33" cy="73" rx="22" ry="4" fill="#000000" fillOpacity="0.22" />
    {/* Main Rucksack Body */}
    <path d="M16 22 C16 14, 50 14, 50 22 L52 63 C52 70, 14 70, 14 63 Z" fill="url(#bp-orange)" stroke="#9A3412" strokeWidth="0.8" />
    {/* Top Top-Lid Hood */}
    <path d="M14 16 C14 8, 52 8, 52 16 L53 26 H13 Z" fill="#F97316" stroke="#C2410C" strokeWidth="0.8" />
    {/* Top Carrying Grab Loop */}
    <path d="M26 10 C26 6, 40 6, 40 10" stroke="#334155" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Center Charcoal Organizer Pocket */}
    <path d="M20 30 H46 V55 C46 59, 20 59, 20 55 Z" fill="url(#bp-grey)" stroke="#1E293B" strokeWidth="0.8" />
    {/* Neon Trekking Bungee Cords */}
    <path d="M23 34 L43 40 L23 46 L43 52" stroke="#FEF08A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* Quick-release Buckle Straps */}
    <rect x="21" y="24" width="2.5" height="12" fill="#0F172A" />
    <rect x="42.5" y="24" width="2.5" height="12" fill="#0F172A" />
    <rect x="20" y="34" width="4.5" height="3" rx="0.5" fill="#E2E8F0" />
    <rect x="41.5" y="34" width="4.5" height="3" rx="0.5" fill="#E2E8F0" />
    {/* Elastic Side Water Bottle Pockets */}
    <path d="M14 38 H10 V52 H14 Z" fill="#C2410C" stroke="#7C2D12" strokeWidth="0.5" />
    <path d="M52 38 H56 V52 H52 Z" fill="#C2410C" stroke="#7C2D12" strokeWidth="0.5" />
    {/* Reinforced Bottom Base */}
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
    {/* Shadow */}
    <ellipse cx="47" cy="49" rx="38" ry="4" fill="#000000" fillOpacity="0.22" />
    {/* Aerodynamic Body */}
    <path d="M10 34 L16 22 Q26 16 42 16 L66 18 Q78 21 85 29 L88 38 Q88 43 82 43 H14 Q10 43 10 37 Z" fill="url(#mv-silver)" stroke="#94A3B8" strokeWidth="0.8" />
    {/* Windows */}
    <path d="M22 21 H38 V29 H17 L22 21 Z" fill="url(#mv-glass)" />
    <path d="M40 21 H58 V29 H40 V21 Z" fill="url(#mv-glass)" />
    <path d="M60 21 H70 L78 29 H60 V21 Z" fill="url(#mv-glass)" />
    {/* Chrome Front Details */}
    <path d="M84 31 L87 35 L81 37 Z" fill="#FEF08A" stroke="#E2E8F0" strokeWidth="0.5" />
    <rect x="83" y="35" width="4.5" height="4.5" rx="1" fill="#334155" />
    {/* Body Line & Handles */}
    <line x1="18" y1="33" x2="80" y2="33" stroke="#94A3B8" strokeWidth="0.8" />
    <rect x="38" y="31" width="4.5" height="1.5" rx="0.5" fill="#64748B" />
    <rect x="56" y="31" width="4.5" height="1.5" rx="0.5" fill="#64748B" />
    {/* Alloy Wheels */}
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
    {/* Shadow */}
    <ellipse cx="46" cy="56" rx="36" ry="4" fill="#000000" fillOpacity="0.25" />
    {/* Truck Cab Structure */}
    <path d="M18 48 V23 Q18 16 26 15 H58 Q68 15 72 21 L80 34 L82 48 Q82 51 78 51 H22 Q18 51 18 48 Z" fill="url(#bt-blue)" stroke="#1E3A8A" strokeWidth="0.8" />
    {/* Windshield */}
    <path d="M28 19 H58 L67 32 H28 Z" fill="#38BDF8" fillOpacity="0.45" stroke="#0F172A" strokeWidth="0.8" />
    {/* Sunvisor */}
    <rect x="25" y="17" width="38" height="3" rx="1" fill="#0F172A" />
    {/* Radiator Grille */}
    <rect x="44" y="35" width="34" height="13" rx="2" fill="#1E293B" stroke="#475569" strokeWidth="0.8" />
    <line x1="48" y1="38" x2="74" y2="38" stroke="#94A3B8" strokeWidth="1" />
    <line x1="48" y1="41" x2="74" y2="41" stroke="#94A3B8" strokeWidth="1" />
    <line x1="48" y1="44" x2="74" y2="44" stroke="#94A3B8" strokeWidth="1" />
    {/* Headlights */}
    <rect x="72" y="46" width="7" height="3.5" rx="1" fill="#FEF08A" stroke="#F59E0B" strokeWidth="0.5" />
    <rect x="22" y="46" width="7" height="3.5" rx="1" fill="#FEF08A" stroke="#F59E0B" strokeWidth="0.5" />
    {/* Wheels */}
    <circle cx="30" cy="51" r="7" fill="#0F172A" />
    <circle cx="30" cy="51" r="3.5" fill="#94A3B8" />
    <circle cx="72" cy="51" r="7" fill="#0F172A" />
    <circle cx="72" cy="51" r="3.5" fill="#94A3B8" />
  </svg>
);

// 6. Yellow Taxi Sedan (Москва-Бишкек) - Taxi with checkers and roof light
export const YellowTaxiArt: React.FC<{ className?: string }> = ({ className = 'w-16 h-12' }) => (
  <svg viewBox="0 0 90 58" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="yt-yellow" x1="12" y1="18" x2="82" y2="46" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEF08A" />
        <stop offset="0.35" stopColor="#FACC15" />
        <stop offset="0.75" stopColor="#EAB308" />
        <stop offset="1" stopColor="#CA8A04" />
      </linearGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="46" cy="49" rx="36" ry="4" fill="#000000" fillOpacity="0.22" />
    {/* Taxi Roof Light */}
    <rect x="38" y="14" width="16" height="5.5" rx="2" fill="#F97316" stroke="#C2410C" strokeWidth="0.6" />
    <rect x="40" y="15" width="12" height="3.5" rx="1" fill="#FEF08A" />
    <text x="41" y="17.7" fontSize="2.8" fontWeight="900" fill="#000" letterSpacing="0.5">TAXI</text>
    {/* Sleek Sedan Body */}
    <path d="M12 36 L18 25 Q28 19 40 19 L60 19 Q70 23 76 29 L82 36 Q84 39 82 42 H14 Q10 42 12 36 Z" fill="url(#yt-yellow)" stroke="#CA8A04" strokeWidth="0.8" />
    {/* Windows */}
    <path d="M22 23 H38 V29 H18 L22 23 Z" fill="#38BDF8" fillOpacity="0.45" stroke="#0F172A" strokeWidth="0.6" />
    <path d="M40 23 H56 L64 29 H40 V23 Z" fill="#38BDF8" fillOpacity="0.45" stroke="#0F172A" strokeWidth="0.6" />
    {/* Distinctive Checker Stripe */}
    <g transform="translate(26, 32)">
      <rect x="0" y="0" width="3.2" height="2.2" fill="#000" />
      <rect x="3.2" y="0" width="3.2" height="2.2" fill="#FFF" />
      <rect x="6.4" y="0" width="3.2" height="2.2" fill="#000" />
      <rect x="9.6" y="0" width="3.2" height="2.2" fill="#FFF" />
      <rect x="12.8" y="0" width="3.2" height="2.2" fill="#000" />
      <rect x="16" y="0" width="3.2" height="2.2" fill="#FFF" />
      <rect x="19.2" y="0" width="3.2" height="2.2" fill="#000" />
      <rect x="22.4" y="0" width="3.2" height="2.2" fill="#FFF" />
      <rect x="0" y="2.2" width="3.2" height="2.2" fill="#FFF" />
      <rect x="3.2" y="2.2" width="3.2" height="2.2" fill="#000" />
      <rect x="6.4" y="2.2" width="3.2" height="2.2" fill="#FFF" />
      <rect x="9.6" y="2.2" width="3.2" height="2.2" fill="#000" />
      <rect x="12.8" y="2.2" width="3.2" height="2.2" fill="#FFF" />
      <rect x="16" y="2.2" width="3.2" height="2.2" fill="#000" />
      <rect x="19.2" y="2.2" width="3.2" height="2.2" fill="#FFF" />
      <rect x="22.4" y="2.2" width="3.2" height="2.2" fill="#000" />
    </g>
    {/* Headlight */}
    <path d="M78 34 L82 37 L78 39 Z" fill="#FEF08A" stroke="#F59E0B" strokeWidth="0.5" />
    {/* Wheels */}
    <circle cx="26" cy="42" r="6.5" fill="#0F172A" />
    <circle cx="26" cy="42" r="3.8" fill="#E2E8F0" />
    <circle cx="70" cy="42" r="6.5" fill="#0F172A" />
    <circle cx="70" cy="42" r="3.8" fill="#E2E8F0" />
  </svg>
);

// 7. Baby Pram Stroller (Продам товар) - Classic luxury black pram with chrome spoke wheels
export const StrollerArt: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="st-hood" x1="18" y1="18" x2="56" y2="46" gradientUnits="userSpaceOnUse">
        <stop stopColor="#334155" />
        <stop offset="0.5" stopColor="#1E293B" />
        <stop offset="1" stopColor="#0F172A" />
      </linearGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="38" cy="66" rx="26" ry="3.5" fill="#000000" fillOpacity="0.22" />
    {/* Push Handlebar with Grip */}
    <path d="M12 22 L26 46" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M9 19 L15 24" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
    {/* Bassinet Canopy Hood */}
    <path d="M24 38 C24 20, 52 20, 56 38 Z" fill="url(#st-hood)" stroke="#475569" strokeWidth="0.8" />
    {/* Canopy Trim */}
    <path d="M26 38 C26 23, 50 23, 54 38" stroke="#E2E8F0" strokeWidth="1" fill="none" />
    {/* Bassinet Body Tub */}
    <path d="M22 38 H60 Q60 48 52 50 H30 Q22 48 22 38 Z" fill="url(#st-hood)" stroke="#475569" strokeWidth="0.8" />
    {/* Chrome X-Frame Suspension */}
    <line x1="24" y1="48" x2="52" y2="59" stroke="#CBD5E1" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="52" y1="48" x2="24" y2="59" stroke="#CBD5E1" strokeWidth="2.2" strokeLinecap="round" />
    {/* Classic Large Spoked Wheels */}
    <circle cx="24" cy="59" r="8" fill="none" stroke="#0F172A" strokeWidth="2.8" />
    <circle cx="24" cy="59" r="6" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
    <circle cx="24" cy="59" r="2.2" fill="#0F172A" />
    <circle cx="52" cy="59" r="8" fill="none" stroke="#0F172A" strokeWidth="2.8" />
    <circle cx="52" cy="59" r="6" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
    <circle cx="52" cy="59" r="2.2" fill="#0F172A" />
  </svg>
);

// 8. White Luxury SUV (Продам авто) - Sleek white crossover SUV
export const WhiteSuvArt: React.FC<{ className?: string }> = ({ className = 'w-16 h-12' }) => (
  <svg viewBox="0 0 94 58" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="suv-white" x1="12" y1="16" x2="86" y2="46" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="0.45" stopColor="#F8FAFC" />
        <stop offset="0.8" stopColor="#E2E8F0" />
        <stop offset="1" stopColor="#CBD5E1" />
      </linearGradient>
      <linearGradient id="suv-window" x1="24" y1="18" x2="72" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" stopOpacity="0.5" />
        <stop offset="1" stopColor="#0F172A" stopOpacity="0.85" />
      </linearGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="48" cy="49" rx="38" ry="4" fill="#000000" fillOpacity="0.22" />
    {/* Sporty SUV Body */}
    <path d="M12 35 L18 23 Q28 17 44 17 L66 19 Q78 22 84 29 L88 37 Q88 43 82 43 H16 Q12 43 12 37 Z" fill="url(#suv-white)" stroke="#94A3B8" strokeWidth="0.8" />
    {/* Roof Rails */}
    <line x1="32" y1="16" x2="64" y2="18" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
    {/* Dark Glass Windows */}
    <path d="M24 21 H40 V29 H20 L24 21 Z" fill="url(#suv-window)" />
    <path d="M42 21 H58 V29 H42 V21 Z" fill="url(#suv-window)" />
    <path d="M60 21 H70 L78 29 H60 V21 Z" fill="url(#suv-window)" />
    {/* Dual Kidney Grille */}
    <rect x="81" y="33" width="3" height="4.5" rx="1" fill="#0F172A" stroke="#94A3B8" strokeWidth="0.5" />
    <rect x="85" y="33" width="3" height="4.5" rx="1" fill="#0F172A" stroke="#94A3B8" strokeWidth="0.5" />
    {/* LED Angel Eye Headlights */}
    <path d="M76 30 L82 32 L78 34 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="0.5" />
    {/* Sport Alloy Wheels */}
    <circle cx="28" cy="42" r="8" fill="#0F172A" />
    <circle cx="28" cy="42" r="4.8" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.6" />
    <circle cx="72" cy="42" r="8" fill="#0F172A" />
    <circle cx="72" cy="42" r="4.8" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.6" />
  </svg>
);

// 9. Modern Glass Skyscraper (Недвижимость) - Futuristic architectural tower
export const SkyscraperArt: React.FC<{ className?: string }> = ({ className = 'w-14 h-15' }) => (
  <svg viewBox="0 0 68 84" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="sky-glass" x1="16" y1="12" x2="54" y2="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#BAE6FD" />
        <stop offset="0.3" stopColor="#38BDF8" />
        <stop offset="0.7" stopColor="#0284C7" />
        <stop offset="1" stopColor="#0369A1" />
      </linearGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="34" cy="80" rx="26" ry="3.5" fill="#000000" fillOpacity="0.22" />
    {/* Main Tower Mass */}
    <path d="M19 78 V26 L34 15 L49 26 V78 Z" fill="url(#sky-glass)" stroke="#0284C7" strokeWidth="0.8" />
    {/* Wing Tower Side Blocks */}
    <path d="M49 78 V38 L59 44 V78 Z" fill="#0369A1" stroke="#0284C7" strokeWidth="0.8" />
    <path d="M9 78 V48 L19 42 V78 Z" fill="#38BDF8" fillOpacity="0.8" stroke="#0284C7" strokeWidth="0.8" />
    {/* Architectural Vertical Ribs */}
    <line x1="25" y1="21" x2="25" y2="78" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="0.8" />
    <line x1="34" y1="16" x2="34" y2="78" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="1" />
    <line x1="43" y1="21" x2="43" y2="78" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="0.8" />
    {/* Floor Horizontal Dividers */}
    <line x1="19" y1="30" x2="49" y2="30" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="0.8" />
    <line x1="19" y1="38" x2="59" y2="38" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="0.8" />
    <line x1="9" y1="46" x2="59" y2="46" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="0.8" />
    <line x1="9" y1="54" x2="59" y2="54" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="0.8" />
    <line x1="9" y1="62" x2="59" y2="62" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="0.8" />
    <line x1="9" y1="70" x2="59" y2="70" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="0.8" />
    {/* Rooftop Antenna Spire */}
    <line x1="34" y1="15" x2="34" y2="6" stroke="#E2E8F0" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="34" cy="6" r="1.8" fill="#EF4444" />
  </svg>
);

// 10. Grocery Paper Bag (Продукты питания) - Overflowing fresh vegetables & baguette
export const GroceryBagArt: React.FC<{ className?: string }> = ({ className = 'w-14 h-15' }) => (
  <svg viewBox="0 0 74 78" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="gb-bag" x1="18" y1="34" x2="58" y2="76" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D97706" />
        <stop offset="0.45" stopColor="#B45309" />
        <stop offset="1" stopColor="#92400E" />
      </linearGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="38" cy="75" rx="22" ry="3.5" fill="#000000" fillOpacity="0.22" />
    {/* Crispy Baguette */}
    <path d="M46 38 L57 16 C58 14, 61 15, 60 18 L50 40 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
    <line x1="51" y1="25" x2="54" y2="28" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="54" y1="20" x2="57" y2="23" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />
    {/* Fresh Green Foliage & Broccoli */}
    <path d="M24 38 L18 15 C18 13, 21 13, 23 16 L28 38 Z" fill="#22C55E" />
    <path d="M28 38 L26 11 C27 9, 30 10, 30 13 L32 38 Z" fill="#16A34A" />
    <path d="M32 38 L36 13 C37 11, 40 12, 39 15 L36 38 Z" fill="#15803D" />
    {/* Orange Carrot */}
    <path d="M38 36 L44 21 C45 19, 48 20, 46 23 L40 38 Z" fill="#EA580C" />
    <path d="M44 21 L46 15" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
    {/* Red Tomato */}
    <circle cx="30" cy="36" r="6.5" fill="#EF4444" />
    <path d="M30 30 L30 28" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round" />
    {/* Kraft Paper Grocery Bag */}
    <path d="M18 36 L20 73 H56 L58 36 Z" fill="url(#gb-bag)" stroke="#78350F" strokeWidth="0.8" />
    {/* Serrated Top Bag Edge */}
    <path d="M18 36 L22 39 L26 36 L30 39 L34 36 L38 39 L42 36 L46 39 L50 36 L54 39 L58 36" stroke="#78350F" strokeWidth="0.8" fill="none" />
    {/* Realistic Paper Creases */}
    <path d="M26 38 L30 71" stroke="#78350F" strokeOpacity="0.4" strokeWidth="1.2" />
    <path d="M50 38 L46 71" stroke="#78350F" strokeOpacity="0.4" strokeWidth="1.2" />
  </svg>
);

// 11. Kyrgyz Kalpak (Товары Кыргызста) - Authentic white felt Ak-kalpak with black national embroidery
export const KyrgyzKalpakArt: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="kp-felt" x1="18" y1="12" x2="56" y2="54" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="0.75" stopColor="#F8FAFC" />
        <stop offset="1" stopColor="#E2E8F0" />
      </linearGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="37" cy="65" rx="24" ry="4" fill="#000000" fillOpacity="0.22" />
    {/* 4 Wool Felt Lobes / Crown */}
    <path d="M37 12 C30 24, 18 38, 18 53 C28 56, 46 56, 56 53 C56 38, 44 24, 37 12 Z" fill="url(#kp-felt)" stroke="#CBD5E1" strokeWidth="0.8" />
    {/* Velvet Seam Ribs */}
    <path d="M37 12 V54" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />
    <path d="M37 12 C32 25, 26 39, 24 53" stroke="#0F172A" strokeWidth="1.8" />
    <path d="M37 12 C42 25, 48 39, 50 53" stroke="#0F172A" strokeWidth="1.8" />
    {/* Authentic Kyrgyz National Black Embroidery Ornament (Оймо) */}
    <path d="M32 33 C32 28, 37 28, 37 35 C37 28, 42 28, 42 33 C42 39, 37 43, 37 46 C37 43, 32 39, 32 33 Z" fill="#0F172A" />
    <circle cx="37" cy="31" r="1.6" fill="#FFFFFF" />
    {/* Peak & Tassel (Чоок) */}
    <circle cx="37" cy="12" r="2.5" fill="#0F172A" />
    <path d="M37 10 L39 5" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
    {/* Upturned Black Velvet Brim */}
    <path d="M14 51 C14 48, 60 48, 60 51 C60 60, 14 60, 14 51 Z" fill="#0F172A" stroke="#1E293B" strokeWidth="1" />
    <path d="M16 51 C26 54, 48 54, 58 51" stroke="#475569" strokeWidth="0.8" fill="none" />
  </svg>
);

// 12. Espresso Coffee Machine (Техника и Электроника) - Dual spouts and cup
export const CoffeeMachineArt: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="cm-body" x1="18" y1="14" x2="56" y2="62" gradientUnits="userSpaceOnUse">
        <stop stopColor="#334155" />
        <stop offset="0.5" stopColor="#1E293B" />
        <stop offset="1" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="cm-chrome" x1="22" y1="22" x2="52" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F8FAFC" />
        <stop offset="0.5" stopColor="#CBD5E1" />
        <stop offset="1" stopColor="#94A3B8" />
      </linearGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="37" cy="65" rx="22" ry="3.5" fill="#000000" fillOpacity="0.22" />
    {/* Machine Body */}
    <rect x="20" y="15" width="34" height="47" rx="5" fill="url(#cm-body)" stroke="#475569" strokeWidth="0.8" />
    {/* Top Bean Hopper */}
    <rect x="24" y="11" width="26" height="4.5" rx="1.5" fill="#475569" />
    {/* Digital Display */}
    <rect x="25" y="19" width="24" height="8.5" rx="2" fill="#0284C7" fillOpacity="0.45" stroke="#38BDF8" strokeWidth="0.6" />
    <circle cx="30" cy="23" r="1.3" fill="#38BDF8" />
    <circle cx="37" cy="23" r="1.3" fill="#38BDF8" />
    <circle cx="44" cy="23" r="1.3" fill="#38BDF8" />
    {/* Chrome Center Faceplate */}
    <rect x="25" y="29" width="24" height="19" rx="2" fill="url(#cm-chrome)" />
    {/* Dual Metal Dispenser Spouts */}
    <rect x="33" y="33" width="3" height="5.5" rx="1" fill="#0F172A" />
    <rect x="38" y="33" width="3" height="5.5" rx="1" fill="#0F172A" />
    {/* Coffee Pour Stream & White Espresso Cup */}
    <line x1="34.5" y1="38.5" x2="34.5" y2="44.5" stroke="#78350F" strokeWidth="1.2" />
    <line x1="39.5" y1="38.5" x2="39.5" y2="44.5" stroke="#78350F" strokeWidth="1.2" />
    <path d="M31 44.5 H43 L41 53 H33 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
    {/* Drip Grate */}
    <rect x="22" y="54" width="30" height="6.5" rx="1.5" fill="#64748B" stroke="#94A3B8" strokeWidth="0.8" />
    <line x1="26" y1="57.5" x2="48" y2="57.5" stroke="#0F172A" strokeWidth="1" strokeDasharray="2 1.5" />
  </svg>
);

// 13. Shopping Bags (Интернет магазин) - Vibrant colorful boutique bags
export const ShoppingBagsArt: React.FC<{ className?: string }> = ({ className = 'w-15 h-14' }) => (
  <svg viewBox="0 0 78 74" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="sb-orange" x1="14" y1="28" x2="40" y2="66" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FB923C" />
        <stop offset="1" stopColor="#EA580C" />
      </linearGradient>
      <linearGradient id="sb-cyan" x1="34" y1="22" x2="64" y2="66" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="sb-purple" x1="48" y1="18" x2="70" y2="62" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A78BFA" />
        <stop offset="1" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="40" cy="67" rx="30" ry="3.5" fill="#000000" fillOpacity="0.22" />
    {/* Purple Bag in Background */}
    <path d="M48 24 H68 V63 H48 Z" fill="url(#sb-purple)" stroke="#5B21B6" strokeWidth="0.8" />
    <path d="M54 24 C54 16, 62 16, 62 24" stroke="#EDE9FE" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    {/* Cyan Bag in Middle */}
    <path d="M30 28 H58 V65 H30 Z" fill="url(#sb-cyan)" stroke="#0369A1" strokeWidth="0.8" />
    <path d="M38 28 C38 19, 50 19, 50 28" stroke="#E0F2FE" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    {/* Orange Bag in Foreground */}
    <path d="M14 32 H40 V67 H14 Z" fill="url(#sb-orange)" stroke="#C2410C" strokeWidth="0.8" />
    <path d="M21 32 C21 23, 33 23, 33 32" stroke="#FFEDD5" strokeWidth="2.2" strokeLinecap="round" fill="none" />
  </svg>
);

// 14. Medical Hands Care (Медицинский услуги) - Turquoise hands holding a caring heart
export const MedicalCareArt: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="mc-teal" x1="14" y1="16" x2="60" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2DD4BF" />
        <stop offset="0.45" stopColor="#0D9488" />
        <stop offset="1" stopColor="#0F766E" />
      </linearGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="37" cy="65" rx="22" ry="3.5" fill="#000000" fillOpacity="0.18" />
    {/* Hands Forming Heart Shape */}
    <path
      d="M37 54 C27 46, 13 37, 13 25 C13 18, 19 13, 27 13 C32 13, 35 16, 37 19 C39 16, 42 13, 47 13 C55 13, 61 18, 61 25 C61 37, 47 46, 37 54 Z"
      fill="url(#mc-teal)"
      stroke="#115E59"
      strokeWidth="1.2"
    />
    {/* Flowing Gesture Ribbon */}
    <path
      d="M23 29 C28 35, 34 37, 37 37 C40 37, 46 35, 51 29"
      stroke="#FFFFFF"
      strokeWidth="2.8"
      strokeLinecap="round"
      fill="none"
    />
    {/* Central White Medical Cross */}
    <rect x="35" y="21" width="4" height="13" rx="1.5" fill="#FFFFFF" />
    <rect x="30.5" y="25.5" width="13" height="4" rx="1.5" fill="#FFFFFF" />
  </svg>
);
