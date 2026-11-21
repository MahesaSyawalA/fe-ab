import type { BuktiKunjungan } from './visit-proof.types';

export type JenisKegiatan =
  | 'visit'
  | 'kebutuhan'
  | 'opportunity'
  | 'follow_up'
  | 'quotation'
  | 'po'
  | 'revenue';

export type JenisEvidence = 'foto' | 'audio' | 'dokumen' | 'teks';

export interface EvidenceItem {
  id?: string;
  tipe: JenisEvidence;
  nama_file?: string;
  ukuran_file?: string;
  durasi_audio?: string;
  durasi_detik?: number;
  deskripsi: string;
  url_preview?: string;
  jenis?: JenisEvidence;
  waktu_upload?: string;
  file_size?: string;
  catatan?: string;
  url_file?: string;
}

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

export interface AktivitasPenawaranInfo {
  id_penawaran: string;
  no_penawaran: string;
  revisi_ke: number;
  total_nilai: number;
  status: string;
}

export interface AktivitasPurchaseOrderInfo {
  no_po: string;
  tanggal_po: Date | string;
  nilai_po: number;
}

export interface AktivitasWithDetails extends Aktivitas {
  nama_petugas: string;
  pic_ditemui: string;
  waktu_label: string;
  evidence?: EvidenceItem | EvidenceItem[] | null;
  bukti_kunjungan?: BuktiKunjungan | BuktiKunjungan[] | null;
  penawaran?: AktivitasPenawaranInfo | AktivitasPenawaranInfo[] | null;
  purchase_order?: AktivitasPurchaseOrderInfo | null;
}

export interface CreateAktivitasInput {
  id_user: string;
  id_tiket: string;
  tanggal: string | Date;
  catatan: string;
  jenis_kegiatan: JenisKegiatan;
  jadwal_follow_up?: string | Date | null;
  total_nilai?: number;
}

export interface UpdateAktivitasInput {
  id_user?: string;
  id_tiket?: string;
  tanggal?: string | Date;
  catatan?: string;
  jenis_kegiatan?: JenisKegiatan;
  jadwal_follow_up?: string | Date | null;
}
