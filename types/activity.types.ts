export type JenisKegiatan = 'kunjungan' | 'follow_up' | 'penawaran' | 'closing';

export interface Aktivitas {
    id_aktivitas: string;
    id_user: string;
    id_tiket: string;
    tanggal: Date | string;
    catatan: string;
    jenis_kegiatan: JenisKegiatan;
    jadwal_follow_up: Date | string | null;
    created_at: Date | string;
    updated_at: Date | string;
}

export interface CreateAktivitasInput {
    id_user: string;
    id_tiket: string;
    tanggal: string | Date;
    catatan: string;
    jenis_kegiatan: JenisKegiatan;
    jadwal_follow_up?: string | Date | null;
}

export interface UpdateAktivitasInput {
    id_user?: string;
    id_tiket?: string;
    tanggal?: string | Date;
    catatan?: string;
    jenis_kegiatan?: JenisKegiatan;
    jadwal_follow_up?: string | Date | null;
}