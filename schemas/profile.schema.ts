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
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, '');
        return digits.length >= 9 && digits.length <= 15;
      },
      {
        message: 'Nomor telepon harus antara 9 hingga 15 digit angka',
      },
    ),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
