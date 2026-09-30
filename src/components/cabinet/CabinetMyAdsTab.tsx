'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ArrowUpCircle, CheckCircle2, Clock } from 'lucide-react';
import { AdCard } from '../AdCard';
import { AdItem } from '../../types/api';
import { apiService } from '../../api/endpoints';
import { useUI } from '../../hooks/useUI';

interface CabinetMyAdsTabProps {
  ads: AdItem[];
  onCreateAd: () => void;
  onRemoveAd: (id: number) => void;
}

export const CabinetMyAdsTab: React.FC<CabinetMyAdsTabProps> = ({
  ads,
  onCreateAd,
  onRemoveAd,
}) => {
  const { notify } = useUI();
  const [liftingIds, setLiftingIds] = useState<number[]>([]);
  const [liftedIds, setLiftedIds] = useState<number[]>([]);

  const handleLift = async (adId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLiftingIds((prev) => [...prev, adId]);
    try {
      await apiService.liftAd(adId);
      setLiftedIds((prev) => [...prev, adId]);
      notify('Объявление успешно поднято в топ!', 'success');
    } catch (err: any) {
      notify(err.response?.data?.detail || 'Не удалось поднять объявление', 'error');
    } finally {
      setLiftingIds((prev) => prev.filter((id) => id !== adId));
    }
  };

  return (
    <div className="space-y-6" id="my-ads-section">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Мои объявления <span className="text-gray-400 font-normal text-lg">({ads.length})</span>
        </h1>
        <button
          type="button"
          id="btn-cabinet-add-ad"
          onClick={onCreateAd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1976D2] hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Добавить</span>
        </button>
      </div>

      {ads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ads.map((ad) => {
            const isLifting = liftingIds.includes(ad.id);
            const isLifted = liftedIds.includes(ad.id);
            const canLift = (ad.can_lift ?? true) && !isLifted;

            return (
              <div key={ad.id} className="relative group flex flex-col">
                <AdCard ad={ad} />

                {/* Status & Quick Action Bar */}
                <div className="mt-2 px-2 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    {ad.is_approved !== false ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                        <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                        <span>Активно</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-md text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>На проверке</span>
                      </span>
                    )}

                    {typeof ad.can_lift_in_hours === 'number' && ad.can_lift_in_hours > 0 && !canLift && (
                      <span className="text-[11px] text-gray-400">
                        Поднятие через {ad.can_lift_in_hours} ч.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {canLift && (
                      <button
                        type="button"
                        onClick={(e) => handleLift(ad.id, e)}
                        disabled={isLifting}
                        className="inline-flex items-center gap-1 text-[#1976D2] hover:underline font-semibold text-xs cursor-pointer disabled:opacity-50"
                      >
                        <ArrowUpCircle className="w-3.5 h-3.5" />
                        <span>{isLifting ? 'Поднимаем...' : 'Поднять'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Вы уверены, что хотите удалить это объявление?')) {
                          onRemoveAd(ad.id);
                        }
                      }}
                      title="Удалить объявление"
                      className="p-1 text-gray-400 hover:text-rose-600 rounded-md transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-gray-100 p-10 sm:p-14 text-center flex flex-col items-center justify-center min-h-[380px] shadow-xs">
          <div className="w-52 h-40 mb-5 relative flex items-center justify-center">
            <svg viewBox="0 0 240 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="120" cy="155" rx="100" ry="16" fill="#f1f5f9" />
              <ellipse cx="70" cy="152" rx="26" ry="8" fill="#e2e8f0" />
              <ellipse cx="70" cy="152" rx="22" ry="6" fill="#38bdf8" fillOpacity="0.4" />
              <rect x="135" y="112" width="46" height="38" rx="6" fill="#3b82f6" />
              <rect x="131" y="108" width="54" height="8" rx="3" fill="#1d4ed8" />
              <path d="M150 110 L95 55 L70 148" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="95" cy="55" r="3" fill="#0284c7" />
              <path d="M70 70 L70 148" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="70" cy="135" r="4" fill="#ef4444" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            У Вас Еще Нет Активных Объявлений
          </h2>
          <p className="text-sm text-gray-500 max-w-sm mb-6">
            Пора что-нибудь продать! Разместите первое объявление прямо сейчас.
          </p>

          <button
            type="button"
            onClick={onCreateAd}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1976D2] hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Подать объявление</span>
          </button>
        </div>
      )}
    </div>
  );
};
