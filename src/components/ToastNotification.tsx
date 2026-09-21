'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useUI } from '../hooks/useUI';

export const ToastNotification: React.FC = () => {
  const { toastMessage, toastType } = useUI();

  if (!toastMessage) return null;

  const getIcon = () => {
    switch (toastType) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-[#1a73e8] shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200" id="global-toast">
      <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-2xl rounded-2xl p-4 flex items-center gap-3 max-w-sm text-sm text-gray-800 ring-1 ring-black/5">
        {getIcon()}
        <p className="font-medium text-xs leading-snug">{toastMessage}</p>
      </div>
    </div>
  );
};
