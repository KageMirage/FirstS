import apiClient from './axiosClient';
import { 
  Category, 
  ChildCategory, 
  AdItem, 
  AdsResponse, 
  UserProfile, 
  SocialNetwork, 
  Story, 
  Region,
  AdComment,
  AdvertisingBanner
} from '../types/api';

// In-memory cache & in-flight promise deduplication
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();

async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number = 300000 // 5 minutes default
): Promise<T> {
  const cached = memoryCache.get(key);
  const now = Date.now();
  if (cached && now - cached.timestamp < ttlMs) {
    return cached.data;
  }

  // Deduplicate simultaneous requests
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key)!;
  }

  const promise = fetcher()
    .then((data) => {
      memoryCache.set(key, { data, timestamp: Date.now() });
      inFlightRequests.delete(key);
      return data;
    })
    .catch((err) => {
      inFlightRequests.delete(key);
      throw err;
    });

  inFlightRequests.set(key, promise);
  return promise;
}

export function invalidateApiCache(prefix?: string) {
  if (!prefix) {
    memoryCache.clear();
  } else {
    for (const key of Array.from(memoryCache.keys())) {
      if (key.startsWith(prefix)) {
        memoryCache.delete(key);
      }
    }
  }
}

export const apiService = {
  // Categories (cached for 10 minutes, deduplicated)
  getCategories: async (): Promise<Category[]> => {
    return fetchWithCache(
      'categories',
      async () => {
        const res = await apiClient.get<Category[]>('/categories');
        return res.data;
      },
      600000 // 10 minutes
    );
  },

  getChildCategories: async (): Promise<ChildCategory[]> => {
    return fetchWithCache(
      'child-categories',
      async () => {
        const res = await apiClient.get<ChildCategory[]>('/child-categories');
        return res.data;
      },
      600000 // 10 minutes
    );
  },

  // Ads
  getAds: async (params?: {
    page?: number;
    category?: number | string;
    parent_category?: number | string;
    search?: string;
    region?: number | string;
    user?: number | string;
    force?: boolean;
  }): Promise<AdsResponse> => {
    const isDefault = !params || Object.keys(params).length === 0;
    const cacheKey = isDefault ? 'ads_default' : `ads_${JSON.stringify(params)}`;

    // If default list is requested, cache for 60 seconds and deduplicate
    return fetchWithCache(
      cacheKey,
      async () => {
        const res = await apiClient.get<AdsResponse>('/ads', { params });
        return res.data;
      },
      60000 // 1 minute
    );
  },

  getAdById: async (id: number): Promise<AdItem> => {
    return fetchWithCache(
      `ad_${id}`,
      async () => {
        const res = await apiClient.get<AdItem>(`/ads/${id}`);
        return res.data;
      },
      120000 // 2 minutes
    );
  },

  createAd: async (formData: FormData): Promise<AdItem> => {
    invalidateApiCache('ads_');
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

  // Comments
  getComments: async (adId: number): Promise<AdComment[]> => {
    const res = await apiClient.get<AdComment[]>('/comments', { params: { ad: adId } });
    return res.data;
  },

  createComment: async (payload: {
    text: string;
    ad: number;
    parent?: number | null;
  }): Promise<AdComment> => {
    const res = await apiClient.post<AdComment>('/comments', payload);
    return res.data;
  },

  likeComment: async (commentId: number): Promise<any> => {
    const res = await apiClient.post('/comment-likes', { comment: commentId });
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

  // Advertising / Banners
  getAdvertising: async (): Promise<AdvertisingBanner[]> => {
    return fetchWithCache(
      'advertising',
      async () => {
        try {
          const res = await apiClient.get<AdvertisingBanner[]>('/advertising');
          return res.data;
        } catch {
          const res = await apiClient.get<AdvertisingBanner[]>('/banners');
          return res.data;
        }
      },
      300000 // 5 minutes
    );
  },

  getBanners: async (): Promise<AdvertisingBanner[]> => {
    return fetchWithCache(
      'banners',
      async () => {
        const res = await apiClient.get<AdvertisingBanner[]>('/banners');
        return res.data;
      },
      300000 // 5 minutes
    );
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

  googleAuth: async (payload: {
    token: string;
    phone_number?: string;
  }): Promise<{ access?: string; token?: string; user?: UserProfile }> => {
    const res = await apiClient.post('/auth/google-auth', payload);
    return res.data;
  },

  deleteAccount: async (): Promise<any> => {
    const res = await apiClient.delete('/auth/profile');
    return res.data;
  },

  requestPasswordReset: async (payload: {
    method: 'whatsapp' | 'email';
    phone_number?: string;
    email?: string;
  }): Promise<{ message?: string; detail?: string }> => {
    const res = await apiClient.post('/auth/password-reset/request', payload);
    return res.data;
  },

  verifyPasswordResetOTP: async (payload: {
    otp: string;
    phone_number?: string;
    email?: string;
  }): Promise<{ message?: string; detail?: string }> => {
    const res = await apiClient.post('/auth/password-reset/verify', payload);
    return res.data;
  },

  completePasswordReset: async (payload: {
    otp: string;
    new_password: string;
    phone_number?: string;
    email?: string;
  }): Promise<{ message?: string; detail?: string }> => {
    const res = await apiClient.post('/auth/password-reset/complete', payload);
    return res.data;
  },

  changePassword: async (payload: {
    old_password: string;
    new_password: string;
  }): Promise<{ message?: string; detail?: string }> => {
    const res = await apiClient.put('/auth/change-password', payload);
    return res.data;
  },
};
