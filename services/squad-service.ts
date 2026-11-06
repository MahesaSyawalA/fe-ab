import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type {
  SquadWithDetails,
  CreateSquadInput,
  UpdateSquadInput,
} from '@/types/squad.types';

export interface SquadListParams {
  /** Batasi ke squad yang di-supervisi user ini (dipakai role manager). */
  id_supervisor?: string;
}

export const squadService = {
  async getList(params?: SquadListParams): Promise<ApiResponse<SquadWithDetails[]>> {
    const response = await api.get<ApiResponse<SquadWithDetails[]>>('/squads', { params });
    return response.data;
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
