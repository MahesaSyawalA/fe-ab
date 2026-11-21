import axios, { isAxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { logoutUser } from '@/lib/auth-helpers';
import type { ApiErrorResponse } from '@/types/api.types';

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const baseURL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  timeout: 30000,
});

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

let isRefreshing = false;
let isLoggingOut = false;
let failedQueue: QueueItem[] = [];

const triggerForcedLogout = async () => {
  if (typeof window === 'undefined' || window.location.pathname.startsWith('/login')) {
    return;
  }
  if (isLoggingOut) return;
  isLoggingOut = true;
  try {
    await logoutUser();
  } catch {
    await signOut({ callbackUrl: '/login', redirect: true });
  } finally {
    isLoggingOut = false;
  }
};

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || '';
    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/logout') ||
      requestUrl.includes('/auth/change-password');

    if (error.response?.status === 401 && !isAuthEndpoint) {

      if (originalRequest._retry) {
        await triggerForcedLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {

        const refreshResponse = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          },
        );

        const resData = refreshResponse.data?.data || refreshResponse.data;
        const newAccessToken =
          resData?.accessToken ||
          resData?.tokens?.accessToken ||
          resData?.token;

        if (newAccessToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null);

        return api(originalRequest);
      } catch (refreshError) {

        processQueue(refreshError);

        console.warn('[Silent Refresh] Sesi kedaluwarsa. Mengarahkan ke login...');
        await triggerForcedLogout();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } else if (error.response?.status === 403) {
      const responseData = error.response?.data as ApiErrorResponse | undefined;
      const errMsg = (responseData?.message || responseData?.error || '').toLowerCase();
      if (errMsg.includes('dinonaktifkan') || errMsg.includes('inactive')) {
        await triggerForcedLogout();
      } else {
        console.warn('[HTTP 403] Akses ditolak. Pengguna tidak memiliki izin untuk tindakan ini.');
      }
    }

    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    if (!error.response) {
      return 'Koneksi jaringan bermasalah. Periksa koneksi internet Anda.';
    }
    const data = error.response.data;
    if (data?.errors) {
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        const firstItem = data.errors[0];
        if (typeof firstItem === 'string' && firstItem) return firstItem;
        if (
          firstItem &&
          typeof firstItem === 'object' &&
          'message' in firstItem &&
          typeof firstItem.message === 'string' &&
          firstItem.message
        ) {
          return firstItem.message;
        }
      } else if (typeof data.errors === 'object') {
        const firstError = Object.values(data.errors)[0];
        if (Array.isArray(firstError) && firstError[0]) return firstError[0];
        if (typeof firstError === 'string' && firstError) return firstError;
      }
    }
    if (data?.message) return data.message;
    if (data?.error) return data.error;
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
