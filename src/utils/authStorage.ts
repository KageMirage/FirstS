'use client';

import { UserProfile } from '../types/api';

export interface RegisteredAccount {
  id: number;
  phone_number: string;
  password?: string;
  full_name: string;
  email?: string;
  avatar?: string;
  created_at: string;
  auth_provider?: 'phone' | 'google';
}

const STORAGE_USERS_KEY = 'adverts_registered_users';

// Universal human silhouette ("человечек") default avatar
export const DEFAULT_USER_AVATAR = 
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' fill='none'%3E%3Crect width='40' height='40' rx='20' fill='%23F3F4F6'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20 18C22.2091 18 24 16.2091 24 14C24 11.7909 22.2091 10 20 10C17.7909 10 16 11.7909 16 14C16 16.2091 17.7909 18 20 18ZM12 28C12 24.6863 15.5817 22 20 22C24.4183 22 28 24.6863 28 28V29C28 29.5523 27.5523 30 27 30H13C12.4477 30 12 29.5523 12 29V28Z' fill='%239CA3AF'/%3E%3C/svg%3E";

export function cleanPhoneDigits(phone: string): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

/**
 * Robust phone number normalizer supporting:
 * +996 700 600 600, 0700 600 600, 996700600600, 700600600
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  const digits = cleanPhoneDigits(phone);
  if (!digits) return '';
  if (digits.startsWith('996')) {
    return `+${digits}`;
  }
  if (digits.startsWith('0') && digits.length === 10) {
    return `+996${digits.slice(1)}`;
  }
  if (digits.length === 9) {
    return `+996${digits}`;
  }
  return `+${digits}`;
}

/**
 * Robust phone number comparison that ignores spaces, brackets,
 * and handles country code vs local zero format.
 */
export function isSamePhoneNumber(p1?: string, p2?: string): boolean {
  if (!p1 || !p2) return false;
  const d1 = cleanPhoneDigits(p1);
  const d2 = cleanPhoneDigits(p2);
  if (d1 === d2) return true;

  // Compare normalized versions
  const norm1 = normalizePhoneNumber(p1);
  const norm2 = normalizePhoneNumber(p2);
  if (norm1 === norm2) return true;

  // Compare core 9 digits (e.g. without leading 996 or 0)
  const core1 = d1.startsWith('996') ? d1.slice(3) : d1.startsWith('0') ? d1.slice(1) : d1;
  const core2 = d2.startsWith('996') ? d2.slice(3) : d2.startsWith('0') ? d2.slice(1) : d2;
  return core1.length >= 7 && core1 === core2;
}

export function getRegisteredUsers(): RegisteredAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      const defaultAccount: RegisteredAccount = {
        id: 74,
        phone_number: '+996700600600',
        password: 'password123',
        full_name: 'user',
        email: 'user@adverts-pro.kg',
        avatar: DEFAULT_USER_AVATAR,
        created_at: new Date().toISOString(),
        auth_provider: 'phone',
      };
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify([defaultAccount]));
      return [defaultAccount];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Checks for existing usernames and appends numbers if needed:
 * "user", "user1", "user2", "user3", etc.
 */
export function generateUniqueUsername(base: string = 'user'): string {
  const users = getRegisteredUsers();
  const existingNames = new Set(
    users
      .map((u) => u.full_name?.trim().toLowerCase())
      .filter(Boolean) as string[]
  );

  const baseLower = base.trim().toLowerCase();
  if (!existingNames.has(baseLower)) {
    return base;
  }

  let counter = 1;
  while (existingNames.has(`${baseLower}${counter}`)) {
    counter++;
  }
  return `${base}${counter}`;
}

export function saveRegisteredUser(account: Omit<RegisteredAccount, 'id' | 'created_at'> & { id?: number }): RegisteredAccount {
  const users = getRegisteredUsers();
  const normalized = normalizePhoneNumber(account.phone_number);
  const existingIndex = users.findIndex(
    (u) => isSamePhoneNumber(u.phone_number, account.phone_number) || (account.email && u.email?.toLowerCase() === account.email.toLowerCase())
  );

  const finalName = account.full_name && account.full_name !== 'Пользователь' 
    ? account.full_name 
    : generateUniqueUsername('user');

  const fullAccount: RegisteredAccount = {
    id: account.id || Date.now(),
    phone_number: normalized || account.phone_number,
    password: account.password,
    full_name: finalName,
    email: account.email || `${normalized.replace(/\+/g, '')}@adverts-pro.kg`,
    avatar: account.avatar || DEFAULT_USER_AVATAR,
    created_at: new Date().toISOString(),
    auth_provider: account.auth_provider || 'phone',
  };

  if (existingIndex >= 0) {
    users[existingIndex] = {
      ...users[existingIndex],
      ...fullAccount,
      password: account.password || users[existingIndex].password,
    };
  } else {
    users.unshift(fullAccount);
  }

  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch {}

  return fullAccount;
}

export function findUserByCredentials(phone: string, password?: string): RegisteredAccount | null {
  const users = getRegisteredUsers();
  const found = users.find((u) => isSamePhoneNumber(u.phone_number, phone));
  if (!found) return null;
  if (!password) return found;
  if (found.password === password) return found;
  return null;
}

export function findUserByPhone(phone: string): RegisteredAccount | null {
  return findUserByCredentials(phone);
}

export function resetUserPassword(phone: string, newPassword: string): boolean {
  const users = getRegisteredUsers();
  const normalized = normalizePhoneNumber(phone);
  const index = users.findIndex((u) => isSamePhoneNumber(u.phone_number, phone));
  
  if (index >= 0) {
    users[index].password = newPassword;
    users[index].phone_number = normalized || users[index].phone_number;
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch {}
    return true;
  }

  saveRegisteredUser({
    phone_number: normalized || phone,
    password: newPassword,
    full_name: generateUniqueUsername('user'),
    avatar: DEFAULT_USER_AVATAR,
  });
  return true;
}

export function updateAccountAvatar(identifier: string, newAvatar: string): void {
  if (typeof window === 'undefined' || !identifier) return;
  const lower = identifier.toLowerCase();

  try {
    const users = getRegisteredUsers();
    const updatedUsers = users.map((u) => {
      if (
        (u.email && u.email.toLowerCase() === lower) ||
        isSamePhoneNumber(u.phone_number, identifier)
      ) {
        return { ...u, avatar: newAvatar };
      }
      return u;
    });
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
  } catch {}
}

export function deleteUserAccount(userId: number, email?: string, phone?: string): void {
  if (typeof window === 'undefined') return;

  const lowerEmail = email?.toLowerCase();

  // 1. Remove from registered users
  try {
    const users = getRegisteredUsers();
    const filteredUsers = users.filter(
      (u) =>
        u.id !== userId &&
        (!lowerEmail || u.email?.toLowerCase() !== lowerEmail) &&
        (!phone || !isSamePhoneNumber(u.phone_number, phone))
    );
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(filteredUsers));
  } catch {}

  // 2. Remove user ads
  try {
    const rawLocalAds = localStorage.getItem('adverts_local_ads');
    if (rawLocalAds) {
      const ads = JSON.parse(rawLocalAds);
      if (Array.isArray(ads)) {
        const filteredAds = ads.filter((ad) => ad.user?.id !== userId);
        localStorage.setItem('adverts_local_ads', JSON.stringify(filteredAds));
      }
    }
  } catch {}

  // 3. Remove active session
  try {
    localStorage.removeItem('adverts_user');
    localStorage.removeItem('adverts_token');
  } catch {}
}
