import { AdItem } from '../types/api';

export interface AdFilterOptions {
  query?: string;
  category?: string;
  region?: string;
  minPrice?: string;
  maxPrice?: string;
  hasPhotoOnly?: boolean;
}

export const isCategoryMatch = (ad: any, categoryFilter: string): boolean => {
  if (!categoryFilter || categoryFilter === 'Во всех категориях' || categoryFilter === 'all') {
    return true;
  }
  const f = categoryFilter.toLowerCase().trim();
  if (!f) return true;

  // Direct category values from ad
  const adCatName = typeof ad.category === 'object' ? (ad.category?.name || '').toLowerCase().trim() : '';
  const adCatId = typeof ad.category === 'object' ? String(ad.category?.id ?? '') : String(ad.category ?? '');

  const adParentCatName = typeof ad.parent_category === 'object'
    ? (ad.parent_category?.name || '').toLowerCase().trim()
    : (typeof ad.category === 'object' && ad.category?.parent_category?.name ? ad.category.parent_category.name.toLowerCase().trim() : '');
  const adParentCatId = typeof ad.parent_category === 'object' ? String(ad.parent_category?.id ?? '') : '';

  const adSubTitle = (ad.subCategoryTitle || '').toLowerCase().trim();

  // 1. Numeric ID match (when filter is category ID)
  if (/^\d+$/.test(f)) {
    if (adCatId === f || adParentCatId === f) {
      return true;
    }
  }

  // 2. Direct string equality or clean substring matches against actual category names
  if (adCatName) {
    if (adCatName === f || adCatName.includes(f) || f.includes(adCatName)) {
      return true;
    }
  }
  if (adParentCatName) {
    if (adParentCatName === f || adParentCatName.includes(f) || f.includes(adParentCatName)) {
      return true;
    }
  }
  if (adSubTitle && adSubTitle !== 'объявление') {
    if (adSubTitle === f || adSubTitle.includes(f) || f.includes(adSubTitle)) {
      return true;
    }
  }

  // 3. Normalized slug / semantic keyword mapping
  const categoryKeywords: Record<string, string[]> = {
    'nedvizhimost': ['недвиж', 'квартир', 'комнат', 'дом', 'участ', 'аренд', 'сдам', 'сниму', 'посуточн', 'мейманкана', 'койко'],
    'transport': ['транспорт', 'авто', 'машин', 'такси', 'перевозк', 'доставк', 'грузоперевозк', 'спринтер', 'попутчик', 'бишкек', 'ош'],
    'rabota': ['работ', 'ваканс', 'требует', 'ищу работ', 'зарплат', 'подработк', 'курьер', 'повар', 'швея', 'стройка'],
    'uslugi': ['услуг', 'сервис', 'ремонт', 'юрист', 'массаж', 'клининг', 'уборк', 'мастер', 'курсы', 'переводчик', 'нотариус'],
    'medicina': ['медицин', 'врач', 'стоматолог', 'узи', 'анализ', 'айза-мед', 'клиник', 'лечени', 'аптек', 'капельниц'],
    'elektronika': ['электроник', 'телефон', 'iphone', 'ноутбук', 'компьютер', 'бытов', 'техник'],
  };

  const matchedKeywords = categoryKeywords[f] || (
    Object.entries(categoryKeywords).find(([key]) => f.includes(key))?.[1]
  );

  if (matchedKeywords) {
    const searchTarget = `${adCatName} ${adParentCatName} ${adSubTitle}`.toLowerCase();
    if (matchedKeywords.some((keyword) => searchTarget.includes(keyword))) {
      return true;
    }
  }

  return false;
};

export const filterAdsList = (ads: AdItem[], options: AdFilterOptions): AdItem[] => {
  const { query = '', category = '', region = '', minPrice = '', maxPrice = '', hasPhotoOnly = false } = options;
  const q = query.trim().toLowerCase();
  const cat = category.trim();
  const reg = region.trim().toLowerCase();
  const min = minPrice.trim() ? parseFloat(minPrice) : null;
  const max = maxPrice.trim() ? parseFloat(maxPrice) : null;

  return ads.filter((ad) => {
    // 1. Query search
    if (q) {
      const matchTitle = (ad.title || '').toLowerCase().includes(q);
      const matchDesc = (ad.description || '').toLowerCase().includes(q);
      const matchAddress = (ad.address || '').toLowerCase().includes(q);
      const matchUser = (ad.user?.full_name || '').toLowerCase().includes(q);
      const matchSub = (ad.subCategoryTitle || '').toLowerCase().includes(q);

      if (!matchTitle && !matchDesc && !matchAddress && !matchUser && !matchSub) {
        return false;
      }
    }

    // 2. Category filter
    if (cat && !isCategoryMatch(ad, cat)) {
      return false;
    }

    // 2b. Region filter
    if (reg) {
      const adRegName = (ad.region?.name || '').toLowerCase();
      const adRegId = String(ad.region?.id ?? '');
      const adAddress = (ad.address || '').toLowerCase();
      if (adRegName !== reg && adRegId !== reg && !adAddress.includes(reg)) {
        return false;
      }
    }

    // 3. Price Filter
    const priceNum = typeof ad.price === 'number' ? ad.price : parseFloat(String(ad.price).replace(/[^\d.]/g, '')) || 0;
    if (min !== null && !isNaN(min) && priceNum < min) {
      return false;
    }
    if (max !== null && !isNaN(max) && priceNum > max) {
      return false;
    }

    // 4. Has Photo Filter
    if (hasPhotoOnly) {
      if (!ad.image || typeof ad.image !== 'string' || !ad.image.trim()) {
        return false;
      }
    }

    return true;
  });
};
