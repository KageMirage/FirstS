'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import { useSearchParams } from '../hooks/useSearchParams';
import { useAds } from '../hooks/useAds';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { 
  CreateAdPhotoUploader, 
  UploadedImage 
} from './create-ad/CreateAdPhotoUploader';
import { 
  CreateAdFormFields, 
  CreateAdFormData 
} from './create-ad/CreateAdFormFields';
import { AdItem } from '../types/api';
import { DEFAULT_USER_AVATAR } from '../utils/authStorage';

export const CreateAdPage: React.FC = () => {
  const [, setSearchParams, , navigate] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const { notify, openAuth } = useUI();
  const { publishAd, selectAd } = useAds();
  const { categories, childCategories } = useCategories();

  const categoryOptions = useMemo(() => {
    const list = [
      ...categories.map((c) => c.name),
      ...childCategories.map((c) => c.name),
    ];
    return Array.from(new Set(list));
  }, [categories, childCategories]);

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateAdFormData>({
    price: '',
    category: '',
    region: 'Бишкек',
    phone: user?.phone_number || '+996',
    title: '',
    whatsapp: user?.phone_number || '',
    telegram: '',
    description: '',
  });

  useEffect(() => {
    if (!formData.category && categoryOptions.length > 0) {
      setFormData((prev) => ({ ...prev, category: categoryOptions[0] }));
    }
  }, [formData.category, categoryOptions]);

  useEffect(() => {
    if (user?.phone_number) {
      setFormData((prev) => ({
        ...prev,
        phone: !prev.phone || prev.phone === '+996' ? user.phone_number : prev.phone,
        whatsapp: !prev.whatsapp ? user.phone_number : prev.whatsapp,
      }));
    }
  }, [user]);

  const handleFieldChange = (field: keyof CreateAdFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-[#fcfdfe] min-h-[70vh] flex items-center justify-center py-12 px-4" id="create-ad-unauthorized">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center">
          <div className="w-16 h-16 bg-blue-50 text-[#1976D2] rounded-full flex items-center justify-center mx-auto mb-5">
            <Plus className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Публикация объявления
          </h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Подавать объявления могут только зарегистрированные пользователи. Пожалуйста, войдите в свой аккаунт или зарегистрируйтесь.
          </p>
          <div className="space-y-3">
            <button
              type="button"
              onClick={openAuth}
              className="w-full py-3.5 px-5 bg-[#1976D2] hover:bg-[#1565C0] text-white rounded-2xl font-semibold text-sm transition-all shadow-sm active:scale-[0.99] cursor-pointer"
            >
              Войти или зарегистрироваться
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchParams({}, { pathname: '/' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3 px-5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl font-semibold text-sm transition-all cursor-pointer"
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      notify('Пожалуйста, заполните заголовок объявления', 'error');
      return;
    }
    if (!formData.description.trim()) {
      notify('Пожалуйста, введите описание объявления', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('title', formData.title.trim());
      fd.append('description', formData.description.trim());
      fd.append('price', formData.price.trim() || '0');
      fd.append('address', formData.region || 'Бишкек');
      fd.append('phone_number', formData.phone || user?.phone_number || '');
      fd.append('whatsapp_number', formData.whatsapp || formData.phone || user?.phone_number || '');
      fd.append('telegram_number', formData.telegram || '');

      const matchingCat = categories.find((c) => c.name === formData.category) ||
        childCategories.find((c) => c.name === formData.category);
      if (matchingCat) {
        fd.append('category', String(matchingCat.id));
      }

      const cleanPrice = formData.price.trim();
      const numPrice = parseFloat(cleanPrice.replace(/\s+/g, ''));
      const finalPrice = isNaN(numPrice) ? cleanPrice || '0' : numPrice;

      const adImage = images.length > 0
        ? images[0].url
        : 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80';

      const userName = user?.full_name || 'user';
      const userPhone = formData.phone || user?.phone_number || '+996 700 600 600';
      const userAvatar = user?.avatar || DEFAULT_USER_AVATAR;

      const localItem: AdItem = {
        id: Date.now(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: finalPrice,
        address: formData.region || 'Бишкек',
        phone_number: userPhone,
        whatsapp_number: formData.whatsapp || userPhone,
        telegram_number: formData.telegram || '',
        image: adImage,
        images: images.length > 0 ? images.map((i) => i.url) : [adImage],
        user: {
          id: user?.id || Date.now(),
          full_name: userName,
          phone_number: userPhone,
          email: user?.email,
          avatar: userAvatar,
        },
        category: {
          id: matchingCat?.id || 1,
          name: formData.category || 'Разное',
        },
        views: 1,
        favorites_count: 0,
        is_favorite: false,
        subCategoryTitle: formData.category || 'Объявление',
        formattedDate: `Сегодня - ${finalPrice} сом`,
        added_date: new Date().toISOString(),
      };

      selectAd(localItem);
      await publishAd(fd, localItem);

      setSearchParams({ view: 'cabinet', tab: 'ads' }, { pathname: '/cabinet' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      notify('Произошла ошибка при публикации', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fcfdfe] min-h-screen pb-16" id="create-ad-page">
      {/* Top Header */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#1976D2] transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
            <span>Назад</span>
          </button>
        </div>
      </div>

      {/* Main Container with Form */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div 
          id="create-ad-card"
          className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <CreateAdPhotoUploader
              images={images}
              onAddImages={(newImgs) => setImages((prev) => [...prev, ...newImgs])}
              onRemoveImage={(id) => setImages((prev) => prev.filter((img) => img.id !== id))}
            />

            <CreateAdFormFields
              formData={formData}
              categoryOptions={categoryOptions}
              onChange={handleFieldChange}
            />

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#1976D2] hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-xs transition cursor-pointer"
              >
                {isSubmitting ? 'Публикация...' : 'Опубликовать объявление'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
