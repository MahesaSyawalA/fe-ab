import {
  AktivitasWithDetails,
  CreateTiketInput,
  JenisEvidence,
  TiketWithDetails,
} from '@/types/ticket.types';
import { KanbanStageColumn } from '@/constants/kanban-constants';

export type StageDrawerMode = 'move' | 'create';

export interface EvidenceFileState {
  name: string;
  size: string;
  type?: string;
  url?: string;
  rawFile?: File;
}

export interface CreateTicketDrawerParams {
  newTicket: TiketWithDetails;
  createPayload: CreateTiketInput;
  activityPayload?: {
    catatan: string;
    tanggal: string;
    jenis_kegiatan: AktivitasWithDetails['jenis_kegiatan'];
    jadwal_follow_up?: string | null;
  };
  evidenceFile?: EvidenceFileState | null;
  gpsData?: {
    latitude: number;
    longitude: number;
    jarak_klien: number;
    dalam_radius: boolean;
  };
}

export interface StageActivityDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: StageDrawerMode;
  ticket?: TiketWithDetails | null;
  fromStage?: KanbanStageColumn | null;
  targetStage: KanbanStageColumn | null;
  targetIndex?: number;
  isSubmitting?: boolean;
  onConfirmMove?: (params: {
    id_tiket: string;
    fromStageId: string;
    toStageId: string;
    targetIndex?: number;
    ticketUpdates: Partial<TiketWithDetails>;
    activity: AktivitasWithDetails;
    evidenceFile?: EvidenceFileState | null;
    gpsData?: {
      latitude: number;
      longitude: number;
      jarak_klien: number;
      dalam_radius: boolean;
    };
  }) => void | Promise<void>;
  onCreateTicket?: (params: CreateTicketDrawerParams) => void | Promise<void>;
  onCancelMove?: () => void;
}

export const detectFileType = (fileName: string): JenisEvidence => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) return 'foto';
  if (['mp3', 'm4a', 'wav', 'ogg', 'aac'].includes(ext)) return 'audio';
  if (['txt', 'notes', 'md'].includes(ext)) return 'teks';
  return 'dokumen';
};
