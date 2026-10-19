export interface BuktiKunjungan {
    id_bukti: string;
    id_aktivitas: string;
    longitude: number;
    latitude: number;
    jarak_klien: number;
    dalam_radius: boolean;
    img_url: string;
    created_at: Date | string;
    updated_at: Date | string;
}

export interface CreateBuktiKunjunganInput {
    id_aktivitas: string;
    longitude: number;
    latitude: number;
    jarak_klien: number;
    dalam_radius: boolean;
    img_url: string;
}

export interface UpdateBuktiKunjunganInput {
    id_aktivitas?: string;
    longitude?: number;
    latitude?: number;
    jarak_klien?: number;
    dalam_radius?: boolean;
    img_url?: string;
}