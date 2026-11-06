import { Kontak } from './contact.types';

export interface Pelanggan {
  id_pelanggan: string;
  nama_outlet: string;
  tipe_outlet: string;
  nama_faskes?: string;
  tipe_faskes?: string;
  alamat: string;
  latitude: number;
  longitude: number;
  radius_kunjungan: number;
  img_url: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface PelangganWithDetails extends Pelanggan {
  nama_outlet: string;
  tipe_outlet: string;
  nama_faskes?: string;
  tipe_faskes?: string;
  jarak_km?: number | string;
  tiket_aktif?: number;
  total_kunjungan?: number;
  estimasi_nilai?: string;
  status?: 'Aktif' | 'Nonaktif' | 'Prospek';
  kontak_list?: Kontak[];
}

export interface CreatePelangganInput {
  nama_outlet?: string;
  tipe_outlet?: string;
  nama_faskes?: string;
  tipe_faskes?: string;
  alamat: string;
  latitude: number;
  longitude: number;
  radius_kunjungan: number;
  img_url: string;
  kontak?: Array<{
    nama: string;
    jabatan: string;
    no_telp: string;
    email: string;
  }>;
}

export interface UpdatePelangganInput {
  nama_outlet?: string;
  tipe_outlet?: string;
  nama_faskes?: string;
  tipe_faskes?: string;
  alamat?: string;
  latitude?: number;
  longitude?: number;
  radius_kunjungan?: number;
  img_url?: string;
}
