import { z } from 'zod';

export const createUserSchema = z.object({
  id_squad: z.string().uuid({ message: 'ID Squad tidak valid' }).nullable().optional(),
  nama: z.string().min(1, { message: 'Nama user wajib diisi' }),
  role: z.enum(['sales', 'sales_manager', 'director'], { message: 'Pilih role yang valid' }),
  email: z.string().min(1, { message: 'Email wajib diisi' }).email({ message: 'Format email tidak valid' }),
  no_telp: z.string().min(9, { message: 'Nomor telepon minimal 9 digit' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
  password_hash: z.string().optional(),
});

export const updateUserSchema = createUserSchema.partial();
