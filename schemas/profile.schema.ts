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

export const changePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(1, { message: 'Password saat ini wajib diisi' }),
    new_password: z
      .string()
      .min(1, { message: 'Password baru wajib diisi' })
      .min(8, { message: 'Password baru minimal 8 karakter' }),
    confirm_password: z
      .string()
      .min(1, { message: 'Konfirmasi password wajib diisi' }),
  })
  .refine((data) => data.new_password !== data.current_password, {
    message: 'Password baru tidak boleh sama dengan password saat ini',
    path: ['new_password'],
  })
  .refine((data) => data.confirm_password === data.new_password, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirm_password'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
