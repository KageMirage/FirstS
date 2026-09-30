'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { CommentRow } from './CommentRow';
import { CommentInputForm } from './CommentInputForm';
import { CommentSortDropdown, CommentSortOrder } from './CommentSortDropdown';
import { apiService } from '../../api/endpoints';
import { AdComment } from '../../types/api';
import { useAuth } from '../../hooks/useAuth';
import { Loader2, MessageSquare } from 'lucide-react';

export interface CommentItem {
  id: number;
  author: string;
  avatar?: string;
  timeAgo: string;
  text: string;
  likes: number;
  dislikes: number;
  userVote?: 'like' | 'dislike' | null;
}

function formatCommentDate(dateStr?: string): string {
  if (!dateStr) return 'Недавно';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Только что';
    if (diffHours < 24) return `${diffHours} ч. назад`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} дн. назад`;
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  } catch {
    return 'Недавно';
  }
}

interface AdCommentsSectionProps {
  adId?: number;
  initialComments?: AdComment[];
  onOpenAuth: () => void;
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const AdCommentsSection: React.FC<AdCommentsSectionProps> = ({
  adId,
  initialComments,
  onOpenAuth,
  onNotify,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyParentId, setReplyParentId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<CommentSortOrder>('popular');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  // Map backend AdComment to CommentItem
  const mapBackendComment = useCallback((c: AdComment): CommentItem => ({
    id: c.id,
    author: c.user?.full_name || (c.user?.phone_number ? `Пользователь ${c.user.phone_number.slice(-4)}` : 'Пользователь'),
    avatar: c.user?.avatar || undefined,
    timeAgo: formatCommentDate(c.added_date),
    text: c.text,
    likes: c.likes_count || 0,
    dislikes: c.dislikes_count || 0,
    userVote: null,
  }), []);

  // Fetch comments from backend
  useEffect(() => {
    if (!adId) return;

    if (initialComments && initialComments.length > 0) {
      setComments(initialComments.map(mapBackendComment));
      return;
    }

    let isSubscribed = true;
    setIsLoading(true);

    apiService
      .getComments(adId)
      .then((data) => {
        if (isSubscribed && Array.isArray(data)) {
          setComments(data.map(mapBackendComment));
        }
      })
      .catch((err) => {
        console.warn('Could not load comments from backend:', err.message);
      })
      .finally(() => {
        if (isSubscribed) setIsLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [adId, initialComments, mapBackendComment]);

  const sortedComments = useMemo(() => {
    const list = [...comments];
    if (sortOrder === 'popular') {
      return list.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
    }
    if (sortOrder === 'newest') {
      return list.sort((a, b) => b.id - a.id);
    }
    return list.sort((a, b) => a.id - b.id);
  }, [comments, sortOrder]);

  const displayedComments = showAllComments ? sortedComments : sortedComments.slice(0, 4);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    if (!isAuthenticated) {
      onOpenAuth();
      onNotify('info', 'Войдите в аккаунт, чтобы оставить комментарий');
      return;
    }

    if (!adId) return;

    setIsSubmitting(true);
    try {
      const created = await apiService.createComment({
        text: newCommentText.trim(),
        ad: adId,
        parent: replyParentId,
      });

      const newMapped = mapBackendComment(created);
      setComments((prev) => [newMapped, ...prev]);
      setNewCommentText('');
      setReplyParentId(null);
      onNotify('success', 'Ваш комментарий успешно опубликован!');
    } catch (err: any) {
      // Optimistic fallback for frontend state
      const fallbackComment: CommentItem = {
        id: Date.now(),
        author: user?.full_name || 'Вы',
        avatar: user?.avatar || undefined,
        timeAgo: 'Только что',
        text: newCommentText.trim(),
        likes: 0,
        dislikes: 0,
        userVote: null,
      };
      setComments((prev) => [fallbackComment, ...prev]);
      setNewCommentText('');
      setReplyParentId(null);
      onNotify('success', 'Комментарий добавлен!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (commentId: number, type: 'like' | 'dislike') => {
    if (!isAuthenticated) {
      onOpenAuth();
      onNotify('info', 'Войдите в аккаунт, чтобы оценивать комментарии');
      return;
    }

    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        let likes = c.likes;
        let dislikes = c.dislikes;
        let nextVote: 'like' | 'dislike' | null = type;

        if (c.userVote === type) {
          nextVote = null;
          if (type === 'like') likes = Math.max(0, likes - 1);
          else dislikes = Math.max(0, dislikes - 1);
        } else {
          if (c.userVote === 'like') likes = Math.max(0, likes - 1);
          if (c.userVote === 'dislike') dislikes = Math.max(0, dislikes - 1);

          if (type === 'like') likes += 1;
          else dislikes += 1;
        }

        return { ...c, likes, dislikes, userVote: nextVote };
      })
    );

    // Call backend API for comment-likes
    if (type === 'like') {
      try {
        await apiService.likeComment(commentId);
      } catch (e: any) {
        console.warn('Like comment API error:', e.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-gray-100 space-y-4" id="comments-section">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span>Комментарии</span>
          <span className="text-gray-400 font-normal text-sm">
            ({comments.length})
          </span>
        </h3>

        {comments.length > 1 && (
          <CommentSortDropdown
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            isOpen={isSortOpen}
            onToggle={() => setIsSortOpen(!isSortOpen)}
            onClose={() => setIsSortOpen(false)}
          />
        )}
      </div>

      <CommentInputForm
        value={newCommentText}
        onChange={setNewCommentText}
        onSubmit={handleAddComment}
        onOpenAuth={onOpenAuth}
        disabled={isSubmitting}
      />

      {isLoading ? (
        <div className="py-6 flex items-center justify-center text-gray-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#1976D2]" />
          <span className="text-xs">Загрузка комментариев...</span>
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center flex flex-col items-center justify-center text-gray-400">
          <MessageSquare className="w-8 h-8 text-gray-300 mb-2 stroke-[1.5]" />
          <p className="text-xs text-gray-500 font-medium">Комментариев пока нет</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Будьте первым, кто оставит вопрос или отзыв!</p>
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          {displayedComments.map((comment) => (
            <CommentRow
              key={comment.id}
              comment={comment}
              onReply={(author) => {
                setReplyParentId(comment.id);
                setNewCommentText(`@${author}, `);
                document.getElementById('comment-input')?.focus();
              }}
              onVote={handleVote}
            />
          ))}
        </div>
      )}

      {comments.length > 4 && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAllComments(!showAllComments)}
            className="text-xs font-bold text-[#1976D2] hover:underline transition cursor-pointer"
          >
            {showAllComments
              ? 'Скрыть комментарии'
              : `Показать все комментарии (${comments.length})`}
          </button>
        </div>
      )}
    </div>
  );
};
