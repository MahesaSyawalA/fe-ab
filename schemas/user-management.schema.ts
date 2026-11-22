import { z } from 'zod';
import { hasDangerousXssPattern } from '@/lib/utils';

const requiredPhoneSchema = z
  .string()
  .trim()
  .min(1, 'Nomor telepon wajib diisi')
  .max(20, 'Nomor telepon maksimal 20 karakter')
  .refine(
    (val) => /^[0-9+\s-]{9,20}$/.test(val) && val.replace(/\D/g, '').length >= 9,
    {
      message: 'Nomor telepon tidak valid (minimal 9 digit angka)',
    },
  );

const optionalPhoneSchema = z
  .string()
  .trim()
  .max(20, 'Nomor telepon maksimal 20 karakter')
  .refine(
    (val) => !val || (/^[0-9+\s-]{9,20}$/.test(val) && val.replace(/\D/g, '').length >= 9),
    {
      message: 'Nomor telepon tidak valid (minimal 9 digit angka)',
    },
  )
  .optional();

export const createUserSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter')
    .refine((val) => !hasDangerousXssPattern(val), {
      message: 'Nama lengkap mengandung karakter tidak valid',
    }),
  email: z
    .string()
    .trim()
    .max(150, 'Email maksimal 150 karakter')
    .email('Format email tidak valid'),
  no_telp: requiredPhoneSchema,
  role: z.enum(['director', 'sales_manager', 'sales', 'admin'], {
    message: 'Pilih role pengguna',
  }),
  id_squad: z.string().nullable().optional(),
  password_mode: z.enum(['auto', 'manual']),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(72, 'Password maksimal 72 karakter'),
  must_change_password: z.boolean().default(true),
  send_email: z.boolean().default(true),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter')
    .refine((val) => !hasDangerousXssPattern(val), {
      message: 'Nama lengkap mengandung karakter tidak valid',
    }),
  email: z
    .string()
    .trim()
    .max(150, 'Email maksimal 150 karakter')
    .email('Format email tidak valid'),
  no_telp: optionalPhoneSchema,
  role: z.enum(['director', 'sales_manager', 'sales', 'admin'], {
    message: 'Pilih role pengguna',
  }),
  id_squad: z.string().nullable().optional(),
  status: z.enum(['aktif', 'nonaktif']),
});

export type EditUserInput = z.infer<typeof editUserSchema>;

export const resetPasswordSchema = z.object({
  password_mode: z.enum(['auto', 'manual']),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(72, 'Password maksimal 72 karakter'),
  must_change_password: z.boolean().default(true),
  send_email: z.boolean().default(true),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
