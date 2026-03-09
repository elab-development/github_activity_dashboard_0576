import { AuthUser } from '@/types';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const authStorage = {
  setSession(token: string, user: AuthUser) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  },

  getUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;

    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};