import { AuthUser } from '@/types';

export function canManageRepositories(user: AuthUser | null) {
  return !!user;
}

export function isAdmin(user: AuthUser | null) {
  return user?.role === 'ADMIN';
}