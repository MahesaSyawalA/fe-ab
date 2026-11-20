import { api } from '@/lib/axios';
import type { ApiPaginatedResponse, ApiResponse } from '@/types/api.types';
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
  UpdateAktivitasInput,
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
  ticketUpdates?: Partial<TiketWithDetails>;
}

/** Field tiket dari form tahap yang ikut dikirim ke backend saat pindah tahap (nilai, tanggal, hasil closing). */
const STAGE_TICKET_FIELDS = [
  'estimasi_nilai',
  'estimasi_closing',
  'status',
  'tanggal_closing',
  'tanggal_penawaran_awal',
  'kebutuhan_pelanggan',
  'alasan_lost',
] as const;

function pickStageTicketFields(updates: Partial<TiketWithDetails> = {}) {
  return Object.fromEntries(
    STAGE_TICKET_FIELDS.flatMap((key) => (updates[key] === undefined ? [] : [[key, updates[key]]])),
  );
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

  async getStages(): Promise<ApiResponse<TahapKanban[]>> {
    const response = await api.get<ApiResponse<TahapKanban[]>>('/tahap-kanban');
    return response.data;
  },

  async getBoard(params?: KanbanBoardFilterParams): Promise<ApiResponse<TiketWithDetails[]>> {
    const firstResponse = await api.get<ApiPaginatedResponse<TiketWithDetails>>('/tiket', {
      params: {
        ...params,
        page: 1,
        limit: 100,
      },
    });
    const firstPayload = firstResponse.data;
    const allTickets = [...(Array.isArray(firstPayload?.data) ? firstPayload.data : [])];
    const totalPages = firstPayload?.meta?.total_pages ?? 1;

    if (totalPages > 1) {
      const restResponses = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, idx) =>
          api.get<ApiPaginatedResponse<TiketWithDetails>>('/tiket', {
            params: {
              ...params,
              page: idx + 2,
              limit: 100,
            },
          }),
        ),
      );
      for (const res of restResponses) {
        if (Array.isArray(res.data?.data)) {
          allTickets.push(...res.data.data);
        }
      }
    }

    return {
      success: firstPayload?.success ?? true,
      data: allTickets,
      message: firstPayload?.message,
    };
  },

  async getTicketById(id: string): Promise<ApiResponse<TiketWithDetails>> {
    const [ticketResponse, aktivitasResponse] = await Promise.all([
      api.get<ApiResponse<TiketWithDetails>>(`/tiket/${id}`),
      api
        .get<ApiResponse<AktivitasWithDetails[]>>('/aktivitas', {
          params: { id_tiket: id, limit: 50 },
        })
        .catch(() => null),
    ]);

    const ticket = ticketResponse.data;
    if (ticket.data && aktivitasResponse?.data?.data) {
      const aktMap = new Map<string, AktivitasWithDetails>(
        aktivitasResponse.data.data.map((a) => [a.id_aktivitas, a]),
      );
      if (ticket.data.aktivitas_list) {
        ticket.data.aktivitas_list = ticket.data.aktivitas_list.map((akt) => {
          const fresh = aktMap.get(akt.id_aktivitas);
          if (fresh) {
            return {
              ...akt,
              ...fresh,
              evidence: fresh.evidence ?? akt.evidence,
              bukti_kunjungan: fresh.bukti_kunjungan ?? akt.bukti_kunjungan,
            };
          }
          return akt;
        });
      } else {
        ticket.data.aktivitas_list = aktivitasResponse.data.data;
      }
    }
    return ticket;
  },

  async createTicket(payload: CreateTiketInput): Promise<ApiResponse<TiketWithDetails>> {
    const response = await api.post<ApiResponse<TiketWithDetails>>('/tiket', payload);
    return response.data;
  },

  async updateTicket(id: string, payload: UpdateTiketInput): Promise<ApiResponse<TiketWithDetails>> {
    const response = await api.put<ApiResponse<TiketWithDetails>>(`/tiket/${id}`, payload);
    return response.data;
  },

  async updateTicketPosition(id: string, posisi: number): Promise<ApiResponse<TiketWithDetails>> {
    const response = await api.patch<ApiResponse<TiketWithDetails>>(`/tiket/${id}`, { posisi });
    return response.data;
  },

  async deleteTicket(id: string): Promise<ApiResponse<null>> {
    const response = await api.delete<ApiResponse<null>>(`/tiket/${id}`);
    return response.data;
  },

  async moveTicketStage(
    id: string,
    payload: MoveTicketStagePayload
  ): Promise<ApiResponse<TiketWithDetails>> {
    const body = {
      id_tahap: payload.id_tahap || payload.id_tahap_tujuan,
      catatan: payload.catatan,
      posisi: payload.posisi,
      ...pickStageTicketFields(payload.ticketUpdates),
    };
    const response = await api.patch<ApiResponse<TiketWithDetails>>(
      `/tiket/${id}`,
      body
    );
    return response.data;
  },

  async moveTicket(payload: MoveTicketPayload): Promise<ApiResponse<TiketWithDetails>> {
    const targetStageId = payload.id_tahap || payload.id_tahap_tujuan || payload.toStageId;
    if (payload.id_tiket && targetStageId) {
      return this.moveTicketStage(payload.id_tiket, {
        id_tahap: targetStageId,
        id_tahap_tujuan: targetStageId,
        catatan: payload.catatan,
        posisi: payload.posisi ?? payload.targetIndex,
        ticketUpdates: payload.ticketUpdates,
      });
    }
    const response = await api.patch<ApiResponse<TiketWithDetails>>(`/tiket/${payload.id_tiket}`, payload);
    return response.data;
  },

  async createAktivitas(
    payload: CreateAktivitasInput
  ): Promise<ApiResponse<AktivitasWithDetails>> {
    const response = await api.post<ApiResponse<AktivitasWithDetails>>('/aktivitas', payload);
    return response.data;
  },

  async updateAktivitas(
    id: string,
    payload: UpdateAktivitasInput
  ): Promise<ApiResponse<AktivitasWithDetails>> {
    const response = await api.patch<ApiResponse<AktivitasWithDetails>>(`/aktivitas/${id}`, payload);
    return response.data;
  },

  async deleteAktivitas(id: string): Promise<ApiResponse<null>> {
    const response = await api.delete<ApiResponse<null>>(`/aktivitas/${id}`);
    return response.data;
  },

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

  async createTahap(payload: CreateTahapKanbanInput): Promise<ApiResponse<TahapKanban>> {
    const response = await api.post<ApiResponse<TahapKanban>>('/tahap-kanban', payload);
    return response.data;
  },

  async updateTahap(
    id: string,
    payload: UpdateTahapKanbanInput
  ): Promise<ApiResponse<TahapKanban>> {
    const response = await api.put<ApiResponse<TahapKanban>>(`/tahap-kanban/${id}`, payload);
    return response.data;
  },

  async deleteTahap(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/tahap-kanban/${id}`);
    return response.data;
  },
};
