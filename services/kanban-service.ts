import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type { TiketWithDetails } from '@/types/ticket.types';
import type { KanbanStageColumn } from '@/constants/kanban-constants';

export interface KanbanBoardData {
  stages: KanbanStageColumn[];
  ticketsByStage: Record<string, TiketWithDetails[]>;
}

export interface MoveTicketPayload {
  id_tiket: string;
  fromStageId: string;
  toStageId: string;
  targetIndex?: number;
  ticketUpdates?: Partial<TiketWithDetails>;
}

export const kanbanService = {
  async getBoard(params?: {
    squadId?: string;
    salesId?: string;
    search?: string;
  }): Promise<ApiResponse<KanbanBoardData>> {
    const response = await api.get<ApiResponse<KanbanBoardData>>('/kanban', { params });
    return response.data;
  },

  async getTicketById(id: string): Promise<ApiResponse<TiketWithDetails>> {
    const response = await api.get<ApiResponse<TiketWithDetails>>(`/kanban/tickets/${id}`);
    return response.data;
  },

  async moveTicket(payload: MoveTicketPayload): Promise<ApiResponse<TiketWithDetails>> {
    const response = await api.post<ApiResponse<TiketWithDetails>>('/kanban/tickets/move', payload);
    return response.data;
  },
};

