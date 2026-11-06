import { PelangganWithDetails } from '@/types/customer.types';
import { DEFAULT_OUTLET_IMAGE } from '@/constants/pelanggan-constants';
import {
  FormStepLokasiData,
  FormStepProfilData,
  KontakInputItem,
} from './types';

/** Menyusun objek pelanggan baru dari tiga step wizard; field kosong diisi nilai bawaan prototipe. */
export function buildPelanggan(
  profil: FormStepProfilData,
  lokasi: FormStepLokasiData,
  contacts: KontakInputItem[],
): PelangganWithDetails {
  const newId = `plg-${Date.now()}`;

  return {
    id_pelanggan: newId,
    nama_outlet: profil.nama_faskes || 'RS Harapan Baru',
    tipe_outlet: profil.tipe_faskes,
    nama_faskes: profil.nama_faskes || 'RS Harapan Baru',
    tipe_faskes: profil.tipe_faskes,
    alamat:
      profil.alamat ||
      'Jl. Salemba Raya No. 42A, Kenari, Senen, Jakarta Pusat 10430',
    latitude: lokasi.latitude,
    longitude: lokasi.longitude,
    radius_kunjungan: lokasi.radius_kunjungan,
    img_url: profil.img_url || DEFAULT_OUTLET_IMAGE,
    jarak_km: '1,2 km',
    tiket_aktif: 0,
    total_kunjungan: 0,
    estimasi_nilai: 'Rp0',
    status: 'Aktif',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    kontak_list: contacts.map((c, i) => ({
      id_kontak: `kt-${Date.now()}-${i}`,
      id_pelanggan: newId,
      nama: c.nama,
      jabatan: c.jabatan,
      no_telp: c.no_telp,
      email: c.email,
      kategori_peran: null,
      inisial: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })),
  };
}
