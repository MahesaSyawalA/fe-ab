import { z } from 'zod';

export const createUserSchema = z.object({
    id_squad: z.uuid({ message: 'ID Squad tidak valid' }).nullable().optional(),
    nama: z.string().min(1, { message: 'Nama user wajib diisi' }),
    role: z.enum(['sales', 'sales_manager', 'director'], { message: 'Pilih role yang valid' }),
    email: z.string().min(1, { message: 'Email wajib diisi' }).email({ message: 'Format email tidak valid' }),
    no_telp: z.string().min(9, { message: 'Nomor telepon minimal 9 digit' }),
    password_hash: z.string().min(6, { message: 'Password wajib diisi (minimal 6 karakter)' }),
});

export const updateUserSchema = createUserSchema.partial();