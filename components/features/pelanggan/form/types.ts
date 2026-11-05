export interface FormStepProfilData {
  nama_faskes: string;
  tipe_faskes: string;
  alamat: string;
  img_url: string;
}

export interface FormStepLokasiData {
  latitude: number;
  longitude: number;
  radius_kunjungan: number;
}

export interface KontakInputItem {
  nama: string;
  jabatan: string;
  no_telp: string;
  email: string;
}
