'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  MapPin, 
  Eye, 
  Calendar, 
  ThumbsUp, 
  ThumbsDown, 
  ArrowUp, 
  Heart, 
  ChevronDown, 
  Smile,
  Check,
  ListFilter,
} from 'lucide-react';
import { useSearchParams } from '../hooks/useSearchParams';
import { useAds } from '../hooks/useAds';
import { useUI } from '../hooks/useUI';
import { AdLightboxModal } from './AdLightboxModal';
import { AdItem } from '../types/api';
import { SideBanners } from './SideBanners';

interface CommentItem {
  id: number;
  author: string;
  avatar?: string;
  timeAgo: string;
  text: string;
  likes: number;
  dislikes: number;
  userVote?: 'like' | 'dislike' | null;
}

const DEFAULT_GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop&q=80', // Villa with pool
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80', // House with pool view
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&auto=format&fit=crop&q=80', // Modern living room
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=80', // Interior room sofa
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop&q=80', // Cottage
];

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 1,
    author: 'Асанова Асана',
    timeAgo: '3 д назад',
    text: 'Спасибо, познавательно...',
    likes: 4,
    dislikes: 0,
  },
  {
    id: 2,
    author: 'Асанова Асана',
    timeAgo: '2 д назад',
    text: 'Отличный выбор. Как раз думал купить, теперь уверен на все 100%. Спасибо за обзор!',
    likes: 12,
    dislikes: 1,
  },
  {
    id: 3,
    author: 'Асанова Асана',
    timeAgo: '1 час назад',
    text: 'Здравствуйте! А торг уместен при осмотре?',
    likes: 2,
    dislikes: 0,
  },
];

export const AdDetailPage: React.FC = () => {
  const [searchParams, setSearchParams, , navigate] = useSearchParams();
  const { ads, selectedAd, favoriteIds, toggleFavorite, selectAd } = useAds();
  const { openAuth, notify } = useUI();

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Comments state
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');
  const [sortOrder, setSortOrder] = useState<'popular' | 'newest' | 'oldest'>('popular');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close sorting dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sort comments according to selected order (YouTube style)
  const sortedComments = useMemo(() => {
    const list = [...comments];
    if (sortOrder === 'popular') {
      return list.sort((a, b) => b.likes - a.likes);
    } else if (sortOrder === 'newest') {
      return list.sort((a, b) => b.id - a.id);
    } else if (sortOrder === 'oldest') {
      return list.sort((a, b) => a.id - b.id);
    }
    return list;
  }, [comments, sortOrder]);

  const displayedComments = showAllComments ? sortedComments : sortedComments.slice(0, 5);

  // Resolve current ad data or fallback to demo ad matching Figma screenshots
  const adIdParam = searchParams.get('id');
  const currentAdFromId = adIdParam ? ads.find(a => String(a.id) === adIdParam) : null;
  const currentAd: AdItem = selectedAd || currentAdFromId || {
    id: 999,
    title: '3 комнаты, 92 м², Элитка, 10 этаж, ПСО (под самоотделку)',
    description: 'Разнообразный и богатый опыт начало повседневной работы по формированию позиции позволяет выполнять важные задания по разработке форм развития. Не следует, однако забывать, что постоянный количественный рост и сфера нашей активности позволяет выполнять важные задания по разработке системы обучения кадров, соответствует насущным потребностям. Товарищи! укрепление и развитие структуры играет важную роль в формировании дальнейших направлений развития.',
    price: '7 957 950 KGS',
    address: 'Бишкек',
    views: 348,
    added_date: '30.12.2024 17:43',
    user: {
      id: 88,
      full_name: 'CommunicationDigital',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    },
    category: {
      id: 1,
      name: 'Квартира',
    },
    image: DEFAULT_GALLERY_IMAGES[0],
    images: DEFAULT_GALLERY_IMAGES,
  };

  const galleryImages = currentAd.images && currentAd.images.length > 0 
    ? currentAd.images 
    : currentAd.image 
      ? [currentAd.image, ...DEFAULT_GALLERY_IMAGES.slice(1)]
      : DEFAULT_GALLERY_IMAGES;

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleOpenLightbox = (index: number) => {
    setActiveImageIndex(index);
    setIsLightboxOpen(true);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: CommentItem = {
      id: Date.now(),
      author: 'Вы',
      timeAgo: 'только что',
      text: newCommentText.trim(),
      likes: 0,
      dislikes: 0,
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
    notify('Комментарий успешно добавлен!', 'success');
  };

  const handleVote = (commentId: number, type: 'like' | 'dislike') => {
    setComments(prev => prev.map(c => {
      if (c.id !== commentId) return c;
      if (c.userVote === type) {
        return {
          ...c,
          userVote: null,
          likes: type === 'like' ? c.likes - 1 : c.likes,
          dislikes: type === 'dislike' ? c.dislikes - 1 : c.dislikes,
        };
      }
      const likesDelta = type === 'like' ? 1 : (c.userVote === 'like' ? -1 : 0);
      const dislikesDelta = type === 'dislike' ? 1 : (c.userVote === 'dislike' ? -1 : 0);
      return {
        ...c,
        userVote: type,
        likes: Math.max(0, c.likes + likesDelta),
        dislikes: Math.max(0, c.dislikes + dislikesDelta),
      };
    }));
  };

  // Recent ads (6 cards displayed 2-per-row matching "Последние объявления" in Screenshot 2)
  const recentAdsList = ads.filter(a => a.id !== currentAd.id).slice(0, 6);
  const fallbackRecentAds: AdItem[] = recentAdsList.length >= 4 ? recentAdsList : [
    {
      id: 101,
      title: 'Сдается дом',
      subCategoryTitle: 'Квартира/Мейманкана',
      address: 'Печатники',
      added_date: 'Сегодня в 14:51',
      description: 'Сдается дом на 24 часа специально для студентов которые ываыдвалывадыа',
      price: '2500.00',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop&q=80',
      user: {
        id: 11,
        full_name: 'Asana',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      }
    },
    {
      id: 102,
      title: 'Сдается дом',
      subCategoryTitle: 'Квартира/Мейманкана',
      address: 'Печатники',
      added_date: 'Сегодня в 14:51',
      description: 'Сдается дом на 24 часа специально для студентов которые ываыдвалывадыа',
      price: '2500.00',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop&q=80',
      user: {
        id: 12,
        full_name: 'Asana',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      }
    },
    {
      id: 103,
      title: 'Сдается дом',
      subCategoryTitle: 'Квартира/Мейманкана',
      address: 'Печатники',
      added_date: 'Сегодня в 14:51',
      description: 'Сдается дом на 24 часа специально для студентов которые ываыдвалывадыа',
      price: '2500.00',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop&q=80',
      user: {
        id: 13,
        full_name: 'Asana',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      }
    },
    {
      id: 104,
      title: 'Сдается дом',
      subCategoryTitle: 'Квартира/Мейманкана',
      address: 'Печатники',
      added_date: 'Сегодня в 14:51',
      description: 'Сдается дом на 24 часа специально для студентов которые ываыдвалывадыа',
      price: '2500.00',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop&q=80',
      user: {
        id: 14,
        full_name: 'Asana',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      }
    },
    {
      id: 105,
      title: 'Сдается дом',
      subCategoryTitle: 'Квартира/Мейманкана',
      address: 'Печатники',
      added_date: 'Сегодня в 14:51',
      description: 'Сдается дом на 24 часа специально для студентов которые ываыдвалывадыа',
      price: '2500.00',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop&q=80',
      user: {
        id: 15,
        full_name: 'Asana',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      }
    },
    {
      id: 106,
      title: 'Сдается дом',
      subCategoryTitle: 'Квартира/Мейманкана',
      address: 'Печатники',
      added_date: 'Сегодня в 14:51',
      description: 'Сдается дом на 24 часа специально для студентов которые ываыдвалывадыа',
      price: '2500.00',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop&q=80',
      user: {
        id: 16,
        full_name: 'Asana',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfe] pb-24 sm:pb-16" id="ad-detail-page-container">
      
      {/* 1. Mobile Top Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center justify-between sm:hidden">
        <button
          type="button"
          onClick={handleBackToHome}
          className="w-10 h-10 rounded-full bg-white shadow-xs border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          aria-label="Назад"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <h2 className="text-base font-bold text-gray-900 tracking-tight">
          {currentAd.category?.name || 'Квартира'}
        </h2>

        <div className="w-10" />
      </div>

      {/* 2. Desktop Breadcrumbs Header */}
      <div className="hidden sm:block max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 border-b border-gray-100/80">
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 font-medium">
          <button
            id="btn-back-to-home"
            onClick={handleBackToHome}
            className="flex items-center gap-1 text-gray-700 hover:text-[#1976D2] transition-colors cursor-pointer group"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:-translate-x-0.5 transition-transform" />
            <span className="underline underline-offset-2">На главную</span>
          </button>
          
          <span className="text-gray-300">•</span>
          
          <button 
            onClick={() => setSearchParams({ view: 'filter', category: currentAd.category?.name || 'Квартира' })}
            className="hover:text-[#1976D2] transition-colors cursor-pointer"
          >
            {currentAd.category?.name || 'Сдаю комнату / жилье'}
          </button>
          
          <span className="text-gray-300">&gt;</span>
          
          <span className="text-gray-700 truncate max-w-xs sm:max-w-md font-medium">
            {currentAd.title}
          </span>
        </div>
      </div>

      {/* 3. Main Content Layout */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT MAIN CONTENT COLUMN */}
          <div className="flex-1 min-w-0 space-y-6 sm:space-y-8">
            
            {/* Top Section matching Screenshot 1 exactly */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start" id="ad-detail-hero">
              
              {/* Left: Gallery Column */}
              <div className="md:col-span-6 flex flex-col gap-3">
                
                {/* Main Large Photo */}
                <div 
                  id="main-ad-photo-container"
                  onClick={() => handleOpenLightbox(activeImageIndex)}
                  className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 cursor-pointer group shadow-xs border border-gray-100"
                >
                  <img
                    src={galleryImages[activeImageIndex] || galleryImages[0]}
                    alt={currentAd.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-black/60 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                      Нажмите для увеличения
                    </span>
                  </div>
                </div>

                {/* Horizontal Thumbnails Strip (5 items matching Screenshot 1) */}
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {galleryImages.slice(0, 5).map((img, idx) => {
                    const isActive = idx === activeImageIndex;
                    return (
                      <button
                        key={idx}
                        id={`gallery-thumb-${idx}`}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`aspect-[4/3] rounded-2xl overflow-hidden transition-all cursor-pointer ${
                          isActive
                            ? 'ring-3 ring-[#1976D2] scale-102 shadow-sm'
                            : 'opacity-75 hover:opacity-100 border border-gray-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Миниатюра ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Information Boxes Column (matching Screenshot 1) */}
              <div className="md:col-span-6 flex flex-col gap-4">
                
                {/* Top Info Card */}
                <div className="bg-[#f8fafc] rounded-3xl p-5 sm:p-7 border border-gray-100/90 shadow-xs">
                  
                  {/* Meta info row: Location • Views • Date */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{currentAd.address || 'Бишкек'}</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-gray-400" />
                      <span>{currentAd.views || 348} просмотров</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{currentAd.added_date || '30.12.2024 17:43'}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-gray-900 leading-snug mt-3">
                    {currentAd.title}
                  </h1>

                  {/* Price */}
                  <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3 tracking-tight">
                    {currentAd.price || '7 957 950 KGS'}
                  </div>

                  {/* Seller Row (KAYABUD + CommunicationDigital) */}
                  <div 
                    onClick={() => {
                      setSearchParams({
                        view: 'seller',
                        seller_name: currentAd.user?.full_name || 'CommunicationDigital',
                        seller_phone: currentAd.phone_number || '+996 700 600 600',
                        seller_avatar: currentAd.user?.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80'
                      });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-3 mt-4 py-1 cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-200 flex flex-col items-center justify-center shrink-0 shadow-2xs">
                      <span className="text-[9px] font-black text-rose-600 leading-tight">KAYA</span>
                      <span className="text-[7px] font-bold text-gray-500 leading-tight">BUD</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-bold text-gray-900 group-hover:text-[#1976D2] transition-colors">
                        {currentAd.user?.full_name || 'CommunicationDigital'}
                      </p>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="mt-4 pt-2 border-t border-gray-100/80">
                    <h3 className="text-base font-bold text-gray-900 mb-1.5">
                      Описание
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                      {currentAd.description || 'Разнообразный и богатый опыт начало повседневной работы по формированию позиции позволяет выполнять важные задания по разработке форм развития. Не следует, однако забывать, что постоянный количественный рост и сфера нашей активности позволяет выполнять важные задания по разработке системы обучения кадров, соответствует насущным потребностям. Товарищи! укрепление и развитие структуры играет важную роль в формировании дальнейших направлений развития.'}
                    </p>
                  </div>

                </div>

                {/* Bottom Useful Info Card (matching Screenshot 1) */}
                <div className="bg-[#f8fafc] rounded-3xl p-5 sm:p-6 border border-gray-100/90 shadow-xs">
                  <h4 className="text-sm sm:text-base font-bold text-[#1976D2] mb-1.5">
                    Полезная информация
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Проверяйте перед оплатой. Будьте внимательны. Этот сайт не несет ответственности за достоверность публикуемых объявлений.Избегайте мошенничества.
                  </p>
                </div>

              </div>

            </div>

            {/* 4. Comments Section (matching Mockup with YouTube-style sorting) */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-gray-100 space-y-4" id="comments-section">
              
              {/* Header: Comments Count & YouTube-style Sorting Dropdown */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Комментарии <span className="text-gray-400 font-normal">{comments.length + 12}</span>
                </h3>

                {/* YouTube-style sorting button with popup menu */}
                <div className="relative" ref={sortDropdownRef}>
                  <button 
                    type="button"
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                    id="btn-comments-sort"
                  >
                    <ListFilter className="w-4 h-4 text-gray-500" />
                    <span>
                      {sortOrder === 'popular' && 'Сначала популярные'}
                      {sortOrder === 'newest' && 'Сначала новые'}
                      {sortOrder === 'oldest' && 'Сначала старые'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isSortOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100">
                      <button
                        type="button"
                        onClick={() => {
                          setSortOrder('popular');
                          setIsSortOpen(false);
                        }}
                        className="w-full px-3.5 py-2.5 text-left text-xs font-medium flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer text-gray-800"
                      >
                        <span className={sortOrder === 'popular' ? 'font-bold text-[#1976D2]' : ''}>
                          Сначала популярные
                        </span>
                        {sortOrder === 'popular' && <Check className="w-4 h-4 text-[#1976D2]" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSortOrder('newest');
                          setIsSortOpen(false);
                        }}
                        className="w-full px-3.5 py-2.5 text-left text-xs font-medium flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer text-gray-800"
                      >
                        <span className={sortOrder === 'newest' ? 'font-bold text-[#1976D2]' : ''}>
                          Сначала новые
                        </span>
                        {sortOrder === 'newest' && <Check className="w-4 h-4 text-[#1976D2]" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSortOrder('oldest');
                          setIsSortOpen(false);
                        }}
                        className="w-full px-3.5 py-2.5 text-left text-xs font-medium flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer text-gray-800"
                      >
                        <span className={sortOrder === 'oldest' ? 'font-bold text-[#1976D2]' : ''}>
                          Сначала старые
                        </span>
                        {sortOrder === 'oldest' && <Check className="w-4 h-4 text-[#1976D2]" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Comment Input Box */}
              <form onSubmit={handleAddComment} className="relative">
                <div className="flex items-center bg-[#f5f6f8] rounded-2xl px-4 py-2 border border-transparent focus-within:border-blue-300 focus-within:bg-white transition-all">
                  <input
                    id="comment-input"
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Написать комментарий"
                    className="flex-1 bg-transparent text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none pr-2"
                  />
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      title="Иконка эмоции"
                    >
                      <Smile className="w-5 h-5 stroke-[1.75]" />
                    </button>

                    <button
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="w-8 h-8 rounded-full bg-[#1976D2] hover:bg-[#1565C0] disabled:opacity-40 disabled:hover:bg-[#1976D2] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                      title="Отправить"
                    >
                      <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-500 text-center sm:text-right pr-2">
                  <button
                    type="button"
                    onClick={openAuth}
                    className="text-[#1976D2] font-bold hover:underline cursor-pointer"
                  >
                    Войти
                  </button>
                  <span>, чтобы комментировать</span>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4 pt-1">
                {displayedComments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 items-start group">
                    {/* User Avatar Circle */}
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 shrink-0 mt-0.5 overflow-hidden">
                      <svg className="w-5 h-5 text-gray-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{comment.author}</span>
                        <span className="text-[11px] text-gray-400">{comment.timeAgo}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-800 mt-0.5 leading-relaxed">
                        {comment.text}
                      </p>

                      {/* Action buttons: Reply, Like, Dislike */}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <button 
                          onClick={() => {
                            setNewCommentText(`@${comment.author}, `);
                            document.getElementById('comment-input')?.focus();
                          }}
                          className="font-medium hover:text-[#1976D2] transition-colors cursor-pointer"
                        >
                          Ответить
                        </button>
                        
                        <button
                          onClick={() => handleVote(comment.id, 'like')}
                          className={`flex items-center gap-1 transition-colors cursor-pointer ${
                            comment.userVote === 'like' ? 'text-[#1976D2] font-bold' : 'hover:text-gray-900'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5 stroke-[2]" />
                          <span>{comment.likes}</span>
                        </button>

                        <button
                          onClick={() => handleVote(comment.id, 'dislike')}
                          className={`flex items-center gap-1 transition-colors cursor-pointer ${
                            comment.userVote === 'dislike' ? 'text-rose-500 font-bold' : 'hover:text-gray-900'
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5 stroke-[2]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show more comments button */}
              <div className="pt-2">
                <button
                  onClick={() => setShowAllComments(!showAllComments)}
                  className="text-xs font-bold text-gray-900 hover:text-[#1976D2] transition-colors cursor-pointer"
                >
                  {showAllComments ? 'Скрыть комментарии' : 'Ещё 6 комментариев'}
                </button>
              </div>

            </div>

            {/* 5. "Последние объявления" Section (2 columns side by side matching Screenshot 2) */}
            <div className="pt-4" id="latest-ads-container">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-5 tracking-tight">
                Последние объявления
              </h2>

              {/* 2-Columns Grid Layout with Horizontal Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {fallbackRecentAds.map((ad) => {
                  const isFav = favoriteIds.includes(ad.id);

                  return (
                    <div
                      key={ad.id}
                      id={`latest-ad-item-${ad.id}`}
                      onClick={() => {
                        selectAd(ad);
                        setSearchParams({ view: 'ad', id: String(ad.id) }, { pathname: '/ad' });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white rounded-3xl border border-gray-100/90 p-3 sm:p-4 shadow-xs hover:shadow-md hover:border-blue-200 transition-all duration-200 flex gap-3.5 sm:gap-4 cursor-pointer group"
                    >
                      {/* Left Thumbnail (rounded 24px) */}
                      <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={ad.image || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop&q=80'}
                          alt={ad.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Right Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="text-base sm:text-lg font-bold text-[#1976D2] group-hover:underline line-clamp-1">
                            {ad.title}
                          </h4>
                          
                          <p className="text-xs text-gray-400 font-medium mt-1 truncate">
                            {ad.subCategoryTitle || 'Квартира/Мейманкана'} - ({ad.address || 'Печатники'}) - {ad.added_date || 'Сегодня в 14:51'} - {ad.price ? `${ad.price} Руб` : '2500.00 Руб'}
                          </p>
                          
                          <p className="text-xs sm:text-sm text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                            {ad.description || 'Сдается дом на 24 часа специально для студентов которые ываыдвалывадыа'}
                          </p>
                        </div>

                        {/* Author + Blue Heart Button in Circle */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden shrink-0">
                              <img
                                src={ad.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                                alt="Author"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate">
                              {ad.user?.full_name || 'Asana'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(ad.id);
                            }}
                            className="w-8 h-8 rounded-full bg-blue-50/80 hover:bg-blue-100 flex items-center justify-center transition-all cursor-pointer"
                            aria-label="В избранное"
                            suppressHydrationWarning
                          >
                            <Heart 
                              className={`w-4 h-4 transition-transform active:scale-125 text-[#1976D2] ${
                                isFav ? 'fill-[#1976D2]' : 'fill-transparent stroke-[2]'
                              }`} 
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: SIDE BANNERS (Desktop Only) */}
          <div className="hidden lg:block">
            <SideBanners count={4} />
          </div>

        </div>
      </div>

      {/* 6. Fullscreen Lightbox Modal */}
      <AdLightboxModal
        isOpen={isLightboxOpen}
        images={galleryImages}
        currentIndex={activeImageIndex}
        onClose={() => setIsLightboxOpen(false)}
        onSelectIndex={(index) => setActiveImageIndex(index)}
      />

    </div>
  );
};
