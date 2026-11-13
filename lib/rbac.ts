import { type UserRole } from '@/types/user.types';

export type NormalizedRole = 'sales' | 'manager' | 'director' | 'admin';

/**
 * Normalisasi role backend/DB/session ke format standar ('sales' | 'manager' | 'director' | 'admin').
 * Menangani case-insensitive ('DIRECTOR', 'SALES_MANAGER', 'Sales', 'Admin', dll).
 */
export function normalizeRole(role?: string | null): NormalizedRole | null {
  if (!role) return null;
  const clean = role.trim().toLowerCase();
  if (clean === 'sales') return 'sales';
  if (clean === 'sales_manager' || clean === 'manager') return 'manager';
  if (clean === 'director') return 'director';
  if (clean === 'admin') return 'admin';
  return null;
}

/**
 * Mendapatkan rute home default berdasarkan role pengguna
 */
export function getDefaultHome(role?: UserRole | string | null): string {
  const normalized = normalizeRole(role);
  switch (normalized) {
    case 'admin':
      return '/admin/kelola-pengguna';
    case 'director':
      return '/director/dashboard';
    case 'manager':
      return '/manager/kanban';
    case 'sales':
      return '/sales/kanban';
    default:
      return '/login';
  }
}

/**
 * Memeriksa apakah suatu pathname diizinkan untuk role yang diberikan
 */
export function isRouteAllowedForRole(pathname: string, role?: string | null): boolean {
  const normalized = normalizeRole(role);
  if (!normalized) return false;

  const isSalesRoute = pathname.startsWith('/sales');
  const isManagerRoute = pathname.startsWith('/manager');
  const isDirectorRoute = pathname.startsWith('/director');
  const isAdminRoute = pathname.startsWith('/admin');

  if (isSalesRoute) return normalized === 'sales';
  if (isManagerRoute) return normalized === 'manager';
  if (isDirectorRoute) return normalized === 'director';
  if (isAdminRoute) return normalized === 'admin';

  return true;
}

