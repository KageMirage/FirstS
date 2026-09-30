'use client';

import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { CommentItem } from './AdCommentsSection';

interface CommentRowProps {
  comment: CommentItem;
  onReply: (author: string) => void;
  onVote: (commentId: number, type: 'like' | 'dislike') => void;
}

export const CommentRow: React.FC<CommentRowProps> = ({
  comment,
  onReply,
  onVote,
}) => {
  return (
    <div className="flex gap-3 items-start group">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 shrink-0 mt-0.5 overflow-hidden">
        {comment.avatar ? (
          <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
        ) : (
          <svg className="w-5 h-5 text-gray-400 fill-current" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-900">{comment.author}</span>
          <span className="text-[11px] text-gray-400">{comment.timeAgo}</span>
        </div>
        <p className="text-xs sm:text-sm text-gray-800 mt-0.5 leading-relaxed">
          {comment.text}
        </p>

        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <button 
            type="button"
            onClick={() => onReply(comment.author)}
            className="font-medium hover:text-[#1976D2] transition cursor-pointer"
          >
            Ответить
          </button>
          
          <button
            type="button"
            onClick={() => onVote(comment.id, 'like')}
            className={`flex items-center gap-1 transition cursor-pointer ${
              comment.userVote === 'like' ? 'text-[#1976D2] font-bold' : 'hover:text-gray-900'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5 stroke-[2]" />
            <span>{comment.likes}</span>
          </button>

          <button
            type="button"
            onClick={() => onVote(comment.id, 'dislike')}
            className={`flex items-center gap-1 transition cursor-pointer ${
              comment.userVote === 'dislike' ? 'text-rose-500 font-bold' : 'hover:text-gray-900'
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  );
};
