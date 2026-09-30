import React from 'react';
import {
  BriefcaseArt,
  ShoppingBagsArt,
  SkyscraperArt,
  WhiteSuvArt,
  YellowTaxiArt,
  BlueTruckArt,
  MedicalCareArt,
  CoffeeMachineArt,
} from '../CategoryArt';

export const renderCategoryTitle = (name: string): React.ReactNode => {
  switch (name) {
    case 'Грузоперевозка':
      return <><span className="block">Грузо-</span><span className="block">перевозка</span></>;
    case 'Техника и Электроника':
      return <><span className="block">Техника и</span><span className="block">электроника</span></>;
    case 'Такси заезд-выезд':
      return <><span className="block">Такси</span><span className="block">заезд-выезд</span></>;
    case 'Товары Кыргызста':
    case 'Товары Кыргызстана':
      return <><span className="block">Товары</span><span className="block">Кыргызстана</span></>;
    case 'Медицинский услуги':
    case 'Медицинские услуги':
      return <><span className="block">Медицинские</span><span className="block">услуги</span></>;
    case 'Продукты питания':
      return <><span className="block">Продукты</span><span className="block">питания</span></>;
    case 'Интернет магазин':
      return <><span className="block">Интернет</span><span className="block">магазин</span></>;
    case 'Продам товар':
      return <><span className="block">Продам</span><span className="block">товар</span></>;
    case 'Продам авто':
      return <><span className="block">Продам</span><span className="block">авто</span></>;
    case 'Ищу работу':
      return <><span className="block">Ищу</span><span className="block">работу</span></>;
    case 'Москва-Бишкек':
      return <><span className="block">Москва-</span><span className="block">Бишкек</span></>;
    default:
      return <span>{name}</span>;
  }
};

export const getCategoryAsset = (item: { name: string; image?: string; icon?: string }) => {
  if (item.image || item.icon) {
    return (
      <img 
        src={item.image || item.icon} 
        alt={item.name}
        loading="lazy"
        decoding="async"
        className="w-full h-full max-h-9 sm:max-h-10 xl:max-h-11 object-contain"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    );
  }

  const n = item.name.toLowerCase();
  if (n.includes('ваканс') || n.includes('работ') || n.includes('жумуш')) {
    return <BriefcaseArt className="w-full h-full max-h-9 sm:max-h-10 xl:max-h-11 object-contain" />;
  }
  if (n.includes('снять') || n.includes('сдам') || n.includes('недвиж') || n.includes('жиль')) {
    return <SkyscraperArt className="w-full h-full max-h-9 sm:max-h-10 xl:max-h-11 object-contain" />;
  }
  if (n.includes('прод') || n.includes('купл') || n.includes('товар')) {
    return <ShoppingBagsArt className="w-full h-full max-h-9 sm:max-h-10 xl:max-h-11 object-contain" />;
  }
  if (n.includes('авто') || n.includes('машин') || n.includes('транспорт')) {
    return <WhiteSuvArt className="w-full h-full max-h-8 sm:max-h-9 xl:max-h-10 object-contain" />;
  }
  if (n.includes('такси')) {
    return <YellowTaxiArt className="w-full h-full max-h-8 sm:max-h-9 xl:max-h-10 object-contain" />;
  }
  if (n.includes('груз')) {
    return <BlueTruckArt className="w-full h-full max-h-9 sm:max-h-9 xl:max-h-10 object-contain" />;
  }
  if (n.includes('сервис') || n.includes('услуг')) {
    return <MedicalCareArt className="w-full h-full max-h-9 sm:max-h-10 xl:max-h-11 object-contain" />;
  }
  if (n.includes('техник') || n.includes('электрон')) {
    return <CoffeeMachineArt className="w-full h-full max-h-9 sm:max-h-10 xl:max-h-11 object-contain" />;
  }
  return <BriefcaseArt className="w-full h-full max-h-9 sm:max-h-10 xl:max-h-11 object-contain" />;
};
