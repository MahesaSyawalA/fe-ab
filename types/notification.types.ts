export interface Notifikasi {
    id_notifikasi: string;
    id_tiket: string;
    title: string;
    isRead: boolean;
    message: string;
    created_at: Date | string;
    updated_at: Date | string;
}

export interface CreateNotifikasiInput {
    id_tiket: string;
    title: string;
    isRead?: boolean;
    message: string;
}

export interface UpdateNotifikasiInput {
    id_tiket?: string;
    title?: string;
    isRead?: boolean;
    message?: string;
}