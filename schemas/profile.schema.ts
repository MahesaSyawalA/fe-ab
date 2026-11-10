import { z } from 'zod';

export const updateProfileSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(1, { message: 'Nama lengkap wajib diisi' })
    .min(3, { message: 'Nama lengkap minimal 3 karakter' })
    .max(100, { message: 'Nama lengkap maksimal 100 karakter' }),
  no_telp: z
    .string()
    .trim()
    .min(1, { message: 'Nomor telepon wajib diisi' })
    .regex(/^(\+62|62|0)[0-9]{8,15}$/, {
      message: 'Format nomor telepon tidak valid (contoh: 08123456789 atau +628123456789)',
    }),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

