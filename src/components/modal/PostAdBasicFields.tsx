'use client';

import React from 'react';
import { Category } from '../../types/api';

interface PostAdBasicFieldsProps {
  title: string;
  onTitleChange: (val: string) => void;
  categoryId: string;
  onCategoryChange: (val: string) => void;
  categories: Category[];
  price: string;
  onPriceChange: (val: string) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
  phoneNumber: string;
  onPhoneNumberChange: (val: string) => void;
  address: string;
  onAddressChange: (val: string) => void;
}

export const PostAdBasicFields: React.FC<PostAdBasicFieldsProps> = ({
  title,
  onTitleChange,
  categoryId,
  onCategoryChange,
  categories,
  price,
  onPriceChange,
  description,
  onDescriptionChange,
  phoneNumber,
  onPhoneNumberChange,
  address,
  onAddressChange,
}) => {
  return (
    <>
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Заголовок объявления *
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Например: Сдается дом на 24 часа"
          className="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 focus:bg-white text-sm rounded-xl border border-gray-200 focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Категория
        </label>
        <select
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
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

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Цена (в рублях) *
        </label>
        <input
          type="number"
          required
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder="2500"
          className="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 focus:bg-white text-sm rounded-xl border border-gray-200 focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Описание
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Опишите все преимущества, условия и характеристики..."
          className="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 focus:bg-white text-sm rounded-xl border border-gray-200 focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 outline-none transition-all resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Номер телефона
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value)}
            placeholder="+7 (926) 450-12-88"
            className="w-full px-3.5 py-2.5 bg-gray-50 text-sm rounded-xl border border-gray-200 focus:border-[#1a73e8] outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Адрес / Регион
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="Бишкек, Кыргызстан"
            className="w-full px-3.5 py-2.5 bg-gray-50 text-sm rounded-xl border border-gray-200 focus:border-[#1a73e8] outline-none"
          />
        </div>
      </div>
    </>
  );
};
