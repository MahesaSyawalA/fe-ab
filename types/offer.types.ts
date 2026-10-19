export type StatusPenawaran = 'draft' | 'dikirim' | 'disetujui' | 'ditolak';

export interface Penawaran {
    id_penawaran: string;
    id_tiket: string;
    id_aktivitas: string | null;
    no_penawaran: string;
    revisi_ke: number;
    tanggal_penawaran: Date | string;
    total_nilai: number;
    status: StatusPenawaran;
    url_file_penawaran: string;
    created_at: Date | string;
    updated_at: Date | string;
}

export interface CreatePenawaranInput {
    id_tiket: string;
    id_aktivitas?: string | null;
    no_penawaran: string;
    revisi_ke: number;
    tanggal_penawaran: string | Date;
    total_nilai: number;
    status: StatusPenawaran;
    url_file_penawaran: string;
}

export interface UpdatePenawaranInput {
    id_tiket?: string;
    id_aktivitas?: string | null;
    no_penawaran?: string;
    revisi_ke?: number;
    tanggal_penawaran?: string | Date;
    total_nilai?: number;
    status?: StatusPenawaran;
    url_file_penawaran?: string;
}