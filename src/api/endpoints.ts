import apiClient from './axiosClient';
import { 
  Category, 
  ChildCategory, 
  AdItem, 
  AdsResponse, 
  UserProfile, 
  SocialNetwork, 
  Story,
  Region 
} from '../types/api';

export const apiService = {
  // Categories
  getCategories: async (): Promise<Category[]> => {
    const res = await apiClient.get<Category[]>('/categories');
    return res.data;
  },

  getChildCategories: async (): Promise<ChildCategory[]> => {
    const res = await apiClient.get<ChildCategory[]>('/child-categories');
    return res.data;
  },

  // Ads
  getAds: async (params?: {
    page?: number;
    category?: number | string;
    parent_category?: number | string;
    search?: string;
    region?: number | string;
  }): Promise<AdsResponse> => {
    const res = await apiClient.get<AdsResponse>('/ads', { params });
    return res.data;
  },

  getAdById: async (id: number): Promise<AdItem> => {
    const res = await apiClient.get<AdItem>(`/ads/${id}`);
    return res.data;
  },

  createAd: async (formData: FormData): Promise<AdItem> => {
    const res = await apiClient.post<AdItem>('/ads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  toggleFavorite: async (adId: number): Promise<{ is_favorite: boolean; favorites_count?: number }> => {
    const res = await apiClient.post(`/ads/${adId}/favorite`);
    return res.data;
  },

  liftAd: async (adId: number): Promise<any> => {
    const res = await apiClient.post(`/ads/${adId}/lift`);
    return res.data;
  },

  getMyAds: async (): Promise<AdItem[]> => {
    const res = await apiClient.get<AdItem[]>('/my-ads');
    return res.data;
  },

  // Regions
  getRegions: async (): Promise<Region[]> => {
    const res = await apiClient.get<Region[]>('/regions');
    return res.data;
  },

  // Stories
  getStories: async (): Promise<Story[]> => {
    const res = await apiClient.get<Story[]>('/stories');
    return res.data;
  },

  // Social Networks
  getSocialNetworks: async (): Promise<SocialNetwork[]> => {
    const res = await apiClient.get<SocialNetwork[]>('/social-networks');
    return res.data;
  },

  // Auth
  register: async (payload: {
    phone_number: string;
    password?: string;
    full_name?: string;
    email?: string;
  }): Promise<{ token?: string; user?: UserProfile }> => {
    const res = await apiClient.post('/auth/register', payload);
    return res.data;
  },

  login: async (payload: {
    phone_number: string;
    password?: string;
  }): Promise<{ access?: string; token?: string; user?: UserProfile }> => {
    const res = await apiClient.post('/auth/login', payload);
    return res.data;
  },

  requestOTP: async (payload: {
    phone_number: string;
    method: 'whatsapp' | 'telegram';
    type: 'login' | 'register';
  }): Promise<{ detail?: string }> => {
    const res = await apiClient.post('/auth/request-otp', payload);
    return res.data;
  },

  verifyOTP: async (payload: {
    phone_number: string;
    otp: string;
  }): Promise<{ access?: string; token?: string; user?: UserProfile }> => {
    const res = await apiClient.post('/auth/verify-otp', payload);
    return res.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const res = await apiClient.get<UserProfile>('/auth/profile');
    return res.data;
  },
};
