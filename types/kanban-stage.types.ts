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
}

export interface CreateTahapKanbanInput {
    nama_tahap: string;
    urutan: number;
    jenis_tahap: JenisTahap;
    is_tahap_akhir: boolean;
    is_aktif: boolean;
}

export interface UpdateTahapKanbanInput {
    nama_tahap?: string;
    urutan?: number;
    jenis_tahap?: JenisTahap;
    is_tahap_akhir?: boolean;
    is_aktif?: boolean;
}