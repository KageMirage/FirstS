'use client';

import React from 'react';
import { 
  X, 
  Heart, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock,
  Eye, 
  Share2, 
  ShieldCheck,
  CheckCircle,
  Tag,
  User as UserIcon
} from 'lucide-react';
import { useUI } from '../hooks/useUI';
import { useAds } from '../hooks/useAds';
import { useSearchParams } from '../hooks/useSearchParams';

export const AdDetailModal: React.FC = () => {
  const { isAdDetailOpen, closeAdDetail, notify } = useUI();
  const { selectedAd, favoriteIds, toggleFavorite } = useAds();
  const [, setSearchParams] = useSearchParams();

  if (!isAdDetailOpen || !selectedAd) return null;

  const isFav = favoriteIds.includes(selectedAd.id);
  const formattedPrice = typeof selectedAd.price === 'number' 
    ? `${selectedAd.price.toLocaleString('ru-RU')} ₽`
    : `${selectedAd.price} ₽`;

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
    setSearchParams({
      view: 'seller',
      seller_name: selectedAd.user?.full_name || 'Asanova Asana',
      seller_phone: rawPhone,
      seller_avatar: selectedAd.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Здравствуйте! Я по поводу объявления "${selectedAd.title}" на Adverts PRO.`);
    window.open(`https://wa.me/${cleanPhone.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" id="modal-ad-detail">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-[#1a73e8] text-xs font-bold px-2.5 py-1 rounded-lg">
              {selectedAd.category?.name || 'Недвижимость'}
            </span>
            <span className="text-xs text-gray-400 font-medium">ID: #{selectedAd.id}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
              title="Поделиться"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(selectedAd.id)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isFav ? 'bg-rose-50 text-rose-500' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title="В избранное"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 stroke-rose-500' : ''}`} />
            </button>
            <button
              onClick={closeAdDetail}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Main Photo */}
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

          {/* Title & Price */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                {selectedAd.title}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>{selectedAd.address || 'Москва, метро Печатники'}</span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>Сегодня в 14:51</span>
              </div>
            </div>

            <div className="text-2xl font-black text-[#1a73e8]">
              {formattedPrice}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Описание
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {selectedAd.description || 'Сдается просторный и чистый дом со всеми удобствами на 24 часа. Идеально подходит для студентов, семейного отдыха и мероприятий. Вся необходимая бытовая техника, посуда, интернет и парковка.'}
            </p>
          </div>

          {/* Seller / User Profile Card */}
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
                    {selectedAd.user?.full_name ? selectedAd.user.full_name.charAt(0) : 'A'}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-gray-900">
                    {selectedAd.user?.full_name || 'Asana'}
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

          {/* Action Buttons: View Seller, Phone & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={handleViewSeller}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-sm shadow-sm hover:shadow transition-all cursor-pointer"
              id="btn-modal-seller"
            >
              <UserIcon className="w-4 h-4" />
              <span>Профиль продавца</span>
            </button>

            <button
              onClick={handleCall}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-sm transition-all cursor-pointer"
              id="btn-modal-call"
            >
              <Phone className="w-4 h-4 text-[#1a73e8]" />
              <span>Позвонить</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
              id="btn-modal-whatsapp"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.18-.553-1.614-.667-2.673-2.316-2.753-2.423-.08-.108-.654-.869-.654-1.657 0-.788.412-1.176.559-1.336.147-.16.32-.2.427-.2.107 0 .213.002.306.007.099.006.23-.038.36.275.133.32.453 1.103.493 1.183.04.08.067.173.013.28-.053.107-.08.173-.16.267-.08.093-.167.208-.239.28-.08.08-.163.167-.07.327.093.16.414.683.889 1.106.611.544 1.127.712 1.287.792.16.08.253.067.347-.04.093-.107.4-.467.507-.627.107-.16.213-.133.36-.08.147.053.933.44 1.093.52.16.08.267.12.307.187.04.066.04.386-.104.791z" />
              </svg>
              <span>WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
