import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface SuccessLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export const SuccessLoginModal: React.FC<SuccessLoginModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" 
      id="modal-success-login"
    >
      <div 
        className="bg-white rounded-3xl max-w-sm w-full shadow-2xl p-6 sm:p-8 relative text-center border border-gray-100 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1976D2] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
          Вы успешно вошли
        </h3>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 font-medium mb-6">
          Добро пожаловать!
        </p>

        {/* Action Button */}
        <button
          type="button"
          id="btn-success-login-confirm"
          onClick={handleConfirm}
          className="w-full py-3.5 bg-[#1976D2] hover:bg-[#1565C0] active:bg-[#0D47A1] text-white font-semibold rounded-2xl shadow-md shadow-blue-500/20 transition-all cursor-pointer text-sm"
        >
          Подтвердить
        </button>
      </div>
    </div>
  );
};
