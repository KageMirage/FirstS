'use client';

import React, { useState } from 'react';
import { X, Upload, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useUI } from '../hooks/useUI';
import { useAds } from '../hooks/useAds';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../hooks/useAuth';
import { AdItem } from '../types/api';

export const PostAdModal: React.FC = () => {
  const { isPostAdOpen, closePostAd } = useUI();
  const { publishAd, isPosting } = useAds();
  const { categories } = useCategories();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<string>('2');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '+7 (926) 450-12-88');
  const [address, setAddress] = useState('Москва, метро Печатники');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  if (!isPostAdOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', categoryId);
    formData.append('phone_number', phoneNumber);
    formData.append('address', address);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const localItem: AdItem = {
      id: Date.now(),
      title,
      description,
      price: Number(price),
      address,
      phone_number: phoneNumber,
      image: imagePreview || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80',
      user: {
        id: user?.id || 999,
        full_name: user?.full_name || 'Пользователь',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        phone_number: phoneNumber,
      },
      category: {
        id: Number(categoryId),
        name: categories.find((c) => c.id === Number(categoryId))?.name || 'Снять/Сдам',
      },
      views: 1,
      favorites_count: 0,
      is_favorite: false,
      subCategoryTitle: 'Квартира/Мейманкана - (Печатники)',
      formattedDate: `Сегодня в ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${price} Руб`,
    };

    const success = await publishAd(formData, localItem);
    if (success) {
      closePostAd();
      setTitle('');
      setDescription('');
      setPrice('');
      setImagePreview('');
      setImageFile(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" id="modal-post-ad">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Опубликовать объявление</h3>
            <p className="text-xs text-gray-500">Заполните данные для размещения в ленте Adverts PRO</p>
          </div>
          <button
            onClick={closePostAd}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Заголовок объявления *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Сдается дом на 24 часа"
              className="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 focus:bg-white text-sm rounded-xl border border-gray-200 focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 outline-none transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Категория
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 focus:bg-white text-sm rounded-xl border border-gray-200 focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 outline-none transition-all"
            >
              {categories.length > 0 ? (
                categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="2">Снять/Сдам (Недвижимость)</option>
                  <option value="1">Вакансии и Работа</option>
                  <option value="3">Продаю/Куплю</option>
                  <option value="4">Услуги и Сервисы</option>
                  <option value="5">Транспорт и Такси</option>
                </>
              )}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Цена (в рублях) *
            </label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="2500"
              className="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 focus:bg-white text-sm rounded-xl border border-gray-200 focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Описание
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите все преимущества, условия и характеристики..."
              className="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 focus:bg-white text-sm rounded-xl border border-gray-200 focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 outline-none transition-all resize-none"
            />
          </div>

          {/* Contact details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Номер телефона
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+7 (926) 450-12-88"
                className="w-full px-3.5 py-2.5 bg-gray-50 text-sm rounded-xl border border-gray-200 focus:border-[#1a73e8] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Адрес / Метро
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Москва, метро Печатники"
                className="w-full px-3.5 py-2.5 bg-gray-50 text-sm rounded-xl border border-gray-200 focus:border-[#1a73e8] outline-none"
              />
            </div>
          </div>

          {/* Image Upload Box */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Фотография
            </label>
            <label className="border-2 border-dashed border-gray-300 hover:border-[#1a73e8] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-blue-50/20">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative w-full h-32 rounded-xl overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                    Изменить
                  </span>
                </div>
              ) : (
                <div className="text-center py-3">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-gray-700">Нажмите для выбора фото</p>
                  <p className="text-[10px] text-gray-400">PNG, JPG, WEBP до 10MB</p>
                </div>
              )}
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={closePostAd}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isPosting}
              className="px-6 py-2.5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isPosting ? (
                <span>Публикация...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Опубликовать</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
