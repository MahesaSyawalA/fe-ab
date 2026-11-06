export interface Kontak {
  id_kontak: string;
  id_pelanggan: string;
  nama: string;
  jabatan: string;
  no_telp: string;
  email: string;
  kategori_peran: string | null;
  inisial: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface CreateKontakInput {
  id_pelanggan: string;
  nama: string;
  jabatan: string;
  no_telp: string;
  email: string;
  kategori_peran?: string | null;
  inisial?: string | null;
}

export interface UpdateKontakInput {
  id_pelanggan?: string;
  nama?: string;
  jabatan?: string;
  no_telp?: string;
  email?: string;
  kategori_peran?: string | null;
  inisial?: string | null;
}
