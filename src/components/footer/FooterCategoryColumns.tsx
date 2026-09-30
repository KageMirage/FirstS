'use client';

import React from 'react';
import { Category } from '../../types/api';
import { FooterModalType } from './FooterModals';

interface FooterCategoryColumnsProps {
  categories: Category[];
  onCategoryClick: (name: string) => void;
  onOpenModal: (modal: FooterModalType) => void;
}

export const FooterCategoryColumns: React.FC<FooterCategoryColumnsProps> = ({
  categories,
  onCategoryClick,
  onOpenModal,
}) => {
  const half = Math.ceil(categories.length / 2);
  const col1Categories = categories.slice(0, half);
  const col2Categories = categories.slice(half);

  return (
    <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-neutral-300 font-light">
      <div className="space-y-3">
        {col1Categories.length === 0 ? (
          <p className="text-neutral-500">Загрузка...</p>
        ) : (
          col1Categories.map((cat) => (
            <p key={cat.id}>
              <button
                type="button"
                onClick={() => onCategoryClick(cat.name)}
                className="hover:text-white transition-colors cursor-pointer text-left truncate block max-w-[200px]"
              >
                {cat.name}
              </button>
            </p>
          ))
        )}
      </div>

      <div className="space-y-3">
        {col2Categories.map((cat) => (
          <p key={cat.id}>
            <button
              type="button"
              onClick={() => onCategoryClick(cat.name)}
              className="hover:text-white transition-colors cursor-pointer text-left truncate block max-w-[200px]"
            >
              {cat.name}
            </button>
          </p>
        ))}
      </div>

      <div className="space-y-3">
        <p>
          <button
            type="button"
            onClick={() => onOpenModal('contacts')}
            className="hover:text-white transition-colors cursor-pointer text-left"
          >
            Контакты
          </button>
        </p>
        <p>
          <button
            type="button"
            onClick={() => onOpenModal('privacy')}
            className="hover:text-white transition-colors cursor-pointer text-left"
          >
            Политика конфиденциальности
          </button>
        </p>
        <p>
          <button
            type="button"
            onClick={() => onOpenModal('terms')}
            className="hover:text-white transition-colors cursor-pointer text-left"
          >
            Условия пользования
          </button>
        </p>
      </div>
    </div>
  );
};
