import { z } from 'zod';

export const createCustomerSchema = z.object({
    nama_faskes: z.string().min(1, { message: 'Nama faskes wajib diisi' }),
    tipe_faskes: z.string().min(1, { message: 'Tipe faskes wajib diisi/dipilih' }),
    alamat: z.string().min(5, { message: 'Alamat terlalu pendek, minimal 5 karakter' }),
    latitude: z.coerce.number({ message: 'Latitude harus berupa angka' }),
    longitude: z.coerce.number({ message: 'Longitude harus berupa angka' }),
    radius_kunjungan: z.coerce.number({ message: 'Radius kunjungan harus berupa angka' }),
    img_url: z.string().min(1, { message: 'URL gambar faskes wajib diupload' }),
});

export const updateCustomerSchema = createCustomerSchema.partial();