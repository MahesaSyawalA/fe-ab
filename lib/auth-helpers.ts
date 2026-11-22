import { signOut } from 'next-auth/react';
import { api, clearCachedAccessToken } from '@/lib/axios';

export function getUserInitials(name?: string | null): string {
  if (!name || !name.trim()) return 'AB';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatRoleLabel(role?: string | null): string {
  if (!role) return 'User';
  const clean = role.trim().toLowerCase();
  if (clean === 'sales_manager' || clean === 'manager') return 'Sales Manager';
  if (clean === 'sales') return 'Sales';
  if (clean === 'director') return 'Director';
  if (clean === 'admin') return 'Admin';
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.warn('[Logout Warning] Gagal memanggil endpoint backend /auth/logout:', error);
  } finally {
    clearCachedAccessToken();
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('ab_kanban_deleted_activity_logs');
      } catch {}
    }
    await signOut({ callbackUrl: '/login', redirect: true });
  }
}
