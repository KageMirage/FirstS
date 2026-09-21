'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  BadgePercent, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

interface HeroBannerProps {
  onOpenAIAdvisor: () => void;
  onOpenMortgage: () => void;
  onSelectStyle: (style: string) => void;
  totalHousesCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenAIAdvisor,
  onOpenMortgage,
  onSelectStyle,
  totalHousesCount,
}) => {
  return (
    <div className="relative overflow-hidden bg-slate-950 text-white rounded-3xl mx-4 sm:mx-6 my-6 shadow-2xl border border-slate-800">
      {/* Background Graphic & Atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
          alt="Modern Architectural House"
          className="w-full h-full object-cover opacity-25 object-center mix-blend-luminosity scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 sm:py-16 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Column: Value Proposition */}
        <div className="max-w-2xl space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Акция месяца: Скидка до 6% + Проект в подарок при заказе под ключ
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Интернет-магазин <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              загородных домов и коттеджей
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
            Выберите готовый архитектурный проект или закажите строительство под ключ от {totalHousesCount} авторских моделей. Онлайн-конфигуратор с точным расчетом сметы в реальном времени.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={onOpenAIAdvisor}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Подобрать дом с AI Архитектором</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenMortgage}
              className="px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm transition-all hover:border-slate-500 cursor-pointer flex items-center gap-2"
            >
              <BadgePercent className="w-4 h-4 text-amber-400" />
              <span>Рассчитать ипотеку от 4.5%</span>
            </button>
          </div>

          {/* Quick Style Switchers */}
          <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs">
            <span className="text-slate-400 font-medium">Популярные стили:</span>
            {['Барнхаус', 'Скандинавский', 'Hi-Tech', 'Шале', 'Фахверк'].map((style) => (
              <button
                key={style}
                onClick={() => onSelectStyle(style)}
                className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Key Trust Badges & Stats Card */}
        <div className="w-full lg:w-80 shrink-0 bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Стандарты качества
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              ГОСТ 2026
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-white">Гарантия до 30 лет</h2>
                <p className="text-slate-400 text-[11px]">Официальный договор с фиксированной сметой</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-teal-950 text-teal-400 shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-white">Сроки от 25 до 90 дней</h2>
                <p className="text-slate-400 text-[11px]">Заводская подготовка комплектующих</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-amber-950 text-amber-400 shrink-0 mt-0.5">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-white">Энергоэффективность А+</h2>
                <p className="text-slate-400 text-[11px]">Экономия до 45% на отоплении зимой</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 450+ объектов
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 12 лет на рынке
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
