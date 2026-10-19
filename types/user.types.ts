export type UserRole = 'sales' | 'sales_manager' | 'director';

export interface User {
    id_user: string;
    id_squad: string | null;
    nama: string;
    role: UserRole;
    email: string;
    no_telp: string;
    password_hash: string;
    created_at: Date | string;
    updated_at: Date | string;
}

export interface CreateUserInput {
    id_squad?: string | null;
    nama: string;
    role: UserRole;
    email: string;
    no_telp: string;
    password_hash: string;
}

export interface UpdateUserInput {
    id_squad?: string | null;
    nama?: string;
    role?: UserRole;
    email?: string;
    no_telp?: string;
    password_hash?: string;
}