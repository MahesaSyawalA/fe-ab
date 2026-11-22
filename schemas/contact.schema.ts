import { z } from 'zod';
import { hasDangerousXssPattern } from '@/lib/utils';

const safeText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, { message: `${label} wajib diisi` })
    .max(max, { message: `${label} maksimal ${max} karakter` })
    .refine((val) => !hasDangerousXssPattern(val), {
      message: `${label} mengandung karakter atau skrip yang tidak diperbolehkan`,
    });

export const createContactSchema = z.object({
  id_pelanggan: z.string().uuid({ message: 'Pilih pelanggan yang sesuai terlebih dahulu' }),
  nama: safeText('Nama kontak', 150),
  jabatan: safeText('Jabatan', 100),
  no_telp: z
    .string()
    .trim()
    .min(9, { message: 'Nomor telepon minimal 9 digit' })
    .max(20, { message: 'Nomor telepon maksimal 20 karakter' })
    .refine((val) => /^[0-9+\s-]{9,20}$/.test(val) && val.replace(/\D/g, '').length >= 9, {
      message: 'Format nomor telepon tidak valid',
    }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email wajib diisi' })
    .max(150, { message: 'Email maksimal 150 karakter' })
    .email({ message: 'Format email tidak valid (contoh: user@mail.com)' }),
  kategori_peran: z
    .string()
    .trim()
    .max(50, { message: 'Kategori peran maksimal 50 karakter' })
    .refine((val) => !hasDangerousXssPattern(val), {
      message: 'Kategori peran mengandung karakter tidak valid',
    })
    .optional(),
  inisial: z
    .string()
    .trim()
    .max(10, { message: 'Inisial maksimal 10 karakter' })
    .optional(),
});

export const updateContactSchema = createContactSchema.partial();
