import { api } from '@/lib/axios';
import type { ApiResponse, ApiPaginatedResponse } from '@/types/api.types';
import type {
  PublicUser,
  PublicUserWithSquad,
  ResetPasswordInput,
  UserSortBy,
} from '@/types/user.types';
import type { PaginationQueryParams } from '@/types/pagination.types';
import { buildPaginationMeta } from '@/types/pagination.types';

export type { PublicUser, PublicUserWithSquad };

export type UserProfile = PublicUserWithSquad;

export interface UserListParams extends PaginationQueryParams {
  role?: string;
  id_squad?: string;
  is_active?: boolean;
  sort_by?: UserSortBy;
}

export interface CreateUserApiPayload {
  nama: string;
  email: string;
  no_telp: string;
  role: 'sales' | 'sales_manager' | 'director';
  id_squad?: string | null;
  password: string;
  send_credentials?: boolean;
  must_change_password?: boolean;
}

export interface UpdateUserApiPayload {
  nama?: string;
  email?: string;
  no_telp?: string;
  role?: 'sales' | 'sales_manager' | 'director';
  id_squad?: string | null;
  is_active?: boolean;
  biaya_bulanan?: number | null;
  password?: string;
}

export interface UpdateProfileApiPayload {
  nama?: string;
  no_telp?: string;
}

export type ResetPasswordApiPayload = ResetPasswordInput;

function extractUserData<T>(raw: unknown): { data: T; message?: string } {
  const res = raw as { success?: boolean; data?: T; message?: string } | T;
  const user =
    res && typeof res === 'object' && 'data' in res && res.data
      ? res.data
      : (res as T);
  return {
    data: user,
    message: (res as { message?: string })?.message,
  };
}

export const userService = {
  async getList(params?: UserListParams): Promise<ApiPaginatedResponse<PublicUserWithSquad>> {
    const response = await api.get<unknown>('/users', { params });
    const resData = response.data as
      | {
          success?: boolean;
          data?: PublicUserWithSquad[];
          meta?: ApiPaginatedResponse<PublicUserWithSquad>['meta'];
          message?: string;
        }
      | PublicUserWithSquad[]
      | undefined;

    if (resData && !Array.isArray(resData) && Array.isArray(resData.data)) {
      const meta = resData.meta
        ? {
            page: resData.meta.page ?? params?.page ?? 1,
            limit: resData.meta.limit ?? params?.limit ?? 10,
            total: resData.meta.total ?? resData.data.length,
            total_pages:
              resData.meta.total_pages ??
              Math.max(
                1,
                Math.ceil((resData.meta.total ?? resData.data.length) / (params?.limit ?? 10)),
              ),
            has_next: resData.meta.has_next ?? false,
            has_prev: resData.meta.has_prev ?? false,
          }
        : buildPaginationMeta(resData.data.length, params);

      return {
        success: resData.success ?? true,
        data: resData.data,
        meta,
        message: resData.message,
      };
    }

    if (Array.isArray(resData)) {
      return {
        success: true,
        data: resData,
        meta: buildPaginationMeta(resData.length, params),
      };
    }

    return {
      success: true,
      data: [],
      meta: buildPaginationMeta(0, params),
    };
  },

  async createUser(payload: CreateUserApiPayload): Promise<ApiResponse<PublicUserWithSquad>> {
    const response = await api.post<unknown>('/users', payload);
    const { data, message } = extractUserData<PublicUserWithSquad>(response.data);
    return { success: true, data, message };
  },

  async getMe(): Promise<ApiResponse<UserProfile>> {
    const response = await api.get<unknown>('/auth/me');
    const { data, message } = extractUserData<UserProfile>(response.data);
    return { success: true, data, message };
  },

  async getUserById(id: string): Promise<ApiResponse<UserProfile>> {
    const response = await api.get<unknown>(`/users/${id}`);
    const { data, message } = extractUserData<UserProfile>(response.data);
    return { success: true, data, message };
  },

  async updateMe(payload: UpdateProfileApiPayload): Promise<ApiResponse<UserProfile>> {
    const response = await api.patch<unknown>('/users/me', payload);
    const { data, message } = extractUserData<UserProfile>(response.data);
    return { success: true, data, message };
  },

  async updateUser(
    id: string,
    payload: UpdateUserApiPayload,
  ): Promise<ApiResponse<PublicUserWithSquad>> {
    const response = await api.patch<unknown>(`/users/${id}`, payload);
    const { data, message } = extractUserData<PublicUserWithSquad>(response.data);
    return { success: true, data, message };
  },

  async resetPassword(
    id: string,
    payload: ResetPasswordApiPayload,
  ): Promise<ApiResponse<PublicUserWithSquad>> {
    const response = await api.post<unknown>(`/users/${id}/reset-password`, payload);
    const { data, message } = extractUserData<PublicUserWithSquad>(response.data);
    return { success: true, data, message };
  },
};
