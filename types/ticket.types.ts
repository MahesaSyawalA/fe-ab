export type TiketStatus = 'open' | 'won' | 'lost';
export type TiketPrioritas = 'rendah' | 'sedang' | 'tinggi';

export interface Tiket {
    id_tiket: string;
    id_pelanggan: string;
    id_user: string;
    id_tahap: string;
    id_kontak: string | null;
    judul: string;
    estimasi_nilai: number;
    estimasi_closing: Date | string;
    status: TiketStatus;
    kebutuhan_pelanggan: string;
    prioritas: TiketPrioritas;
    posisi: number;
    tanggal_penawaran_awal: Date | string | null;
    tanggal_closing: Date | string | null;
    alasan_lost: string | null;
    created_at: Date | string;
    updated_at: Date | string;
}

export interface CreateTiketInput {
    id_pelanggan: string;
    id_user: string;
    id_tahap: string;
    id_kontak?: string | null;
    judul: string;
    estimasi_nilai: number;
    estimasi_closing: string | Date;
    status: TiketStatus;
    kebutuhan_pelanggan: string;
    prioritas: TiketPrioritas;
    posisi: number;
    tanggal_penawaran_awal?: string | Date | null;
    tanggal_closing?: string | Date | null;
    alasan_lost?: string | null;
}

export interface UpdateTiketInput {
    id_pelanggan?: string;
    id_user?: string;
    id_tahap?: string;
    id_kontak?: string | null;
    judul?: string;
    estimasi_nilai?: number;
    estimasi_closing?: string | Date;
    status?: TiketStatus;
    kebutuhan_pelanggan?: string;
    prioritas?: TiketPrioritas;
    posisi?: number;
    tanggal_penawaran_awal?: string | Date | null;
    tanggal_closing?: string | Date | null;
    alasan_lost?: string | null;
}