'use client';

import React, { useState, useEffect } from 'react';
import { User as UserIcon, Pencil, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../../types/api';

interface CabinetProfileTabProps {
  user: UserProfile | null;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onDeleteAccount: () => void;
  onTriggerAvatarUpload: () => void;
  onOpenPublicProfile: () => void;
  onNotify: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const CabinetProfileTab: React.FC<CabinetProfileTabProps> = ({
  user,
  onUpdateProfile,
  onDeleteAccount,
  onTriggerAvatarUpload,
  onOpenPublicProfile,
  onNotify,
}) => {
  const [fullName, setFullName] = useState(user?.full_name || 'user');
  const [phone, setPhone] = useState(user?.phone_number || '+996');
  const [telegramNumber, setTelegramNumber] = useState(user?.telegram_number || '+996');
  const [whatsappNumber, setWhatsappNumber] = useState(user?.whatsapp_number || '+996');
  const [password, setPassword] = useState('••••••••••');
  const [email, setEmail] = useState(user?.email || 'user@example.com');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.full_name) setFullName(user.full_name);
      if (user.phone_number) setPhone(user.phone_number);
      if (user.telegram_number) setTelegramNumber(user.telegram_number);
      if (user.whatsapp_number) setWhatsappNumber(user.whatsapp_number);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      full_name: fullName.trim() || 'user',
      phone_number: phone.trim(),
      telegram_number: telegramNumber.trim(),
      whatsapp_number: whatsappNumber.trim(),
      email: email.trim(),
    });
    setIsSaved(true);
    onNotify('success', 'Данные профиля успешно обновлены');
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div id="profile-info-section">
      <div className="bg-white rounded-3xl border border-gray-100/80 p-6 sm:p-10 shadow-xs">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row items-start gap-8 lg:gap-10">
            {/* Avatar Column */}
            <div className="shrink-0 pt-1">
              <div className="relative">
                <div 
                  onClick={onTriggerAvatarUpload}
                  title="Нажмите, чтобы изменить фото профиля"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#eef2f6] border border-gray-200 cursor-pointer flex items-center justify-center group shadow-xs"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={fullName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <UserIcon className="w-12 h-12 text-gray-400 stroke-[1.5]" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={onTriggerAvatarUpload}
                  title="Загрузить новое фото"
                  className="absolute bottom-1 right-1 w-7 h-7 bg-[#1976D2] hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-xs border-2 border-white transition cursor-pointer hover:scale-110 active:scale-95"
                >
                  <Pencil className="w-3.5 h-3.5 fill-current text-white stroke-[0]" />
                </button>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="flex-1 w-full space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">ФИО</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Асан"
                    className="w-full h-11 px-4 bg-[#f9f9f9] focus:bg-white text-gray-800 text-sm rounded-xl border border-gray-200 focus:border-[#1976D2] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Номер телефона</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+996"
                    className="w-full h-11 px-4 bg-[#f9f9f9] focus:bg-white text-gray-800 text-sm rounded-xl border border-gray-200 focus:border-[#1976D2] outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Telegram номер</label>
                  <input
                    type="text"
                    value={telegramNumber}
                    onChange={(e) => setTelegramNumber(e.target.value)}
                    placeholder="+996"
                    className="w-full h-11 px-4 bg-[#f9f9f9] focus:bg-white text-gray-800 text-sm rounded-xl border border-gray-200 focus:border-[#1976D2] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">WhatsApp номер</label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+996"
                    className="w-full h-11 px-4 bg-[#f9f9f9] focus:bg-white text-gray-800 text-sm rounded-xl border border-gray-200 focus:border-[#1976D2] outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Telegram (@username или номер)</label>
                  <input
                    type="text"
                    value={telegramNumber}
                    onChange={(e) => setTelegramNumber(e.target.value)}
                    placeholder="@username или +996..."
                    className="w-full h-11 px-4 bg-[#f9f9f9] focus:bg-white text-gray-800 text-sm rounded-xl border border-gray-200 focus:border-[#1976D2] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Пароль</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full h-11 px-4 bg-[#f9f9f9] focus:bg-white text-gray-800 text-sm rounded-xl border border-gray-200 focus:border-[#1976D2] outline-none transition"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onOpenPublicProfile}
                  className="px-5 py-2.5 rounded-xl border border-[#1976D2] text-[#1976D2] hover:bg-blue-50 text-sm font-semibold transition cursor-pointer text-center"
                >
                  Публичный профиль
                </button>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1976D2] hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition cursor-pointer"
                  >
                    Сохранить
                  </button>

                  <button
                    type="button"
                    onClick={onDeleteAccount}
                    className="px-4 py-2.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-sm font-semibold transition cursor-pointer"
                  >
                    Удалить аккаунт
                  </button>
                </div>
              </div>

              {isSaved && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Изменения успешно сохранены!</span>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
