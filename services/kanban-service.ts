import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type {
  TiketWithDetails,
  CreateTiketInput,
  UpdateTiketInput,
} from '@/types/ticket.types';
import type {
  TahapKanban,
  KanbanStageColumn,
  CreateTahapKanbanInput,
  UpdateTahapKanbanInput,
} from '@/types/kanban-stage.types';
import type {
  CreateAktivitasInput,
  AktivitasWithDetails,
  EvidenceItem,
} from '@/types/activity.types';
import type { BuktiKunjungan } from '@/types/visit-proof.types';

export interface KanbanBoardData {
  stages: (KanbanStageColumn | TahapKanban)[];
  ticketsByStage: Record<string, TiketWithDetails[]>;
}

export interface KanbanBoardFilterParams {
  squadId?: string;
  salesId?: string;
  search?: string;
  stages?: string[];
  priorities?: string[];
  closingFrom?: string;
  closingTo?: string;
  minEstimate?: number;
  maxEstimate?: number;
}

export interface MoveTicketStagePayload {
  id_tahap?: string;
  id_tahap_tujuan?: string;
  catatan?: string;
  posisi?: number;
}

export interface MoveTicketPayload {
  id_tiket: string;
  id_tahap?: string;
  fromStageId?: string;
  toStageId?: string;
  targetIndex?: number;
  ticketUpdates?: Partial<TiketWithDetails>;
  id_tahap_tujuan?: string;
  catatan?: string;
  posisi?: number;
}

export const kanbanService = {
  /**
   * Fetch all stages from backend
   * GET /tahap-kanban
   */
  async getStages(): Promise<ApiResponse<TahapKanban[]>> {
    const response = await api.get<ApiResponse<TahapKanban[]>>('/tahap-kanban');
    return response.data;
  },

  /**
   * Fetch Kanban board tickets
   * GET /tiket
   */
  async getBoard(params?: KanbanBoardFilterParams): Promise<ApiResponse<TiketWithDetails[]>> {
    const response = await api.get<ApiResponse<TiketWithDetails[]>>('/tiket', { params });
    return response.data;
  },

  /**
   * Fetch single ticket detail by ID
   * GET /tiket/:id
   */
  async getTicketById(id: string): Promise<ApiResponse<TiketWithDetails>> {
    const response = await api.get<ApiResponse<TiketWithDetails>>(`/tiket/${id}`);
    return response.data;
  },

  /**
   * Create a new ticket
   * POST /tiket
   */
  async createTicket(payload: CreateTiketInput): Promise<ApiResponse<TiketWithDetails>> {
    const response = await api.post<ApiResponse<TiketWithDetails>>('/tiket', payload);
    return response.data;
  },

  /**
   * Update an existing ticket
   * PUT /tiket/:id
   */
  async updateTicket(id: string, payload: UpdateTiketInput): Promise<ApiResponse<TiketWithDetails>> {
    const response = await api.put<ApiResponse<TiketWithDetails>>(`/tiket/${id}`, payload);
    return response.data;
  },

  /**
   * Move ticket to a new stage
   * PATCH /tiket/:id
   */
  async moveTicketStage(
    id: string,
    payload: MoveTicketStagePayload
  ): Promise<ApiResponse<TiketWithDetails>> {
    const body = {
      id_tahap: payload.id_tahap || payload.id_tahap_tujuan,
      catatan: payload.catatan,
      posisi: payload.posisi,
    };
    const response = await api.patch<ApiResponse<TiketWithDetails>>(
      `/tiket/${id}`,
      body
    );
    return response.data;
  },

  /**
   * Backward-compatible moveTicket wrapper.
   * If payload has id_tiket and id_tahap/toStageId, calls PATCH /tiket/:id.
   */
  async moveTicket(payload: MoveTicketPayload): Promise<ApiResponse<TiketWithDetails>> {
    const targetStageId = payload.id_tahap || payload.id_tahap_tujuan || payload.toStageId;
    if (payload.id_tiket && targetStageId) {
      return this.moveTicketStage(payload.id_tiket, {
        id_tahap: targetStageId,
        id_tahap_tujuan: targetStageId,
        catatan: payload.catatan,
        posisi: payload.posisi ?? payload.targetIndex,
      });
    }
    const response = await api.patch<ApiResponse<TiketWithDetails>>(`/tiket/${payload.id_tiket}`, payload);
    return response.data;
  },

  /**
   * Create an activity record
   * POST /aktivitas
   */
  async createAktivitas(
    payload: CreateAktivitasInput
  ): Promise<ApiResponse<AktivitasWithDetails>> {
    const response = await api.post<ApiResponse<AktivitasWithDetails>>('/aktivitas', payload);
    return response.data;
  },

  /**
   * Upload visit proof (selfie & GPS metadata)
   * POST /bukti-kunjungan
   */
  async createBuktiKunjungan(
    formData: FormData
  ): Promise<ApiResponse<BuktiKunjungan>> {
    const response = await api.post<ApiResponse<BuktiKunjungan>>(
      '/bukti-kunjungan',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  /**
   * Upload stage evidence (document, photo, audio)
   * POST /evidence
   */
  async createEvidence(
    formData: FormData
  ): Promise<ApiResponse<EvidenceItem>> {
    const response = await api.post<ApiResponse<EvidenceItem>>(
      '/evidence',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  /**
   * Create a new Kanban stage
   * POST /tahap-kanban
   */
  async createTahap(payload: CreateTahapKanbanInput): Promise<ApiResponse<TahapKanban>> {
    const response = await api.post<ApiResponse<TahapKanban>>('/tahap-kanban', payload);
    return response.data;
  },

  /**
   * Update an existing Kanban stage
   * PUT /tahap-kanban/:id
   */
  async updateTahap(
    id: string,
    payload: UpdateTahapKanbanInput
  ): Promise<ApiResponse<TahapKanban>> {
    const response = await api.put<ApiResponse<TahapKanban>>(`/tahap-kanban/${id}`, payload);
    return response.data;
  },

  /**
   * Delete a Kanban stage
   * DELETE /tahap-kanban/:id
   */
  async deleteTahap(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/tahap-kanban/${id}`);
    return response.data;
  },
};
