'use client';

import React from 'react';
import { 
  X, 
  Heart, 
  MapPin, 
  Clock, 
  Share2
} from 'lucide-react';
import { useUI } from '../hooks/useUI';
import { useAds } from '../hooks/useAds';
import { useSearchParams } from '../hooks/useSearchParams';
import { AdModalSellerSection } from './ad-detail/AdModalSellerSection';

export const AdDetailModal: React.FC = () => {
  const { isAdDetailOpen, closeAdDetail, notify } = useUI();
  const { selectedAd, favoriteIds, toggleFavorite } = useAds();
  const [, setSearchParams] = useSearchParams();

  if (!isAdDetailOpen || !selectedAd) return null;

  const isFav = favoriteIds.includes(selectedAd.id);
  const formattedPrice = typeof selectedAd.price === 'number' 
    ? `${selectedAd.price.toLocaleString('ru-RU')} сом`
    : `${selectedAd.price} сом`;

  const rawPhone = selectedAd.phone_number || selectedAd.user?.phone_number || '+996 700 600 600';
  const cleanPhone = rawPhone.replace(/[^\d+]/g, '');

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    notify('Ссылка на объявление скопирована в буфер обмена!', 'success');
  };

  const handleCall = () => {
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleViewSeller = () => {
    closeAdDetail();
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('view', 'seller');
        next.set('seller_name', selectedAd.user?.full_name || 'Продавец');
        next.set('seller_phone', rawPhone);
        return next;
      },
      { pathname: '/seller' }
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Здравствуйте! Я по поводу объявления "${selectedAd.title}" на Adverts PRO.`);
    window.open(`https://wa.me/${cleanPhone.replace('+', '')}?text=${message}`, '_blank');
  };

  const handleTelegram = () => {
    const tg = selectedAd.telegram_number || cleanPhone;
    const cleanTg = tg.replace(/^@/, '').trim();
    const message = encodeURIComponent(`Здравствуйте! Я по поводу объявления "${selectedAd.title}" на Adverts PRO.`);
    window.open(`https://t.me/${cleanTg}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" id="modal-ad-detail">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-[#1a73e8] text-xs font-bold px-2.5 py-1 rounded-lg">
              {selectedAd.category?.name || 'Объявление'}
            </span>
            <span className="text-xs text-gray-400 font-medium">ID: #{selectedAd.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
              title="Поделиться"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(selectedAd.id)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isFav ? 'bg-rose-50 text-rose-500' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title="В избранное"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 stroke-rose-500' : ''}`} />
            </button>
            <button
              onClick={closeAdDetail}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
            {selectedAd.image ? (
              <img
                src={selectedAd.image}
                alt={selectedAd.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                <span>Фото отсутствует</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                {selectedAd.title}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>{selectedAd.address || 'Бишкек, Кыргызстан'}</span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>{selectedAd.added_date ? new Date(selectedAd.added_date).toLocaleDateString('ru-RU') : 'Сегодня'}</span>
              </div>
            </div>

            <div className="text-2xl font-black text-[#1a73e8]">
              {formattedPrice}
            </div>
          </div>

          <div className="space-y-2 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Описание
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {selectedAd.description || 'Сдается просторный и чистый дом со всеми удобствами на 24 часа. Идеально подходит для студентов, семейного отдыха и мероприятий.'}
            </p>
          </div>

          <AdModalSellerSection
            selectedAd={selectedAd}
            onViewSeller={handleViewSeller}
            onCall={handleCall}
            onWhatsApp={handleWhatsApp}
            onTelegram={handleTelegram}
          />
        </div>
      </div>
    </div>
  );
};
