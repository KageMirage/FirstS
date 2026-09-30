'use client';

import React from 'react';
import { ArrowLeft, Phone, ShieldCheck, Share2 } from 'lucide-react';

interface SellerHeaderCardProps {
  name: string;
  phone: string;
  avatar: string;
  adsCount: number;
  onBack: () => void;
  onShare: () => void;
}

export const SellerHeaderCard: React.FC<SellerHeaderCardProps> = ({
  name,
  phone,
  avatar,
  adsCount,
  onBack,
  onShare,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Seller Avatar, Name & Phone */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-xs shrink-0">
          <img
            src={avatar}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 truncate">
              {name}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              <span>Подтвержден</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="text-xs font-semibold text-gray-700 hover:text-[#1976D2] flex items-center gap-1.5 transition-colors bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100"
            >
              <Phone className="w-3.5 h-3.5 text-[#1976D2]" />
              <span>{phone}</span>
            </a>
            {phone && (
              <>
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 px-2.5 py-1 rounded-lg transition-colors inline-flex items-center gap-1"
                  title="Написать в WhatsApp"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`https://t.me/+${phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 px-2.5 py-1 rounded-lg transition-colors inline-flex items-center gap-1"
                  title="Написать в Telegram"
                >
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>Telegram</span>
                </a>
              </>
            )}
          </div>
          <p className="text-xs text-gray-400">
            На сервисе с 2024 года • {adsCount} объявлений
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <button
          type="button"
          onClick={onShare}
          title="Поделиться профилем"
          className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          id="btn-seller-back"
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-sm font-semibold transition cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться</span>
        </button>
      </div>
    </div>
  );
};
