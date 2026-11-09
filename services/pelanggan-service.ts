import { api } from '@/lib/axios';
import type { ApiResponse, ApiPaginatedResponse } from '@/types/api.types';
import type { PaginationQueryParams } from '@/types/pagination.types';
import { buildPaginationMeta } from '@/types/pagination.types';
import type {
  PelangganWithDetails,
  CreatePelangganInput,
  UpdatePelangganInput,
} from '@/types/customer.types';

export interface PelangganListParams extends PaginationQueryParams {
  tipe_outlet?: string;
}

export const pelangganService = {
  async getList(params?: PelangganListParams): Promise<ApiPaginatedResponse<PelangganWithDetails>> {
    const response = await api.get<unknown>('/pelanggan', {
      params,
    });
    const resData = response.data as {
      success?: boolean;
      data?: PelangganWithDetails[];
      meta?: ApiPaginatedResponse<PelangganWithDetails>['meta'];
      message?: string;
    } | PelangganWithDetails[] | undefined;

    // Adaptasi fleksibel: Tangani respons standar { data, meta } maupun raw array fallback
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

  async getById(id: string): Promise<ApiResponse<PelangganWithDetails>> {
    const response = await api.get<ApiResponse<PelangganWithDetails>>(`/pelanggan/${id}`);
    return response.data;
  },

  async create(payload: CreatePelangganInput): Promise<ApiResponse<PelangganWithDetails>> {
    const response = await api.post<ApiResponse<PelangganWithDetails>>('/pelanggan', payload);
    return response.data;
  },

  async update(id: string, payload: UpdatePelangganInput): Promise<ApiResponse<PelangganWithDetails>> {
    const response = await api.put<ApiResponse<PelangganWithDetails>>(`/pelanggan/${id}`, payload);
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    const response = await api.delete<ApiResponse<null>>(`/pelanggan/${id}`);
    return response.data;
  },
};
