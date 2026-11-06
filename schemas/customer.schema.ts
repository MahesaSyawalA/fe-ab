import { z } from 'zod';

export const createCustomerSchema = z.object({
  nama_outlet: z.string().min(1, { message: 'Nama outlet wajib diisi' }),
  tipe_outlet: z.string().min(1, { message: 'Tipe outlet wajib diisi/dipilih' }),
  alamat: z.string().min(5, { message: 'Alamat terlalu pendek, minimal 5 karakter' }),
  latitude: z.coerce.number({ message: 'Latitude harus berupa angka' }),
  longitude: z.coerce.number({ message: 'Longitude harus berupa angka' }),
  radius_kunjungan: z.coerce.number({ message: 'Radius kunjungan harus berupa angka' }),
  img_url: z.string().min(1, { message: 'URL gambar outlet wajib diupload' }),
  kontak: z.array(z.object({
    nama: z.string().min(1, { message: 'Nama kontak wajib diisi' }),
    jabatan: z.string().min(1, { message: 'Jabatan kontak wajib diisi' }),
    no_telp: z.string().min(9, { message: 'Nomor telepon minimal 9 digit' }),
    email: z.string().min(1, { message: 'Email kontak wajib diisi' }).email({ message: 'Format email kontak tidak valid' }),
  })).optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();
