'use client';

import React from 'react';
import { Phone } from 'lucide-react';
import { useUI } from '../hooks/useUI';

interface SideBannersProps {
  count?: number;
}

export const SideBanners: React.FC<SideBannersProps> = ({ count = 4 }) => {
  const { openPartnerBanner } = useUI();

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4" id="side-banners-column">
      
      {/* Banner 1: Real Estate / House Villa */}
      {count >= 1 && (
        <div 
          id="side-banner-villa-1"
          onClick={() => openPartnerBanner('real-estate')}
          className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer border border-gray-100 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] bg-gray-100"
        >
          <img
            src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&auto=format&fit=crop&q=80"
            alt="VIP Коттедж"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
            <span className="bg-[#1a73e8] text-white text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mb-1 shadow-sm">
              VIP Недвижимость
            </span>
            <h5 className="font-bold text-sm leading-tight text-white drop-shadow-sm">
              Элитные коттеджи и дома посуточно
            </h5>
            <p className="text-[11px] text-gray-200 mt-0.5">Бассейн, сауна, терраса • Москва</p>
          </div>
        </div>
      )}

      {/* Banner 2: Medical Center "АЙЗА-МЕД" (exact match to screenshot design!) */}
      {count >= 2 && (
        <div 
          id="side-banner-aiza-med-1"
          onClick={() => openPartnerBanner('aiza-med')}
          className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-[#0288d1] via-[#0097a7] to-[#00838f] text-white p-4 group border border-cyan-400/30"
        >
          {/* Top Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-black text-xs">
              +
            </div>
            <div>
              <p className="text-[10px] tracking-wider uppercase font-semibold text-cyan-100">Медицинский центр</p>
              <h4 className="text-base font-black tracking-tight text-white uppercase drop-shadow">
                АЙЗА - МЕД
              </h4>
            </div>
          </div>

          {/* Services List & Doctor Image */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-white/95 my-2.5">
            <div className="space-y-1">
              <p className="flex items-center gap-1.5">• ГИНЕКОЛОГ</p>
              <p className="flex items-center gap-1.5">• ТЕРАПЕВТ</p>
              <p className="flex items-center gap-1.5">• КАРДИОЛОГ</p>
              <p className="flex items-center gap-1.5">• НЕВРОЛОГ</p>
              <p className="flex items-center gap-1.5">• СТОМАТОЛОГ</p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-1.5">• УЗИ, ЭКГ</p>
              <p className="flex items-center gap-1.5">• ВСЕ ВИДЫ</p>
              <p className="pl-2.5 text-cyan-200">АНАЛИЗОВ</p>
              <p className="flex items-center gap-1.5">• ДНЕВНОЙ</p>
              <p className="pl-2.5 text-cyan-200">СТАЦИОНАР</p>
            </div>
          </div>

          {/* Metro & Address */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-2 text-[9px] text-cyan-100 space-y-0.5 my-2 border border-white/10">
            <p className="font-bold text-white">м. Бутырская 2-й выход 3 мин</p>
            <p>метро Фонвизинская 5 мин</p>
            <p className="text-cyan-200">Адрес: Огородный проезд 25/20</p>
          </div>

          {/* Contacts */}
          <div className="bg-emerald-500/90 text-white rounded-xl p-2 text-[10px] font-bold space-y-0.5">
            <p className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 shrink-0" />
              <span>+7 968 871 47 14</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 shrink-0" />
              <span>+7 958 643 98 26</span>
            </p>
          </div>

          <div className="mt-2 text-center">
            <span className="text-[9px] text-white/80 underline group-hover:text-white">
              @tvoi_stomatolog_v_moskve
            </span>
          </div>
        </div>
      )}

      {/* Banner 3: Real Estate / Villa Repeat */}
      {count >= 3 && (
        <div 
          id="side-banner-villa-2"
          onClick={() => openPartnerBanner('real-estate')}
          className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer border border-gray-100 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] bg-gray-100"
        >
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80"
            alt="Аренда дома"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mb-1 shadow-sm">
              Проверено
            </span>
            <h5 className="font-bold text-sm leading-tight text-white drop-shadow-sm">
              Сдается дом посуточно
            </h5>
            <p className="text-[11px] text-gray-200 mt-0.5">Квартиры и мейманкана от хозяина</p>
          </div>
        </div>
      )}

      {/* Banner 4: Medical Center Repeat */}
      {count >= 4 && (
        <div 
          id="side-banner-aiza-med-2"
          onClick={() => openPartnerBanner('aiza-med')}
          className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-[#0288d1] via-[#0097a7] to-[#00838f] text-white p-4 group border border-cyan-400/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white font-black text-xs">
              +
            </div>
            <div>
              <h4 className="text-sm font-black tracking-tight text-white uppercase">
                АЙЗА - МЕД
              </h4>
              <p className="text-[9px] text-cyan-100">Медицинские консультации и анализы</p>
            </div>
          </div>
          <div className="bg-emerald-500 text-white rounded-lg p-1.5 text-center text-[10px] font-bold">
            Записаться на прием: +7 968 871 47 14
          </div>
        </div>
      )}

    </aside>
  );
};

