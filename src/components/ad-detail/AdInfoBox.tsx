'use client';

import React, { useState } from 'react';
import { MapPin, Eye, Calendar, Phone, MessageCircle, Send, ArrowUpCircle, CheckCircle, Tag } from 'lucide-react';
import { AdItem } from '../../types/api';
import { apiService } from '../../api/endpoints';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';

interface AdInfoBoxProps {
  ad: AdItem;
  onSellerClick: () => void;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'Не указана';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function formatPrice(priceVal: string | number): string {
  const num = typeof priceVal === 'number' ? priceVal : parseFloat(String(priceVal));
  if (isNaN(num)) return String(priceVal);
  return `${num.toLocaleString('ru-RU')} сом`;
}

export const AdInfoBox: React.FC<AdInfoBoxProps> = ({ ad, onSellerClick }) => {
  const { user } = useAuth();
  const { notify } = useUI();
  const [canLiftState, setCanLiftState] = useState(ad.can_lift ?? false);
  const [isLifting, setIsLifting] = useState(false);

  const isOwner = Boolean(
    user && (user.id === ad.user?.id || (ad.user?.phone_number && user.phone_number === ad.user.phone_number))
  );

  const phone = ad.phone_number || ad.whatsapp_number;
  const whatsappPhone = ad.whatsapp_number || ad.phone_number;
  const cleanWhatsapp = whatsappPhone ? whatsappPhone.replace(/[^0-9]/g, '') : null;
  const telegramTarget = (() => {
    if (ad.telegram_number) {
      const clean = ad.telegram_number.replace(/^@/, '').trim();
      if (/^\+?\d+$/.test(clean)) {
        return clean.startsWith('+') ? clean : `+${clean}`;
      }
      return clean;
    }
    if (phone) {
      const digits = phone.replace(/[^0-9]/g, '');
      return `+${digits}`;
    }
    return null;
  })();

  const handleLift = async () => {
    setIsLifting(true);
    try {
      await apiService.liftAd(ad.id);
      setCanLiftState(false);
      notify('Объявление успешно поднято в топ поиска!', 'success');
    } catch (err: any) {
      notify(err.response?.data?.detail || 'Не удалось поднять объявление', 'error');
    } finally {
      setIsLifting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4" id="ad-info-boxes">
      {/* Top Info Card */}
      <div 
        className="bg-[#f8fafc] rounded-3xl p-5 sm:p-7 border border-gray-100/90 shadow-xs relative overflow-hidden"
        style={ad.color ? { borderLeft: `5px solid ${ad.color}` } : undefined}
      >
        {/* Pinned / VIP badge */}
        {(ad.is_pinned || ad.color) && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-2xs"
            style={{ backgroundColor: ad.color || '#f59e0b' }}
          >
            <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>ТОП Объявление</span>
          </div>
        )}

        {/* Category & Parent Category badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {ad.parent_category && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">
              <Tag className="w-3 h-3 text-gray-400" />
              {ad.parent_category.name}
            </span>
          )}
          {ad.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#1976D2] text-xs font-semibold">
              {ad.category.name}
            </span>
          )}
          {ad.region && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium">
              <MapPin className="w-3 h-3 text-emerald-500" />
              {ad.region.name}
            </span>
          )}
        </div>

        {/* Meta info row: Location • Views • Date */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span>{ad.address || ad.region?.name || 'Кыргызстан'}</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-gray-400" />
            <span>{ad.views || 0} просмотров</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>{formatDate(ad.added_date)}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-gray-900 leading-snug mt-3">
          {ad.title}
        </h1>

        {/* Price */}
        <div className="text-2xl sm:text-3xl font-extrabold text-[#1976D2] mt-3 tracking-tight">
          {formatPrice(ad.price)}
        </div>

        {/* Seller Row */}
        <div 
          onClick={onSellerClick}
          className="flex items-center gap-3 mt-4 py-2 px-3 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 transition-all cursor-pointer group shadow-2xs"
          role="button"
          tabIndex={0}
        >
          <div className="w-11 h-11 rounded-full overflow-hidden bg-blue-50 border border-gray-100 flex items-center justify-center shrink-0">
            {ad.user?.avatar ? (
              <img src={ad.user.avatar} alt="Seller" className="w-full h-full object-cover" />
            ) : (
              <span className="text-base font-bold text-[#1976D2]">
                {ad.user?.full_name ? ad.user.full_name.charAt(0).toUpperCase() : 'П'}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#1976D2] transition-colors truncate">
              {ad.user?.full_name || 'Продавец'}
            </p>
            <p className="text-xs text-gray-500 font-medium">Все объявления продавца →</p>
          </div>
        </div>

        {/* Action Buttons: Phone, WhatsApp, Telegram */}
        <div className="mt-4 pt-3 border-t border-gray-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1976D2] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Позвонить</span>
            </a>
          )}

          {cleanWhatsapp && (
            <a
              href={`https://wa.me/${cleanWhatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-none" />
              <span>Написать в WhatsApp</span>
            </a>
          )}

          {telegramTarget && (
            <a
              href={`https://t.me/${telegramTarget}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 bg-[#229ED9] hover:bg-[#1d8bc0] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors sm:col-span-2"
            >
              <Send className="w-4 h-4" />
              <span>Написать в Telegram</span>
            </a>
          )}
        </div>

        {/* Ad Lifting feature if owner or can lift */}
        {isOwner && (
          <div className="mt-4 pt-3 border-t border-gray-200/60">
            {canLiftState ? (
              <button
                type="button"
                onClick={handleLift}
                disabled={isLifting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                <ArrowUpCircle className="w-4 h-4" />
                <span>{isLifting ? 'Поднимаем объявление...' : 'Поднять в топ поиска'}</span>
              </button>
            ) : (
              <div className="text-center text-xs text-gray-500 font-medium py-1.5 bg-gray-100/80 rounded-xl">
                {ad.can_lift_in_hours && ad.can_lift_in_hours > 0
                  ? `Можно поднять через ${ad.can_lift_in_hours} ч.`
                  : 'Объявление недавно обновлено'}
              </div>
            )}
          </div>
        )}

        {/* Description Section */}
        <div className="mt-5 pt-4 border-t border-gray-200/60">
          <h3 className="text-base font-bold text-gray-900 mb-2">
            Описание
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {ad.description || 'Описание отсутствует.'}
          </p>
        </div>
      </div>

      {/* Bottom Useful Info Card */}
      <div className="bg-[#f8fafc] rounded-3xl p-5 sm:p-6 border border-gray-100/90 shadow-xs">
        <h4 className="text-sm sm:text-base font-bold text-[#1976D2] mb-1.5">
          Безопасность сделки
        </h4>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Проверяйте товар перед оплатой. Не переводите предоплату незнакомым продавцам. При встрече выбирайте публичные места.
        </p>
      </div>
    </div>
  );
};
