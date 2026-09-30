'use client';

import React, { useRef } from 'react';
import { Pencil, X } from 'lucide-react';

export interface UploadedImage {
  id: string;
  url: string;
  isEditing?: boolean;
}

interface CreateAdPhotoUploaderProps {
  images: UploadedImage[];
  onAddImages: (newImages: UploadedImage[]) => void;
  onRemoveImage: (id: string) => void;
}

export const CreateAdPhotoUploader: React.FC<CreateAdPhotoUploaderProps> = ({
  images,
  onAddImages,
  onRemoveImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emptySlotsCount = Math.max(0, 10 - images.length);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newUploaded: UploadedImage[] = [];
    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newUploaded.push({
          id: `img-${Date.now()}-${index}`,
          url: event.target?.result as string,
        });
        if (newUploaded.length === files.length) {
          onAddImages(newUploaded);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-800 mb-3">
        Загрузить фото
      </h3>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        id="photo-file-input"
      />

      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {images.map((img, index) => (
          <div
            key={img.id}
            className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-100 group border border-gray-200/80 shadow-xs"
          >
            <img
              src={img.url}
              alt={`Фото ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {img.isEditing && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs">
                  <Pencil className="w-3.5 h-3.5" />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => onRemoveImage(img.id)}
              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer shadow-xs"
              title="Удалить фото"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {Array.from({ length: emptySlotsCount }).map((_, index) => (
          <button
            key={`empty-${index}`}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#f3f4f6] hover:bg-[#eaebed] border border-transparent hover:border-gray-300 transition flex items-center justify-center cursor-pointer group"
            title="Добавить фото"
          >
            <svg
              className="w-8 h-8 text-gray-400 group-hover:scale-105 transition-transform"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};
