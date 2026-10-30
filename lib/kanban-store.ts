import { create } from 'zustand';
import {
  INITIAL_KANBAN_STAGES,
  INITIAL_TICKETS_BY_STAGE,
  KanbanStageColumn,
} from '@/constants/kanban-constants';
import { AktivitasWithDetails, TiketWithDetails } from '@/types/ticket.types';

interface MoveTicketWithStageUpdateParams {
  id_tiket: string;
  fromStageId: string;
  toStageId: string;
  targetIndex?: number;
  ticketUpdates?: Partial<TiketWithDetails>;
  activity?: AktivitasWithDetails;
}

interface KanbanStoreState {
  stages: KanbanStageColumn[];
  ticketsByStage: Record<string, TiketWithDetails[]>;
  setTicketsByStage: (next: Record<string, TiketWithDetails[]>) => void;
  addTicket: (ticket: TiketWithDetails) => void;
  updateTicket: (id_tiket: string, updated: Partial<TiketWithDetails>) => void;
  moveTicketToStage: (id_tiket: string, targetStageId: string) => void;
  moveTicketWithStageUpdate: (params: MoveTicketWithStageUpdateParams) => void;
  addStage: (
    input:
      | string
      | {
          nama_tahap: string;
          jenis_tahap?: import('@/types/kanban-stage.types').JenisTahap;
          urutan?: number;
          is_tahap_akhir?: boolean;
          is_aktif?: boolean;
          dotColor?: string;
        },
  ) => void;
  addActivity: (id_tiket: string, activity: AktivitasWithDetails) => void;
  getTicketById: (id_tiket: string) => TiketWithDetails | undefined;
}

const STAGE_DOT_COLORS = ['#8B5CF6', '#EC4899', '#14B8A6', '#06B6D4', '#F97316'];

export const useKanbanStore = create<KanbanStoreState>((set, get) => ({
  stages: INITIAL_KANBAN_STAGES,
  ticketsByStage: INITIAL_TICKETS_BY_STAGE,

  setTicketsByStage: (next) =>
    set(() => {
      const normalized: Record<string, TiketWithDetails[]> = {};
      Object.entries(next).forEach(([stageId, items]) => {
        normalized[stageId] = items.map((item, idx) => ({
          ...item,
          id_tahap: stageId,
          posisi: idx + 1,
        }));
      });
      return { ticketsByStage: normalized };
    }),

  addTicket: (ticket) =>
    set((state) => {
      const stageId = ticket.id_tahap || 'visit';
      const currentList = state.ticketsByStage[stageId] ?? [];
      return {
        ticketsByStage: {
          ...state.ticketsByStage,
          [stageId]: [ticket, ...currentList],
        },
      };
    }),

  updateTicket: (id_tiket, updated) =>
    set((state) => {
      const nextMap: Record<string, TiketWithDetails[]> = {};
      let movedTicket: TiketWithDetails | null = null;
      let targetStageId: string | null = null;

      Object.entries(state.ticketsByStage).forEach(([stageId, items]) => {
        nextMap[stageId] = items
          .map((item) => {
            if (item.id_tiket !== id_tiket) return item;
            const merged = { ...item, ...updated, updated_at: new Date().toISOString() };
            if (updated.id_tahap && updated.id_tahap !== stageId) {
              movedTicket = merged;
              targetStageId = updated.id_tahap;
              return null;
            }
            return merged;
          })
          .filter((item): item is TiketWithDetails => item !== null);
      });

      if (movedTicket && targetStageId) {
        nextMap[targetStageId] = [movedTicket, ...(nextMap[targetStageId] ?? [])];
      }

      return { ticketsByStage: nextMap };
    }),

  moveTicketToStage: (id_tiket, targetStageId) =>
    set((state) => {
      let found: TiketWithDetails | null = null;
      let fromStageId: string | null = null;
      const nextMap: Record<string, TiketWithDetails[]> = {};

      Object.entries(state.ticketsByStage).forEach(([stageId, items]) => {
        const remaining: TiketWithDetails[] = [];
        items.forEach((item) => {
          if (item.id_tiket === id_tiket) {
            found = item;
            fromStageId = stageId;
          } else {
            remaining.push(item);
          }
        });
        nextMap[stageId] = remaining;
      });

      if (!found || !fromStageId || fromStageId === targetStageId) {
        return state;
      }

      const fromStageName =
        state.stages.find((s) => s.id_tahap === fromStageId)?.nama_tahap ?? fromStageId;
      const toStageName =
        state.stages.find((s) => s.id_tahap === targetStageId)?.nama_tahap ?? targetStageId;

      const updatedTicket: TiketWithDetails = {
        ...(found as TiketWithDetails),
        id_tahap: targetStageId,
        updated_at: new Date().toISOString(),
        riwayat_list: [
          {
            id_riwayat: `rw-${Date.now()}`,
            id_tiket,
            id_tahap_asal: fromStageId,
            id_tahap_tujuan: targetStageId,
            nama_tahap_asal: fromStageName,
            nama_tahap_tujuan: toStageName,
            id_user: (found as TiketWithDetails).id_user || 'usr-1',
            nama_user: (found as TiketWithDetails).nama_sales || 'Rina Putri',
            waktu_pindah: new Date().toISOString(),
            waktu_label: 'Baru saja',
          },
          ...((found as TiketWithDetails).riwayat_list ?? []),
        ],
      };

      nextMap[targetStageId] = [updatedTicket, ...(nextMap[targetStageId] ?? [])];
      return { ticketsByStage: nextMap };
    }),

  moveTicketWithStageUpdate: ({
    id_tiket,
    fromStageId,
    toStageId,
    targetIndex,
    ticketUpdates = {},
    activity,
  }) =>
    set((state) => {
      let found: TiketWithDetails | null = null;
      const nextMap: Record<string, TiketWithDetails[]> = {};

      Object.entries(state.ticketsByStage).forEach(([stageId, items]) => {
        const remaining: TiketWithDetails[] = [];
        items.forEach((item) => {
          if (item.id_tiket === id_tiket) {
            found = item;
          } else {
            remaining.push(item);
          }
        });
        nextMap[stageId] = remaining;
      });

      if (!found) return state;

      const fromStageName =
        state.stages.find((s) => s.id_tahap === fromStageId)?.nama_tahap ?? fromStageId;
      const toStageName =
        state.stages.find((s) => s.id_tahap === toStageId)?.nama_tahap ?? toStageId;

      const newRiwayatItem = {
        id_riwayat: `rw-${Date.now()}`,
        id_tiket,
        id_tahap_asal: fromStageId,
        id_tahap_tujuan: toStageId,
        nama_tahap_asal: fromStageName,
        nama_tahap_tujuan: toStageName,
        id_user: (found as TiketWithDetails).id_user || 'usr-1',
        nama_user: (found as TiketWithDetails).nama_sales || 'Rina Putri',
        waktu_pindah: new Date().toISOString(),
        waktu_label: 'Baru saja',
      };

      const updatedTicket: TiketWithDetails = {
        ...(found as TiketWithDetails),
        ...ticketUpdates,
        id_tahap: toStageId,
        updated_at: new Date().toISOString(),
        aktivitas_list: activity
          ? [activity, ...((found as TiketWithDetails).aktivitas_list ?? [])]
          : (found as TiketWithDetails).aktivitas_list,
        riwayat_list: [
          newRiwayatItem,
          ...((found as TiketWithDetails).riwayat_list ?? []),
        ],
      };

      const targetList = [...(nextMap[toStageId] ?? [])];
      if (
        typeof targetIndex === 'number' &&
        targetIndex >= 0 &&
        targetIndex <= targetList.length
      ) {
        targetList.splice(targetIndex, 0, updatedTicket);
      } else {
        targetList.unshift(updatedTicket);
      }
      nextMap[toStageId] = targetList.map((t, idx) => ({ ...t, posisi: idx + 1 }));

      return { ticketsByStage: nextMap };
    }),

  addStage: (input) =>
    set((state) => {
      const data = typeof input === 'string' ? { nama_tahap: input } : input;
      const nama_tahap = data.nama_tahap.trim();
      const slug =
        nama_tahap
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || `stage-${Date.now()}`;
      const id_tahap = state.ticketsByStage[slug] ? `${slug}-${Date.now()}` : slug;
      const newStage: KanbanStageColumn = {
        id_tahap,
        nama_tahap,
        urutan: data.urutan ?? state.stages.length + 1,
        jenis_tahap: data.jenis_tahap ?? 'follow_up',
        is_tahap_akhir: data.is_tahap_akhir ?? false,
        is_aktif: data.is_aktif ?? true,
        dotColor:
          data.dotColor ??
          STAGE_DOT_COLORS[state.stages.length % STAGE_DOT_COLORS.length],
      };

      return {
        stages: [...state.stages, newStage],
        ticketsByStage: {
          ...state.ticketsByStage,
          [id_tahap]: [],
        },
      };
    }),

  addActivity: (id_tiket, activity) =>
    set((state) => {
      const nextMap: Record<string, TiketWithDetails[]> = {};
      Object.entries(state.ticketsByStage).forEach(([stageId, items]) => {
        nextMap[stageId] = items.map((item) => {
          if (item.id_tiket !== id_tiket) return item;
          return {
            ...item,
            aktivitas_list: [activity, ...(item.aktivitas_list ?? [])],
            updated_at: new Date().toISOString(),
          };
        });
      });
      return { ticketsByStage: nextMap };
    }),

  getTicketById: (id_tiket) => {
    const allLists = Object.values(get().ticketsByStage);
    for (const list of allLists) {
      const match = list.find((item) => item.id_tiket === id_tiket);
      if (match) return match;
    }
    return undefined;
  },
}));
