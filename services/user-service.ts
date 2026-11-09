import { api } from '@/lib/axios';
import type { ApiPaginatedResponse } from '@/types/api.types';
import type { User } from '@/types/user.types';
import type { PaginationQueryParams } from '@/types/pagination.types';
import { buildPaginationMeta } from '@/types/pagination.types';

export type PublicUser = Omit<User, 'password_hash'>;

export interface UserListParams extends PaginationQueryParams {
  role?: string;
  id_squad?: string;
}

export const userService = {
  async getList(params?: UserListParams): Promise<ApiPaginatedResponse<PublicUser>> {
    const response = await api.get<unknown>('/users', { params });
    const resData = response.data as {
      success?: boolean;
      data?: PublicUser[];
      meta?: ApiPaginatedResponse<PublicUser>['meta'];
      message?: string;
    } | PublicUser[] | undefined;

    if (resData && !Array.isArray(resData) && Array.isArray(resData.data)) {
      const meta = resData.meta
        ? {
            page: resData.meta.page ?? params?.page ?? 1,
            limit: resData.meta.limit ?? params?.limit ?? 10,
            total: resData.meta.total ?? resData.data.length,
            total_pages:
              resData.meta.total_pages ??
              Math.max(1, Math.ceil((resData.meta.total ?? resData.data.length) / (params?.limit ?? 10))),
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
};
