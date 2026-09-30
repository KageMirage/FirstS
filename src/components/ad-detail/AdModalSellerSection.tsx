'use client';

import React from 'react';
import { Eye, ShieldCheck, User as UserIcon, Phone } from 'lucide-react';
import { AdItem } from '../../types/api';

interface AdModalSellerSectionProps {
  selectedAd: AdItem;
  onViewSeller: () => void;
  onCall: () => void;
  onWhatsApp: () => void;
  onTelegram?: () => void;
}

export const AdModalSellerSection: React.FC<AdModalSellerSectionProps> = ({
  selectedAd,
  onViewSeller,
  onCall,
  onWhatsApp,
  onTelegram,
}) => {
  return (
    <>
      {/* Seller Card */}
      <div className="p-4 rounded-2xl border border-gray-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            {selectedAd.user?.avatar ? (
              <img
                src={selectedAd.user.avatar}
                alt={selectedAd.user?.full_name || 'Seller'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#1a73e8]/10 text-[#1a73e8] flex items-center justify-center font-bold">
                {selectedAd.user?.full_name ? selectedAd.user.full_name.charAt(0).toUpperCase() : 'П'}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-gray-900">
                {selectedAd.user?.full_name || 'Продавец'}
              </h4>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xs text-gray-500">Проверенный продавец Adverts PRO</p>
          </div>
        </div>

        <div className="text-right text-xs text-gray-400">
          <p className="flex items-center gap-1 justify-end">
            <Eye className="w-3.5 h-3.5" />
            <span>{selectedAd.views || 142} просмотров</span>
          </p>
        </div>
      </div>

      {/* Action Buttons: Seller profile, Call, WhatsApp, Telegram */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
        <button
          onClick={onViewSeller}
          className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          id="btn-modal-seller"
        >
          <UserIcon className="w-4 h-4 shrink-0" />
          <span className="truncate">Продавец</span>
        </button>
        <button
          onClick={onCall}
          className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs sm:text-sm transition-all cursor-pointer"
          id="btn-modal-call"
        >
          <Phone className="w-4 h-4 text-[#1a73e8] shrink-0" />
          <span className="truncate">Позвонить</span>
        </button>
        <button
          onClick={onWhatsApp}
          className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          id="btn-modal-whatsapp"
        >
          <span className="truncate">WhatsApp</span>
        </button>
        {onTelegram && (
          <button
            onClick={onTelegram}
            className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-[#229ED9] hover:bg-[#1d8bc0] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
            id="btn-modal-telegram"
          >
            <span className="truncate">Telegram</span>
          </button>
        )}
      </div>
    </>
  );
};
