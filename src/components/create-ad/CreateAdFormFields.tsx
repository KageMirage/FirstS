'use client';

import React from 'react';
import { CategoryAndRegionSelects } from './CategoryAndRegionSelects';

export interface CreateAdFormData {
  price: string;
  category: string;
  region: string;
  phone: string;
  title: string;
  whatsapp: string;
  telegram: string;
  description: string;
}

interface CreateAdFormFieldsProps {
  formData: CreateAdFormData;
  categoryOptions: string[];
  onChange: (field: keyof CreateAdFormData, value: string) => void;
}

export const CreateAdFormFields: React.FC<CreateAdFormFieldsProps> = ({
  formData,
  categoryOptions,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      {/* 2-Column Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2">
        {/* Цена */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Цена (сом, необязательно)
          </label>
          <input
            type="text"
            value={formData.price}
            onChange={(e) => onChange('price', e.target.value)}
            placeholder="Например: 5000"
            className="w-full bg-[#f8f9fb] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none border border-transparent focus:border-[#1976D2] focus:bg-white transition placeholder-gray-400"
          />
        </div>

        {/* Категория и Регион выпадающие списки */}
        <CategoryAndRegionSelects
          category={formData.category}
          region={formData.region}
          categoryOptions={categoryOptions}
          onChange={onChange}
        />

        {/* Телефон */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Телефон<span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+996"
            className="w-full bg-[#f8f9fb] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none border border-transparent focus:border-[#1976D2] focus:bg-white transition placeholder-gray-400"
          />
        </div>

        {/* Заголовок */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Заголовок<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Введите название объявления"
            className="w-full bg-[#f8f9fb] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none border border-transparent focus:border-[#1976D2] focus:bg-white transition placeholder-gray-400"
          />
        </div>

        {/* Номер WhatsApp */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Номер WhatsApp
          </label>
          <input
            type="text"
            value={formData.whatsapp}
            onChange={(e) => onChange('whatsapp', e.target.value)}
            placeholder="+996 700 000 000"
            className="w-full bg-[#f8f9fb] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none border border-transparent focus:border-[#1976D2] focus:bg-white transition placeholder-gray-400"
          />
        </div>

        {/* Telegram */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Telegram
          </label>
          <input
            type="text"
            value={formData.telegram}
            onChange={(e) => onChange('telegram', e.target.value)}
            placeholder="@username или номер"
            className="w-full bg-[#f8f9fb] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none border border-transparent focus:border-[#1976D2] focus:bg-white transition placeholder-gray-400"
          />
        </div>
      </div>

      {/* Описание Full Width */}
      <div className="pt-2">
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Описание<span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Опишите подробности вашего предложения..."
          className="w-full bg-[#f8f9fb] rounded-xl p-4 text-sm text-gray-800 outline-none border border-transparent focus:border-[#1976D2] focus:bg-white transition placeholder-gray-400 resize-none"
        />
      </div>
    </div>
  );
};
