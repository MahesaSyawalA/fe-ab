export interface Squad {
    id_squad: string;
    id_supervisor: string | null;
    nama_squad: string;
    kode_squad: string;
    wilayah: string;
    is_active: boolean;
    created_at: Date | string;
    updated_at: Date | string;
}

export interface CreateSquadInput {
    id_supervisor?: string | null;
    nama_squad: string;
    kode_squad: string;
    wilayah: string;
    is_active: boolean;
}

export interface UpdateSquadInput {
    id_supervisor?: string | null;
    nama_squad?: string;
    kode_squad?: string;
    wilayah?: string;
    is_active?: boolean;
}