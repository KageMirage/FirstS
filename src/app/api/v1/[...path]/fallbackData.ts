// Mock and fallback data for when external student backend (front-lalafo-students.prolabagency.com) is down (502 / 500 / unreachable)

export interface MockCategory {
  id: number;
  name: string;
  color?: string;
  image?: string;
  only_with_approval?: boolean;
}

export interface MockChildCategory {
  id: number;
  name: string;
  parent_category: number;
  color?: string;
  image?: string;
  order?: number;
}

export interface MockRegion {
  id: number;
  name: string;
}

export interface MockStory {
  id: number;
  title: string;
  image: string;
  description?: string;
}

export const FALLBACK_CATEGORIES: MockCategory[] = [
  { id: 1, name: 'Недвижимость', color: '#10B981', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Транспорт', color: '#3B82F6', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Работа', color: '#8B5CF6', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Электроника', color: '#EC4899', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Услуги', color: '#F59E0B', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80' },
  { id: 6, name: 'Дом и сад', color: '#14B8A6', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=80' },
  { id: 7, name: 'Личные вещи', color: '#6366F1', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&auto=format&fit=crop&q=80' },
  { id: 8, name: 'Животные', color: '#EF4444', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80' },
  { id: 9, name: 'Хобби и отдых', color: '#06B6D4', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&auto=format&fit=crop&q=80' },
  { id: 10, name: 'Бизнес и оборудование', color: '#84CC16', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80' },
];

export const FALLBACK_CHILD_CATEGORIES: MockChildCategory[] = [
  { id: 101, name: 'Квартиры', parent_category: 1, color: '#10B981' },
  { id: 102, name: 'Дома и участки', parent_category: 1, color: '#10B981' },
  { id: 103, name: 'Коммерческая недвижимость', parent_category: 1, color: '#10B981' },
  { id: 201, name: 'Легковые авто', parent_category: 2, color: '#3B82F6' },
  { id: 202, name: 'Спецтехника', parent_category: 2, color: '#3B82F6' },
  { id: 203, name: 'Автозапчасти', parent_category: 2, color: '#3B82F6' },
  { id: 301, name: 'Вакансии', parent_category: 3, color: '#8B5CF6' },
  { id: 302, name: 'Резюме', parent_category: 3, color: '#8B5CF6' },
  { id: 401, name: 'Смартфоны и телефоны', parent_category: 4, color: '#EC4899' },
  { id: 402, name: 'Ноутбуки и компьютеры', parent_category: 4, color: '#EC4899' },
  { id: 403, name: 'Бытовая техника', parent_category: 4, color: '#EC4899' },
  { id: 501, name: 'Строительство и ремонт', parent_category: 5, color: '#F59E0B' },
  { id: 502, name: 'Грузоперевозки', parent_category: 5, color: '#F59E0B' },
  { id: 601, name: 'Мебель', parent_category: 6, color: '#14B8A6' },
  { id: 602, name: 'Предметы интерьера', parent_category: 6, color: '#14B8A6' },
];

export const FALLBACK_REGIONS: MockRegion[] = [
  { id: 1, name: 'Бишкек' },
  { id: 2, name: 'Ош' },
  { id: 3, name: 'Чуйская область' },
  { id: 4, name: 'Иссык-Кульская область' },
  { id: 5, name: 'Джалал-Абадская область' },
  { id: 6, name: 'Нарынская область' },
  { id: 7, name: 'Таласская область' },
  { id: 8, name: 'Баткенская область' },
];

export const FALLBACK_STORIES: MockStory[] = [
  { id: 1, title: 'Adverts PRO', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&auto=format&fit=crop&q=80', description: 'Крупнейшая доска объявлений' },
  { id: 2, title: 'Автомобили', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&auto=format&fit=crop&q=80', description: 'Свежие предложения авто' },
  { id: 3, title: 'Недвижимость', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&auto=format&fit=crop&q=80', description: 'Аренда и продажа квартир' },
  { id: 4, title: 'Электроника', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80', description: 'Гаджеты и девайсы' },
];

export interface ServerStoredAd {
  id: number;
  title: string;
  description: string;
  price: string | number;
  address: string;
  phone_number: string;
  whatsapp_number?: string | null;
  telegram_number?: string | null;
  image: string;
  images?: string[];
  views: number;
  favorites_count: number;
  is_favorite: boolean;
  added_date: string;
  is_pinned?: boolean;
  color?: string;
  category?: {
    id: number;
    name: string;
  } | null;
  parent_category?: {
    id: number;
    name: string;
  } | null;
  user?: {
    id: number;
    full_name?: string;
    avatar?: string | null;
    phone_number?: string;
  } | null;
}

export const INITIAL_FALLBACK_ADS: ServerStoredAd[] = [
  {
    id: 1001,
    title: 'Toyota Camry 70, 2020 год, идеальное состояние',
    description: 'Машина в родной краске. Комплектация XLE, кожаный салон, панорамная крыша, подогрев всех сидений. Пробег 65 000 км. Обслуживалась у дилера.',
    price: 2450000,
    address: 'Бишкек',
    phone_number: '+996700600600',
    whatsapp_number: '+996700600600',
    telegram_number: '+996700600600',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80'
    ],
    views: 342,
    favorites_count: 18,
    is_favorite: false,
    added_date: new Date(Date.now() - 3600000 * 2).toISOString(),
    category: { id: 2, name: 'Транспорт' },
    user: { id: 10, full_name: 'Алмаз', phone_number: '+996700600600' }
  },
  {
    id: 1002,
    title: '3-комнатная квартира в золотом квадрате, 105 кв.м',
    description: 'Продается просторная квартира с дизайнерским ремонтом. Итальянская мебель, встроенная техника Bosch. Охраняемый двор, подземный паркинг.',
    price: 9800000,
    address: 'Бишкек, Первомайский район',
    phone_number: '+996555123456',
    whatsapp_number: '+996555123456',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
    ],
    views: 512,
    favorites_count: 29,
    is_favorite: false,
    added_date: new Date(Date.now() - 3600000 * 5).toISOString(),
    category: { id: 1, name: 'Недвижимость' },
    user: { id: 11, full_name: 'Эльмира', phone_number: '+996555123456' }
  },
  {
    id: 1003,
    title: 'iPhone 15 Pro Max 256GB Natural Titanium',
    description: 'Оригинал, состояние нового, аккумулятор 100%. Полный комплект, чек, гарантия. Не падал, не вскрывался.',
    price: 95000,
    address: 'Бишкек',
    phone_number: '+996772987654',
    whatsapp_number: '+996772987654',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80'
    ],
    views: 184,
    favorites_count: 12,
    is_favorite: false,
    added_date: new Date(Date.now() - 3600000 * 12).toISOString(),
    category: { id: 4, name: 'Электроника' },
    user: { id: 12, full_name: 'Бектур', phone_number: '+996772987654' }
  },
  {
    id: 1004,
    title: 'Коттедж в Чок-Тале на озере Иссык-Куль',
    description: 'Уютный двухэтажный коттедж в закрытом пансионате. 4 спальни, камин, сауна, ухоженная территория, до пляжа 150 метров.',
    price: 13500000,
    address: 'Иссык-Кульская область',
    phone_number: '+996500333222',
    whatsapp_number: '+996500333222',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=80'
    ],
    views: 420,
    favorites_count: 35,
    is_favorite: false,
    added_date: new Date(Date.now() - 3600000 * 24).toISOString(),
    category: { id: 1, name: 'Недвижимость' },
    user: { id: 14, full_name: 'Айбек', phone_number: '+996500333222' }
  }
];

// In-memory ads stored during server runtime
export const serverAdsStore: ServerStoredAd[] = [...INITIAL_FALLBACK_ADS];

export interface MockAdvertising {
  id: number;
  title: string;
  badge?: string;
  description?: string;
  image?: string;
  type: 'aiza-med' | 'real-estate' | 'custom';
  address?: string;
  phones?: string[];
  metro?: string;
  services?: string[];
  link?: string;
}

export const FALLBACK_ADVERTISING: MockAdvertising[] = [
  {
    id: 1,
    title: 'Элитные коттеджи и дома посуточно',
    badge: 'VIP Недвижимость',
    description: 'Бассейн, сауна, терраса • Москва',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&auto=format&fit=crop&q=80',
    type: 'real-estate',
  },
  {
    id: 2,
    title: 'АЙЗА - МЕД',
    badge: 'Медицинский центр',
    description: 'Все виды медицинских услуг и анализов',
    image: '',
    type: 'aiza-med',
    metro: 'м. Бутырская 2-й выход 3 мин, м. Фонвизинская 5 мин',
    address: 'Огородный проезд 25/20',
    phones: ['+7 968 871 47 14', '+7 958 643 98 26'],
    services: [
      'ГИНЕКОЛОГ',
      'ТЕРАПЕВТ',
      'КАРДИОЛОГ',
      'НЕВРОЛОГ',
      'СТОМАТОЛОГ',
      'УЗИ, ЭКГ',
      'ВСЕ ВИДЫ АНАЛИЗОВ',
      'ДНЕВНОЙ СТАЦИОНАР'
    ]
  },
  {
    id: 3,
    title: 'Сдается дом посуточно',
    badge: 'Проверено',
    description: 'Квартиры и мейманкана от хозяина',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    type: 'real-estate',
  },
  {
    id: 4,
    title: 'АЙЗА - МЕД',
    badge: 'Медицинский центр',
    description: 'Медицинские консультации и анализы',
    image: '',
    type: 'aiza-med',
    metro: 'м. Бутырская 2-й выход 3 мин',
    address: 'Огородный проезд 25/20',
    phones: ['+7 968 871 47 14'],
  }
];
