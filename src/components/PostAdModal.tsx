'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useUI } from '../hooks/useUI';
import { useAds } from '../hooks/useAds';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../hooks/useAuth';
import { AdItem } from '../types/api';
import { PostAdPhotoUpload } from './modal/PostAdPhotoUpload';
import { PostAdBasicFields } from './modal/PostAdBasicFields';
import { DEFAULT_USER_AVATAR } from '../utils/authStorage';

export const PostAdModal: React.FC = () => {
  const { isPostAdOpen, closePostAd } = useUI();
  const { publishAd, isPosting } = useAds();
  const { categories } = useCategories();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<string>('2');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '+996 700 600 600');
  const [address, setAddress] = useState('Бишкек, Кыргызстан');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (user?.phone_number) {
      setPhoneNumber(user.phone_number);
    }
  }, [user]);

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
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('price', price.trim());
    formData.append('category', categoryId);
    formData.append('phone_number', phoneNumber);
    formData.append('address', address);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const cleanNum = parseFloat(price.replace(/\s+/g, ''));
    const finalPrice = isNaN(cleanNum) ? price : cleanNum;
    const catName = categories.find((c) => c.id === Number(categoryId))?.name || 'Разное';

    const localItem: AdItem = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      price: finalPrice,
      address,
      phone_number: phoneNumber,
      whatsapp_number: phoneNumber,
      image: imagePreview || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80',
      user: {
        id: user?.id || Date.now(),
        full_name: user?.full_name || 'user',
        avatar: user?.avatar || DEFAULT_USER_AVATAR,
        phone_number: phoneNumber,
      },
      category: {
        id: Number(categoryId),
        name: catName,
      },
      views: 1,
      favorites_count: 0,
      is_favorite: false,
      subCategoryTitle: catName,
      formattedDate: `Сегодня - ${price} сом`,
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
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <PostAdBasicFields
            title={title}
            onTitleChange={setTitle}
            categoryId={categoryId}
            onCategoryChange={setCategoryId}
            categories={categories}
            price={price}
            onPriceChange={setPrice}
            description={description}
            onDescriptionChange={setDescription}
            phoneNumber={phoneNumber}
            onPhoneNumberChange={setPhoneNumber}
            address={address}
            onAddressChange={setAddress}
          />

          <PostAdPhotoUpload
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
          />

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={closePostAd}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isPosting}
              className="px-6 py-2.5 rounded-xl bg-[#1976D2] hover:bg-blue-700 text-white text-sm font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isPosting ? 'Публикация...' : 'Опубликовать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
