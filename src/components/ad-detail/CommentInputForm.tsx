'use client';

import React from 'react';
import { ArrowUp, Smile } from 'lucide-react';

interface CommentInputFormProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOpenAuth: () => void;
  disabled?: boolean;
}

export const CommentInputForm: React.FC<CommentInputFormProps> = ({
  value,
  onChange,
  onSubmit,
  onOpenAuth,
  disabled,
}) => {
  return (
    <form onSubmit={onSubmit} className="relative">
      <div className="flex items-center bg-[#f5f6f8] rounded-2xl px-4 py-2 border border-transparent focus-within:border-blue-300 focus-within:bg-white transition-all">
        <input
          id="comment-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Написать комментарий"
          className="flex-1 bg-transparent text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none pr-2 disabled:opacity-50"
        />
        
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="p-1 text-gray-400 hover:text-gray-600 transition cursor-pointer"
            title="Иконка эмоции"
          >
            <Smile className="w-5 h-5 stroke-[1.75]" />
          </button>

          <button
            type="submit"
            disabled={!value.trim() || disabled}
            className="w-8 h-8 rounded-full bg-[#1976D2] hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-[#1976D2] text-white flex items-center justify-center transition cursor-pointer shadow-xs"
            title="Отправить"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500 text-center sm:text-right pr-2">
        <button
          type="button"
          onClick={onOpenAuth}
          className="text-[#1976D2] font-bold hover:underline cursor-pointer"
        >
          Войти
        </button>
        <span>, чтобы комментировать</span>
      </div>
    </form>
  );
};
