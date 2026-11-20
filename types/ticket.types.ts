import type {
  Aktivitas,
  AktivitasWithDetails,
  EvidenceItem,
  JenisEvidence,
} from './activity.types';
import type {
  RiwayatTahap,
  RiwayatTahapWithDetails,
} from './stage-history.types';

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

export type {
  Aktivitas,
  JenisEvidence,
  EvidenceItem,
  AktivitasWithDetails,
  RiwayatTahap,
  RiwayatTahapWithDetails,
};

export interface TiketWithDetails extends Tiket {
  kode_tiket: string;
  nama_outlet: string;
  nama_pic?: string;
  jabatan_pic?: string;
  no_telp_pic?: string;
  nama_sales?: string;
  inisial_sales?: string;
  closing_short_label?: string;
  closing_full_label?: string;
  file_penawaran?: {
    name: string;
    size: string;
  } | null;
  aktivitas_list?: AktivitasWithDetails[];
  riwayat_list?: RiwayatTahapWithDetails[];
  /** Hari dari masuk tahap quotation sampai revenue; null bila belum closing. */
  durasi_siklus_hari?: number | null;
}

export interface TeamContributionItem {
  id: string;
  name: string;
  valueLabel: string;
  ticketsLabel: string;
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
