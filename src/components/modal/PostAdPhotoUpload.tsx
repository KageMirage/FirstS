'use client';

import React from 'react';
import { Upload } from 'lucide-react';

interface PostAdPhotoUploadProps {
  imagePreview: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PostAdPhotoUpload: React.FC<PostAdPhotoUploadProps> = ({
  imagePreview,
  onImageChange,
}) => {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
        Фотография
      </label>
      <label className="border-2 border-dashed border-gray-300 hover:border-[#1a73e8] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-blue-50/20">
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
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
  );
};
