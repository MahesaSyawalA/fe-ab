import axios, { isAxiosError } from 'axios';
import { getSession, signOut } from 'next-auth/react';
import type { ApiErrorResponse } from '@/types/api.types';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Menyematkan Bearer token dari Session Auth.js secara otomatis
api.interceptors.request.use(
  async (config) => {
    // Jalankan penyematan token hanya jika di lingkungan browser dan header belum diisi secara manual
    if (typeof window !== 'undefined' && !config.headers.Authorization) {
      try {
        const session = await getSession();
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
      } catch (sessionError) {
        console.warn('[HTTP Request Interceptor] Gagal membaca session:', sessionError);
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Penanganan terpusat untuk 401 Unauthorized dan 403 Forbidden
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error('[HTTP 401] Token expired atau tidak valid. Mengarahkan ke halaman login...');

      if (typeof window !== 'undefined') {
        // Hindari loop redirect jika user sudah berada di halaman login
        if (!window.location.pathname.startsWith('/login')) {
          await signOut({ callbackUrl: '/login', redirect: true });
        }
      }
    } else if (error.response?.status === 403) {
      console.warn('[HTTP 403] Akses ditolak. Pengguna tidak memiliki izin untuk tindakan ini.');
    }

    return Promise.reject(error);
  },
);

/**
 * Helper terstandarisasi untuk mengekstrak pesan error ramah pengguna dari error Axios atau generik
 */
export function getErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (data?.errors) {
      const firstError = Object.values(data.errors)[0];
      if (Array.isArray(firstError) && firstError[0]) return firstError[0];
      if (typeof firstError === 'string') return firstError;
    }
    if (error.message) return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Terjadi kesalahan pada sistem, silakan coba beberapa saat lagi.';
}

export type {
  ApiResponse,
  ApiPaginatedResponse,
  PaginationMeta,
  ApiErrorResponse,
} from '@/types/api.types';

export default api;
