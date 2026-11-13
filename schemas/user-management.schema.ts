import { z } from 'zod';

export const createUserSchema = z.object({
  nama: z.string().trim().min(2, 'Nama lengkap minimal 2 karakter'),
  email: z.string().trim().email('Format email tidak valid'),
  no_telp: z
    .string()
    .trim()
    .refine((val) => !val || /^[0-9+\s-]{9,15}$/.test(val), {
      message: 'Nomor telepon tidak valid (9–15 digit)',
    })
    .optional(),
  role: z.enum(['director', 'sales_manager', 'sales', 'admin'], {
    message: 'Pilih role pengguna',
  }),
  id_squad: z.string().nullable().optional(),
  password_mode: z.enum(['auto', 'manual']),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  must_change_password: z.boolean().default(true),
  send_email: z.boolean().default(true),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  nama: z.string().trim().min(2, 'Nama lengkap minimal 2 karakter'),
  email: z.string().trim().email('Format email tidak valid'),
  no_telp: z
    .string()
    .trim()
    .refine((val) => !val || /^[0-9+\s-]{9,15}$/.test(val), {
      message: 'Nomor telepon tidak valid (9–15 digit)',
    })
    .optional(),
  role: z.enum(['director', 'sales_manager', 'sales', 'admin'], {
    message: 'Pilih role pengguna',
  }),
  id_squad: z.string().nullable().optional(),
  status: z.enum(['aktif', 'nonaktif']),
});

export type EditUserInput = z.infer<typeof editUserSchema>;

export const resetPasswordSchema = z.object({
  password_mode: z.enum(['auto', 'manual']),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  must_change_password: z.boolean().default(true),
  send_email: z.boolean().default(true),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
