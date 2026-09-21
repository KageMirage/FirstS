'use client';

import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { TopPillsBar } from './TopPillsBar';
import { CategoryCardsGrid } from './CategoryCardsGrid';
import { LatestAdsSection } from './LatestAdsSection';
import { useSearchParams } from '../hooks/useSearchParams';

export const FilterPage: React.FC = () => {
  const [, setSearchParams, , navigate] = useSearchParams();

  const breadcrumbItems = [
    {
      label: 'Главная',
      onClick: () => {
        navigate('/');
      },
    },
    {
      label: 'Фильтр',
      active: true,
    },
  ];

  return (
    <div className="space-y-4 pb-16" id="filter-page-container">
      
      {/* 1. Breadcrumbs matching Screenshot 2: Главная > Фильтр */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* 2. Top Category Pills Bar */}
      <TopPillsBar 
        style={{
          backgroundColor: '#fbfefe',
          borderStyle: 'none',
          paddingTop: '12px',
          paddingBottom: '0px',
        }}
      />

      {/* 3. Category Cards Grid (14 categories) */}
      <CategoryCardsGrid />

      {/* 4. Main Filter Section: Left Filter Sidebar + 3 Banners, Right 10 Ads Grid (2 cols x 5 rows) + Pagination */}
      <LatestAdsSection />

    </div>
  );
};

