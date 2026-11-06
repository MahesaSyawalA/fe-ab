import { api } from '@/lib/axios';
import type { ApiResponse, ApiPaginatedResponse } from '@/types/api.types';
import type {
  PelangganWithDetails,
  CreatePelangganInput,
  UpdatePelangganInput,
} from '@/types/customer.types';

export interface PelangganListParams {
  search?: string;
  tipe_faskes?: string;
  page?: number;
  limit?: number;
}

export const pelangganService = {
  async getList(params?: PelangganListParams): Promise<ApiPaginatedResponse<PelangganWithDetails>> {
    const response = await api.get<ApiPaginatedResponse<PelangganWithDetails>>('/pelanggan', {
      params,
    });
    return response.data;
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

