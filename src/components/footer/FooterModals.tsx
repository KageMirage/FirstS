'use client';

import React from 'react';
import { X } from 'lucide-react';

export type FooterModalType = 'contacts' | 'privacy' | 'terms' | null;

interface FooterModalsProps {
  activeModal: FooterModalType;
  onClose: () => void;
}

export const FooterModals: React.FC<FooterModalsProps> = ({ activeModal, onClose }) => {
  if (!activeModal) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        className="bg-white text-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {activeModal === 'contacts' && (
          <div>
            <h3 className="text-lg font-bold mb-3">Контакты службы поддержки</h3>
            <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
              <p><strong>Служба заботы:</strong> support@adverts.kg</p>
              <p><strong>Телефон / WhatsApp:</strong> +996 (555) 123-456</p>
              <p><strong>Режим работы:</strong> Пн - Вс, 09:00 — 21:00</p>
              <p><strong>Офис:</strong> г. Бишкек, пр. Чуй, 114</p>
            </div>
          </div>
        )}

        {activeModal === 'privacy' && (
          <div>
            <h3 className="text-lg font-bold mb-3">Политика конфиденциальности</h3>
            <div className="text-sm text-gray-600 max-h-60 overflow-y-auto space-y-2 pr-1">
              <p>Мы бережно относимся к безопасности ваших персональных данных.</p>
              <p>Вся передаваемая информация (телефон, имя, геолокация) используется исключительно для связи между покупателем и продавцом.</p>
              <p>Мы не передаем данные третьим лицам без вашего прямого согласия.</p>
            </div>
          </div>
        )}

        {activeModal === 'terms' && (
          <div>
            <h3 className="text-lg font-bold mb-3">Условия пользования</h3>
            <div className="text-sm text-gray-600 max-h-60 overflow-y-auto space-y-2 pr-1">
              <p>1. Публикуемые объявления должны соответствовать действующему законодательству.</p>
              <p>2. Запрещается размещение заведомо недостоверной информации и дубликатов.</p>
              <p>3. Администрация оставляет за собой право модерации объявлений.</p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-2 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
        >
          Понятно
        </button>
      </div>
    </div>
  );
};
