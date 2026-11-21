import { TiketWithDetails } from '@/types/ticket.types';

export interface ProspekFormViewProps {
  mode: 'create' | 'edit';
  basePath: string;
  initialStageId?: string;
  ticket?: TiketWithDetails;
}

export interface ProspekDetailViewProps {
  ticketId?: string;
  ticket?: TiketWithDetails;
  basePath: string;
}

export type DetailTab = 'info' | 'penawaran' | 'riwayat' | 'aktivitas';

export type NegotiationResult = 'negosiasi' | 'won' | 'lost';

export interface FilePenawaran {
  name: string;
  size: string;
}
