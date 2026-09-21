import React, { useState } from 'react';
import { X, Tag, Check, AlertCircle } from 'lucide-react';
import { ChatAdInfo } from '../types/messages';

interface PriceOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  ad: ChatAdInfo;
  onSendOffer: (price: number) => void;
}

export const PriceOfferModal: React.FC<PriceOfferModalProps> = ({
  isOpen,
  onClose,
  ad,
  onSendOffer,
}) => {
  if (!isOpen) return null;

  // Extract base numerical price
  const numericPrice = typeof ad.price === 'number' 
    ? ad.price 
    : parseInt(String(ad.price).replace(/\D/g, ''), 10) || 100000;

  const [offerValue, setOfferValue] = useState<string>(
    String(Math.round(numericPrice * 0.95))
  );
  const [error, setError] = useState<string | null>(null);

  const handleQuickPercent = (discount: number) => {
    const calculated = Math.round(numericPrice * (1 - discount / 100));
    setOfferValue(String(calculated));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(offerValue.replace(/\D/g, ''), 10);
    if (!val || val <= 0) {
      setError('Пожалуйста, укажите корректную сумму предложения');
      return;
    }
    if (val > numericPrice * 2) {
      setError('Предложение не может превышать стоимость товара более чем в 2 раза');
      return;
    }
    onSendOffer(val);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-200"
        id="price-offer-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all cursor-pointer"
          id="btn-close-offer-modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#1a73e8] flex items-center justify-center font-bold">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              Предложить свою цену
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Продавец получит уведомление с вашим предложением
            </p>
          </div>
        </div>

        {/* Ad summary card */}
        <div className="bg-[#f8f9fa] rounded-2xl p-3 border border-gray-100 flex items-center gap-3 mb-5">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 shrink-0">
            <img 
              src={ad.image} 
              alt={ad.title} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">
              {ad.title}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Исходная цена: <span className="font-bold text-gray-900">{typeof ad.price === 'number' ? `${ad.price.toLocaleString('ru-RU')} KGS` : ad.price}</span>
            </p>
          </div>
        </div>

        {/* Quick percentage buttons */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Быстрый выбор скидки:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[5, 10, 15].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handleQuickPercent(pct)}
                className="py-2 px-3 rounded-xl border border-gray-200 hover:border-[#1a73e8] hover:bg-blue-50/50 text-xs font-semibold text-gray-700 hover:text-[#1a73e8] transition-all cursor-pointer text-center"
              >
                -{pct}% ({Math.round(numericPrice * (1 - pct / 100)).toLocaleString('ru-RU')} KGS)
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Ваша цена (в сомах):
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={offerValue}
                onChange={(e) => {
                  setOfferValue(e.target.value.replace(/[^\d]/g, ''));
                  setError(null);
                }}
                placeholder="Например, 7500000"
                className="w-full pl-4 pr-16 py-3 bg-[#f3f4f6] text-gray-900 font-bold text-base rounded-xl border border-transparent focus:border-[#1a73e8] focus:bg-white focus:ring-2 focus:ring-[#1a73e8]/20 outline-none transition-all"
                id="input-offer-price"
                autoFocus
              />
              <span className="absolute right-4 font-bold text-sm text-gray-400 pointer-events-none">
                KGS
              </span>
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium mt-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-[#1a73e8] hover:bg-[#1666d3] text-white text-sm font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              id="btn-submit-offer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Отправить</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
