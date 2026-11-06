import type { User } from './user.types';

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

/** Anggota/supervisor squad — subset `User` tanpa `password_hash`. */
export type SquadMember = Pick<User, 'id_user' | 'nama' | 'role' | 'email' | 'no_telp'>;

/** Squad beserta supervisor, anggota, dan progres tiket (won / total) anggotanya. */
export interface SquadWithDetails extends Squad {
    supervisor: SquadMember | null;
    members: SquadMember[];
    member_count: number;
    progress_persen: number;
}

export interface CreateSquadInput {
    id_supervisor?: string | null;
    nama_squad: string;
    kode_squad: string;
    wilayah: string;
    is_active: boolean;
    /** Daftar `id_user` anggota; menggantikan seluruh anggota saat update. */
    member_ids?: string[];
}

export interface UpdateSquadInput {
    id_supervisor?: string | null;
    nama_squad?: string;
    kode_squad?: string;
    wilayah?: string;
    is_active?: boolean;
    member_ids?: string[];
}
