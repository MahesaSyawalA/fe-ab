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

  async create(payload: CreatePelangganInput | FormData): Promise<ApiResponse<PelangganWithDetails>> {
    let body: FormData;
    if (payload instanceof FormData) {
      body = payload;
    } else {
      body = new FormData();
      if (payload.file) {
        body.append('file', payload.file);
      }
      body.append('nama_outlet', payload.nama_outlet);
      body.append('tipe_outlet', payload.tipe_outlet);
      body.append('alamat', payload.alamat);
      body.append('latitude', String(payload.latitude));
      body.append('longitude', String(payload.longitude));
      body.append('radius_kunjungan', String(payload.radius_kunjungan));

      if (payload.kontak && payload.kontak.length > 0) {
        body.append('kontak', JSON.stringify(payload.kontak));
      }
    }

    const response = await api.post<ApiResponse<PelangganWithDetails>>('/pelanggan', body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async update(id: string, payload: UpdatePelangganInput | FormData): Promise<ApiResponse<PelangganWithDetails>> {
    let body: FormData | UpdatePelangganInput;
    let headers: Record<string, string> | undefined;

    if (payload instanceof FormData) {
      body = payload;
      headers = { 'Content-Type': 'multipart/form-data' };
    } else if (payload.file) {
      const formData = new FormData();
      formData.append('file', payload.file);
      if (payload.nama_outlet !== undefined) formData.append('nama_outlet', payload.nama_outlet);
      if (payload.tipe_outlet !== undefined) formData.append('tipe_outlet', payload.tipe_outlet);
      if (payload.alamat !== undefined) formData.append('alamat', payload.alamat);
      if (payload.latitude !== undefined) formData.append('latitude', String(payload.latitude));
      if (payload.longitude !== undefined) formData.append('longitude', String(payload.longitude));
      if (payload.radius_kunjungan !== undefined) formData.append('radius_kunjungan', String(payload.radius_kunjungan));
      body = formData;
      headers = { 'Content-Type': 'multipart/form-data' };
    } else {
      body = payload;
    }

    const response = await api.put<ApiResponse<PelangganWithDetails>>(`/pelanggan/${id}`, body, {
      headers,
    });
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    const response = await api.delete<ApiResponse<null>>(`/pelanggan/${id}`);
    return response.data;
  },
};
