export type JenisTahap =
  | 'visit'
  | 'kebutuhan'
  | 'opportunity'
  | 'follow_up'
  | 'quotation'
  | 'po'
  | 'revenue';

export interface TahapKanban {
  id_tahap: string;
  nama_tahap: string;
  urutan: number;
  jenis_tahap: JenisTahap;
  is_tahap_akhir: boolean;
  is_aktif: boolean;
  dotColor?: string;
}

export interface KanbanStageColumn extends TahapKanban {
  dotColor: string;
}

export interface CreateTahapKanbanInput {
  nama_tahap: string;
  urutan: number;
  jenis_tahap: JenisTahap;
  is_tahap_akhir: boolean;
  is_aktif: boolean;
  dotColor?: string;
}

export interface UpdateTahapKanbanInput {
  nama_tahap?: string;
  urutan?: number;
  jenis_tahap?: JenisTahap;
  is_tahap_akhir?: boolean;
  is_aktif?: boolean;
  dotColor?: string;
}
