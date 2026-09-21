export interface Category {
  id: number;
  name: string;
  icon?: string;
  image?: string;
  color?: string;
  order?: number;
  num_of_ads?: number;
}

export interface ChildCategory {
  id: number;
  name: string;
  parent: number;
  is_popular?: boolean;
  image?: string;
  color?: string;
  order?: number;
  num_of_ads?: number;
  only_with_approval?: boolean;
}

export interface Region {
  id: number;
  name: string;
}

export interface UserProfile {
  id: number;
  phone_number?: string;
  email?: string;
  full_name?: string;
  avatar?: string | null;
  whatsapp_number?: string;
  telegram_number?: string;
  phone_number_verified?: boolean;
  email_confirmed?: boolean;
}

export interface AdItem {
  id: number;
  title: string;
  description: string;
  price: string | number;
  category?: {
    id: number;
    name: string;
    color?: string;
    image?: string;
    only_with_approval?: boolean;
  } | null;
  parent_category?: {
    id: number;
    name: string;
    color?: string;
    image?: string;
    order?: number;
  } | null;
  user?: {
    id: number;
    full_name?: string;
    avatar?: string | null;
    phone_number?: string;
  } | null;
  region?: {
    id: number;
    name: string;
  } | null;
  address?: string;
  phone_number?: string;
  color?: string;
  image?: string;
  images?: string[];
  added_date?: string;
  updated_date?: string;
  is_pinned?: boolean;
  is_paid?: boolean;
  views?: number;
  favorites_count?: number;
  is_favorite?: boolean;
  subCategoryTitle?: string;
  formattedDate?: string;
}

export interface AdsResponse {
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  results: AdItem[];
}

export interface SocialNetwork {
  id: number;
  desctop_name: string;
  mobile_name: string;
  link: string;
  icon: string;
  is_published: boolean;
  type: string;
}

export interface Story {
  id: number;
  title: string;
  image: string;
  added_date?: string;
  is_seen?: string;
  story_contents?: {
    id: number;
    title: string;
    text: string;
    image: string;
    link?: string;
  }[];
}

export interface CreateAdPayload {
  title: string;
  description: string;
  price: number | string;
  category_id?: number;
  phone_number: string;
  address?: string;
  region_id?: number;
  image_file?: File | null;
}
