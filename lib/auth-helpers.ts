import { signOut } from 'next-auth/react';
import { api } from '@/lib/axios';

/**
 * Mendapatkan inisial 1-2 huruf kapital dari nama pengguna
 */
export function getUserInitials(name?: string | null): string {
  if (!name || !name.trim()) return 'AB';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Format label role yang ramah pembaca untuk tampilan UI
 */
export function formatRoleLabel(role?: string | null): string {
  if (!role) return 'User';
  if (role === 'sales_manager' || role === 'manager') return 'Sales Manager';
  if (role === 'sales') return 'Sales';
  if (role === 'director') return 'Director';
  return role.charAt(0).toUpperCase() + role.slice(1);
}

/**
 * Logout dua arah: panggil endpoint backend /auth/logout (jika ada) lalu hapus sesi NextAuth
 */
export async function logoutUser(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.warn('[Logout Warning] Gagal memanggil endpoint backend /auth/logout:', error);
  } finally {
    await signOut({ callbackUrl: '/login', redirect: true });
  }
}

