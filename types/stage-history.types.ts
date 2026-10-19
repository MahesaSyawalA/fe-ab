export interface RiwayatTahap {
    id_riwayat: string;
    id_tiket: string;
    id_tahap_asal: string | null;
    id_tahap_tujuan: string;
    id_user: string;
    waktu_pindah: Date | string;
}

export interface CreateRiwayatTahapInput {
    id_tiket: string;
    id_tahap_asal?: string | null;
    id_tahap_tujuan: string;
    id_user: string;
    waktu_pindah?: string | Date;
}

export interface UpdateRiwayatTahapInput {
    id_tiket?: string;
    id_tahap_asal?: string | null;
    id_tahap_tujuan?: string;
    id_user?: string;
    waktu_pindah?: string | Date;
}