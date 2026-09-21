'use client';

import React from 'react';
import { 
  Star, 
  Briefcase, 
  GraduationCap, 
  Search, 
  Headphones, 
  Home, 
  Car,
  ShoppingBag,
  Tag
} from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useSearchParams } from '../hooks/useSearchParams';

interface TopPillsBarProps {
  className?: string;
  style?: React.CSSProperties;
}

export const TopPillsBar: React.FC<TopPillsBarProps> = ({ className = '', style }) => {
  const { topPills, setPill } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentPill = searchParams.get('pill') || (currentCategory ? '' : 'popular');

  const getPillBadge = (pill: { id: string; name: string; icon?: string; image?: string; color?: string }, isActive: boolean) => {
    if (isActive) {
      return (
        <span className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shrink-0 mr-2 shadow-2xs">
          {pill.id === 'popular' ? (
            <Star className="w-3.5 h-3.5 fill-[#1976D2] text-[#1976D2]" />
          ) : pill.icon ? (
            <img src={pill.icon} alt="" className="w-3.5 h-3.5 object-contain" />
          ) : (
            <Tag className="w-3.5 h-3.5 text-[#1976D2]" />
          )}
        </span>
      );
    }

    if (pill.id === 'popular') {
      return (
        <span className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mr-2 text-[#1976D2]">
          <Star className="w-3.5 h-3.5 fill-current" />
        </span>
      );
    }

    if (pill.icon) {
      return (
        <span className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shrink-0 mr-2 shadow-2xs">
          <img src={pill.icon} alt="" className="w-3.5 h-3.5 object-contain" />
        </span>
      );
    }

    const n = pill.name.toLowerCase();
    if (n.includes('ваканс') || n.includes('работ') || n.includes('жумуш')) {
      return (
        <span className="w-6 h-6 rounded-lg bg-[#F3E5F5] flex items-center justify-center shrink-0 mr-2 text-[#AB47BC]">
          <Briefcase className="w-3.5 h-3.5 stroke-[2.2]" />
        </span>
      );
    }
    if (n.includes('снять') || n.includes('сдам') || n.includes('жиль') || n.includes('квартир')) {
      return (
        <span className="w-6 h-6 rounded-lg bg-[#E1F5FE] flex items-center justify-center shrink-0 mr-2 text-[#0288D1]">
          <Home className="w-3.5 h-3.5 stroke-[2.2]" />
        </span>
      );
    }
    if (n.includes('прод') || n.includes('купл') || n.includes('товар')) {
      return (
        <span className="w-6 h-6 rounded-lg bg-[#EDE7F6] flex items-center justify-center shrink-0 mr-2 text-[#7E57C2]">
          <ShoppingBag className="w-3.5 h-3.5 stroke-[2.2]" />
        </span>
      );
    }
    if (n.includes('сервис') || n.includes('услуг')) {
      return (
        <span className="w-6 h-6 rounded-lg bg-[#E0F7FA] flex items-center justify-center shrink-0 mr-2 text-[#00ACC1]">
          <Headphones className="w-3.5 h-3.5 stroke-[2.2]" />
        </span>
      );
    }
    if (n.includes('ищу') || n.includes('издейм')) {
      return (
        <span className="w-6 h-6 rounded-lg bg-[#FFF3E0] flex items-center justify-center shrink-0 mr-2 text-[#FB8C00]">
          <Search className="w-3.5 h-3.5 stroke-[2.2]" />
        </span>
      );
    }
    if (n.includes('транспорт') || n.includes('такси') || n.includes('авто')) {
      return (
        <span className="w-6 h-6 rounded-lg bg-[#FFFDE7] flex items-center justify-center shrink-0 mr-2 text-[#FBC02D]">
          <Car className="w-3.5 h-3.5 stroke-[2.2]" />
        </span>
      );
    }
    if (n.includes('обучен') || n.includes('курс')) {
      return (
        <span className="w-6 h-6 rounded-lg bg-[#E8F5E9] flex items-center justify-center shrink-0 mr-2 text-[#2E7D32]">
          <GraduationCap className="w-3.5 h-3.5 stroke-[2.2]" />
        </span>
      );
    }

    return (
      <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mr-2 text-gray-500">
        <Tag className="w-3.5 h-3.5 stroke-[2]" />
      </span>
    );
  };

  const handlePillClick = (pill: { id: string; name: string }) => {
    setPill(pill.id);
    if (pill.id === 'popular') {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('view', 'filter');
          next.delete('category');
          next.delete('pill');
          next.set('page', '1');
          return next;
        },
        { pathname: '/filter' }
      );
    } else {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('view', 'filter');
          next.set('category', pill.name);
          next.set('pill', pill.id);
          next.set('page', '1');
          return next;
        },
        { pathname: '/filter' }
      );
    }
  };

  return (
    <div 
      className={`py-3 overflow-x-auto no-scrollbar ${className}`.trim()} 
      style={style}
      id="top-pills-bar"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2.5 min-w-max">
        {topPills.map((pill) => {
          const isActive = currentPill === pill.id || (pill.id !== 'popular' && currentCategory === pill.name);
          return (
            <button
              key={pill.id}
              id={`pill-${pill.id}`}
              onClick={() => handlePillClick(pill)}
              className={`inline-flex items-center px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl text-xs sm:text-[13px] font-medium whitespace-nowrap transition-all duration-150 select-none cursor-pointer ${
                isActive
                  ? 'bg-[#1976D2] text-white shadow-xs font-semibold'
                  : 'bg-[#F0F2F5] hover:bg-[#E4E6EB] text-[#202124]'
              }`}
            >
              {getPillBadge(pill, isActive)}
              <span>{pill.name}</span>
              {typeof pill.count === 'number' && (
                <span className={`ml-1.5 text-[11px] font-normal ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                  ({pill.count})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};


