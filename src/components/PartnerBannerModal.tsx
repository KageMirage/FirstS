'use client';

import React from 'react';
import { X, Phone, MapPin, Calendar, Clock, ShieldCheck, Stethoscope, Building, CheckCircle2 } from 'lucide-react';
import { useUI } from '../hooks/useUI';

export const PartnerBannerModal: React.FC = () => {
  const { isPartnerBannerOpen, selectedBannerType, closePartnerBanner } = useUI();

  if (!isPartnerBannerOpen) return null;

  const isAizaMed = selectedBannerType === 'aiza-med';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" id="modal-partner-banner">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
        
        {/* Header */}
        <div className={`p-6 text-white ${isAizaMed ? 'bg-gradient-to-r from-[#0288d1] to-[#00838f]' : 'bg-gradient-to-r from-gray-900 to-slate-800'} relative`}>
          <button
            onClick={closePartnerBanner}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              {isAizaMed ? <Stethoscope className="w-6 h-6" /> : <Building className="w-6 h-6" />}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-200">
                Официальный партнер Adverts PRO
              </span>
              <h3 className="text-xl font-black">
                {isAizaMed ? 'Медицинский Центр «АЙЗА-МЕД»' : 'VIP Недвижимость и Аренда Домов'}
              </h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isAizaMed ? (
            <>
              <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-4 text-xs text-cyan-900 space-y-2">
                <p className="font-bold text-sm text-[#00838f]">Услуги клиники:</p>
                <div className="grid grid-cols-2 gap-2">
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Гинеколог</p>
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Терапевт</p>
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Кардиолог</p>
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Невролог</p>
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Стоматолог</p>
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> УЗИ и ЭКГ</p>
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Все виды анализов</p>
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Дневной стационар</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-4 rounded-2xl">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900">Москва, Огородный проезд 25/20</p>
                    <p className="text-gray-500">м. Бутырская (2-й выход, 3 мин), м. Фонвизинская (5 мин)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <Clock className="w-4 h-4 text-gray-500 shrink-0" />
                  <span>Ежедневно с 08:00 до 21:00</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <a
                  href="tel:+79688714714"
                  className="flex items-center justify-center gap-2 py-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+7 968 871 47 14</span>
                </a>
                <a
                  href="tel:+79586439826"
                  className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+7 958 643 98 26</span>
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-600 leading-relaxed">
                Большой выбор комфортных домов, коттеджей и квартир посуточно для отдыха, праздников и долгосрочной аренды с гарантией безопасности.
              </p>
              <div className="p-4 bg-gray-50 rounded-2xl space-y-2 text-xs">
                <p className="font-bold text-gray-900">Преимущества:</p>
                <p>• Прямые контакты с владельцами без посредников</p>
                <p>• Проверенные объекты и реальные фотографии</p>
                <p>• Удобное бронирование от 24 часов</p>
              </div>
              <button
                onClick={closePartnerBanner}
                className="w-full py-3 bg-[#1a73e8] text-white font-bold text-xs rounded-xl hover:bg-[#1557b0] transition-colors"
              >
                Смотреть все дома в каталоге
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
