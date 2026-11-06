import {
  AktivitasWithDetails,
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
}

export interface StageActivityDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: StageDrawerMode;
  ticket?: TiketWithDetails | null;
  fromStage?: KanbanStageColumn | null;
  targetStage: KanbanStageColumn | null;
  targetIndex?: number;
  onConfirmMove?: (params: {
    id_tiket: string;
    fromStageId: string;
    toStageId: string;
    targetIndex?: number;
    ticketUpdates: Partial<TiketWithDetails>;
    activity: AktivitasWithDetails;
  }) => void;
  onCreateTicket?: (newTicket: TiketWithDetails) => void;
  onCancelMove?: () => void;
}

export const detectFileType = (fileName: string): JenisEvidence => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) return 'foto';
  if (['mp3', 'm4a', 'wav', 'ogg', 'aac'].includes(ext)) return 'audio';
  if (['txt', 'notes', 'md'].includes(ext)) return 'teks';
  return 'dokumen';
};
