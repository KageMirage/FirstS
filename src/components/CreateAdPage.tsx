'use client';

import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronDown, 
  X, 
  Pencil, 
  Check
} from 'lucide-react';
import { useSearchParams } from '../hooks/useSearchParams';
import { useAds } from '../hooks/useAds';
import { useCategories } from '../hooks/useCategories';
import { useUI } from '../hooks/useUI';

interface UploadedImage {
  id: string;
  url: string;
  isEditing?: boolean;
}

const INITIAL_IMAGES: UploadedImage[] = [
  {
    id: 'img-1',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'img-2',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'img-3',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'img-4',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
    isEditing: true,
  },
];

const REGIONS = [
  'Ош',
  'Бишкек',
  'Джалал-Абад',
  'Нарын',
  'Талас',
  'Баткен',
  'Иссык-Куль',
  'Чуй',
  'Москва',
  'Санкт-Петербург',
];

export const CreateAdPage: React.FC = () => {
  const [, setSearchParams, , navigate] = useSearchParams();
  const { notify } = useUI();
  const { publishAd } = useAds();
  const { categories, childCategories } = useCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryOptions = React.useMemo(() => {
    const list = [
      ...categories.map(c => c.name),
      ...childCategories.map(c => c.name),
    ];
    return Array.from(new Set(list));
  }, [categories, childCategories]);

  // Form State matching screenshot 1 & 2
  const [images, setImages] = useState<UploadedImage[]>(INITIAL_IMAGES);
  const [price, setPrice] = useState('123');
  const [category, setCategory] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  React.useEffect(() => {
    if (!category && categoryOptions.length > 0) {
      setCategory(categoryOptions[0]);
    }
  }, [category, categoryOptions]);
  const [region, setRegion] = useState('Ош');
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [phone, setPhone] = useState('+996');
  const [title, setTitle] = useState('+996');
  const [whatsapp, setWhatsapp] = useState('+996 996700600600');
  const [telegram, setTelegram] = useState('+996');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image Upload Handlers
  const handleRemoveImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newUploaded: UploadedImage[] = [];
    Array.from(files).forEach((file: File, index: number) => {
      const url = URL.createObjectURL(file);
      newUploaded.push({
        id: `custom-${Date.now()}-${index}`,
        url,
      });
    });

    setImages(prev => [...prev, ...newUploaded].slice(0, 10));
    notify('Фотографии успешно добавлены', 'success');
  };

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      notify('Пожалуйста, укажите заголовок объявления', 'error');
      return;
    }
    if (!description.trim() && description.length === 0) {
      notify('Пожалуйста, добавьте описание', 'error');
      return;
    }

    setIsSubmitting(true);

    const newAd = {
      id: Date.now(),
      title: title.trim() || 'Новое объявление',
      description: description.trim() || 'Описание отсутствует',
      price: price ? `${price} KGS` : 'Договорная',
      address: region,
      views: 1,
      added_date: 'Только что',
      formattedDate: 'Сегодня',
      image: images[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
      images: images.map(img => img.url),
      user: {
        id: 99,
        full_name: 'PROlab Agency',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      },
      category: {
        id: 1,
        name: category,
      },
      subCategoryTitle: category,
    };

    const formData = new FormData();
    formData.append('title', newAd.title);
    formData.append('description', newAd.description);
    formData.append('price', price);
    formData.append('region', region);
    formData.append('phone', phone);
    formData.append('whatsapp', whatsapp);
    formData.append('telegram', telegram);
    formData.append('category', category);

    await publishAd(formData, newAd);
    setIsSubmitting(false);
    setSearchParams({ view: 'ad', id: String(newAd.id) });
  };

  // 10 slots total
  const totalSlots = 10;
  const emptySlotsCount = Math.max(0, totalSlots - images.length);

  return (
    <div className="min-h-screen bg-[#fcfdfe] pb-16" id="create-ad-page-container">
      
      {/* 1. Header Breadcrumbs: < На главную • Избранное */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <button
            id="btn-create-back-home"
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-gray-800 hover:text-[#1a73e8] transition-colors cursor-pointer group"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:-translate-x-0.5 transition-transform" />
            <span className="underline underline-offset-2">На главную</span>
          </button>

          <span className="text-gray-300">•</span>

          <button
            onClick={() => setSearchParams({ view: 'favorites' })}
            className="text-gray-600 hover:text-[#1a73e8] transition-colors cursor-pointer"
          >
            Избранное
          </button>
        </div>
      </div>

      {/* 2. Main White Container with Form */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div 
          id="create-ad-card"
          className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Photo Upload Section */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3">
                Загрузить фото
              </h3>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="photo-file-input"
              />

              {/* Photos Horizontal Row (10 slots) */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {/* Uploaded Images */}
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-100 group border border-gray-200/80 shadow-sm"
                  >
                    <img
                      src={img.url}
                      alt={`Фото ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Edit Pencil Badge on Slot 4 or selected */}
                    {img.isEditing && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-sm">
                          <Pencil className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    )}

                    {/* Delete X button */}
                    <button
                      type="button"
                      onClick={(e) => handleRemoveImage(img.id, e)}
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer shadow"
                      title="Удалить фото"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Empty Slots with Landscape/Photo Vector Icon */}
                {Array.from({ length: emptySlotsCount }).map((_, index) => (
                  <button
                    key={`empty-${index}`}
                    type="button"
                    onClick={handleOpenFileDialog}
                    className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#f3f4f6] hover:bg-[#eaebed] border border-transparent hover:border-gray-300 transition-all flex items-center justify-center cursor-pointer group"
                    title="Добавить фото"
                  >
                    {/* Clean SVG photo placeholder matching figma screenshot */}
                    <svg
                      className="w-8 h-8 text-white group-hover:scale-105 transition-transform"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* 2-Column Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2">
              
              {/* Left Column 1: Цена (необязательно) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Цена (необязательно)
                </label>
                <input
                  id="input-price"
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="123"
                  className="w-full bg-[#f8f9fb] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none border border-transparent focus:border-[#1a73e8] focus:bg-white transition-all placeholder-gray-400"
                />
              </div>

              {/* Right Column 1: Категории* */}
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Категории<span className="text-red-500">*</span>
                </label>
                
                <button
                  type="button"
                  id="select-category-button"
                  onClick={() => {
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                    setIsRegionDropdownOpen(false);
                  }}
                  className="w-full bg-[#f8f9fb] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none border border-transparent focus:border-[#1a73e8] focus:bg-white transition-all flex items-center justify-between cursor-pointer"
                >
                  <span className="font-normal">{category}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu matching Screenshot 2 */}
                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in duration-150">
                    <div className="space-y-0.5">
                      {categoryOptions.map((cat) => {
                        const isSelected = cat === category;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setCategory(cat);
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'text-[#1a73e8] bg-blue-50/70 font-bold'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            <span>{cat}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#1a73e8]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Left Column 2: Регион* */}
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Регион<span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  id="select-region-button"
                  onClick={() => {
                    setIsRegionDropdownOpen(!isRegionDropdownOpen);
                    setIsCategoryDropdownOpen(false);
                  }}
                  className="w-full bg-[#f8f9fb] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none border border-transparent focus:border-[#1a73e8] focus:bg-white transition-all flex items-center justify-between cursor-pointer"
                >
                  <span className="font-normal">{region}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isRegionDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Region Dropdown Menu */}
                {isRegionDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 max-h-56 overflow-y-auto animate-in fade-in duration-150">
                    <div className="space-y-0.5">
                      {REGIONS.map((reg) => {
                        const isSelected = reg === region;
                        return (
                          <button
                            key={reg}
                            type="button"
                            onClick={() => {
                              setRegion(reg);
                              setIsRegionDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'text-[#1a73e8] bg-blue-50/70 font-bold'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            <span>{reg}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#1a73e8]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column 2: Телефон* */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Телефон<span className="text-red-500">*</span>
                </label>
                <input
                  id="input-phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+996"
                  className="w-full bg-[#f8f9fb] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none border border-transparent focus:border-[#1a73e8] focus:bg-white transition-all placeholder-gray-400"
                />
              </div>

              {/* Left Column 3: Заголовок */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Заголовок
                </label>
                <input
                  id="input-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="+996"
                  className="w-full bg-[#f8f9fb] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none border border-transparent focus:border-[#1a73e8] focus:bg-white transition-all placeholder-gray-400"
                />
              </div>

              {/* Right Column 3: Номер WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Номер WhatsApp
                </label>
                <input
                  id="input-whatsapp"
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+996 996700600600"
                  className="w-full bg-[#f8f9fb] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none border border-transparent focus:border-[#1a73e8] focus:bg-white transition-all placeholder-gray-400"
                />
              </div>

              {/* Left Column 4: Telegram (https://t.me/@prolapagency) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Telegram (https://t.me/@prolapagency)
                </label>
                <input
                  id="input-telegram"
                  type="text"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="+996"
                  className="w-full bg-[#f8f9fb] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none border border-transparent focus:border-[#1a73e8] focus:bg-white transition-all placeholder-gray-400"
                />
              </div>

              {/* Right Column 4 placeholder for grid balance if needed */}
              <div className="hidden md:block" />

            </div>

            {/* Full Width: Описание* */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Описание<span className="text-red-500">*</span>
              </label>
              <textarea
                id="input-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Квартира ..."
                className="w-full bg-[#f8f9fb] rounded-xl p-4 text-sm text-gray-800 outline-none border border-transparent focus:border-[#1a73e8] focus:bg-white transition-all resize-y placeholder-gray-400 min-h-[140px]"
              />
            </div>

            {/* Bottom Action Buttons: Опубликовать & Отмена */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100/60">
              <button
                type="submit"
                id="btn-submit-create-ad"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] active:bg-[#104899] text-white text-sm font-semibold shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Публикация...' : 'Опубликовать'}
              </button>

              <button
                type="button"
                id="btn-cancel-create-ad"
                onClick={handleCancel}
                className="px-8 py-3 rounded-xl bg-[#f5f6f8] hover:bg-[#ebeef2] text-gray-700 text-sm font-semibold transition-all cursor-pointer"
              >
                Отмена
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
};
