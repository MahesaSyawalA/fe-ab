export type StatusPurchaseOrder =
    | 'diterima'
    | 'diproses'
    | 'selesai'
    | 'dibatalkan';

export interface PurchaseOrder {
    id_po: string;
    id_penawaran: string | null;
    id_tiket: string;
    no_po: string;
    tanggal_po: Date | string;
    nilai_po: number;
    status: StatusPurchaseOrder;
    url_file_po: string;
    nilai_revenue: number;
    tanggal_revenue: Date | string | null;
    created_at: Date | string;
    updated_at: Date | string;
}

export interface CreatePurchaseOrderInput {
    id_penawaran?: string | null;
    id_tiket: string;
    no_po: string;
    tanggal_po: string | Date;
    nilai_po: number;
    status: StatusPurchaseOrder;
    url_file_po: string;
    nilai_revenue: number;
    tanggal_revenue?: string | Date | null;
}

export interface UpdatePurchaseOrderInput {
    id_penawaran?: string | null;
    id_tiket?: string;
    no_po?: string;
    tanggal_po?: string | Date;
    nilai_po?: number;
    status?: StatusPurchaseOrder;
    url_file_po?: string;
    nilai_revenue?: number;
    tanggal_revenue?: string | Date | null;
}