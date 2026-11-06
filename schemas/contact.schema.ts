import { z } from 'zod';

export const createContactSchema = z.object({
  id_pelanggan: z.string().uuid({ message: 'Pilih pelanggan yang sesuai terlebih dahulu' }),
  nama: z.string().min(1, { message: 'Nama kontak wajib diisi' }),
  jabatan: z.string().min(1, { message: 'Jabatan wajib diisi' }),
  no_telp: z.string().min(9, { message: 'Nomor telepon minimal 9 digit' }),
  email: z.string().min(1, { message: 'Email wajib diisi' }).email({ message: 'Format email tidak valid (contoh: user@mail.com)' }),
  kategori_peran: z.string().nullable().optional(),
  inisial: z.string().nullable().optional(),
});

export const updateContactSchema = createContactSchema.partial();
