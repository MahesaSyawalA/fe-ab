import { type UserRole } from '@/types/user.types';

export type NormalizedRole = 'sales' | 'manager' | 'director' | 'admin';

export function normalizeRole(role?: string | null): NormalizedRole | null {
  if (!role) return null;
  const clean = role.trim().toLowerCase();
  if (clean === 'sales') return 'sales';
  if (clean === 'sales_manager' || clean === 'manager') return 'manager';
  if (clean === 'director') return 'director';
  if (clean === 'admin') return 'admin';
  return null;
}

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

export function isSafeInternalPath(pathname?: string | null): boolean {
  if (!pathname) return false;
  const trimmed = pathname.trim();
  // Hanya izinkan path internal relatif yang diawali satu "/" (bukan "//", bukan "/\", tanpa scheme)
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return false;
  }
  if (/^\/[^/]*:/i.test(trimmed)) {
    return false;
  }
  return true;
}

export function isRouteAllowedForRole(pathname: string, role?: string | null): boolean {
  if (!isSafeInternalPath(pathname)) return false;
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
