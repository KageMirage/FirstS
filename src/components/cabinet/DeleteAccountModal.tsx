'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  userName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  userName,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      id="modal-delete-account-confirm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          title="Отмена"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              Удаление аккаунта
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Подтверждение действия
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Вы уверены, что хотите удалить аккаунт <strong className="text-gray-900 font-semibold">{userName}</strong>? Все ваши объявления, настройки профиля и избранное будут безвозвратно удалены.
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition cursor-pointer"
          >
            Отмена
          </button>
          <button
            type="button"
            id="btn-confirm-delete-account"
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Удалить</span>
          </button>
        </div>
      </div>
    </div>
  );
};
