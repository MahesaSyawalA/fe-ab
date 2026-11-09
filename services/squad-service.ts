import { api } from '@/lib/axios';
import type { ApiResponse, ApiPaginatedResponse } from '@/types/api.types';
import type { PaginationQueryParams } from '@/types/pagination.types';
import { buildPaginationMeta } from '@/types/pagination.types';
import type {
  SquadWithDetails,
  CreateSquadInput,
  UpdateSquadInput,
} from '@/types/squad.types';

export interface SquadListParams extends PaginationQueryParams {
  /** Batasi ke squad yang di-supervisi user ini (dipakai role manager). */
  id_supervisor?: string;
  is_active?: boolean;
}

export const squadService = {
  async getList(params?: SquadListParams): Promise<ApiPaginatedResponse<SquadWithDetails>> {
    const response = await api.get<unknown>('/squads', { params });
    const resData = response.data as {
      success?: boolean;
      data?: SquadWithDetails[];
      meta?: ApiPaginatedResponse<SquadWithDetails>['meta'];
      message?: string;
    } | SquadWithDetails[] | undefined;

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

  async getAllSquads(params?: SquadListParams): Promise<ApiPaginatedResponse<SquadWithDetails>> {
    return squadService.getList(params);
  },

  async getById(id: string): Promise<ApiResponse<SquadWithDetails>> {
    const response = await api.get<ApiResponse<SquadWithDetails>>(`/squads/${id}`);
    return response.data;
  },

  async create(payload: CreateSquadInput): Promise<ApiResponse<SquadWithDetails>> {
    const response = await api.post<ApiResponse<SquadWithDetails>>('/squads', payload);
    return response.data;
  },

  async update(id: string, payload: UpdateSquadInput): Promise<ApiResponse<SquadWithDetails>> {
    const response = await api.put<ApiResponse<SquadWithDetails>>(`/squads/${id}`, payload);
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    const response = await api.delete<ApiResponse<null>>(`/squads/${id}`);
    return response.data;
  },
};
