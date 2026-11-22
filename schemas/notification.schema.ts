import { z } from 'zod';
import { hasDangerousXssPattern } from '@/lib/utils';

export const createNotificationSchema = z.object({
  id_tiket: z.uuid({ message: 'ID Tiket tidak valid atau belum dipilih' }),
  title: z
    .string()
    .trim()
    .min(1, { message: 'Judul notifikasi wajib diisi' })
    .max(150, { message: 'Judul notifikasi maksimal 150 karakter' })
    .refine((val) => !hasDangerousXssPattern(val), {
      message: 'Judul notifikasi mengandung karakter tidak valid',
    }),
  isRead: z.boolean().optional(),
  message: z
    .string()
    .trim()
    .min(1, { message: 'Pesan notifikasi tidak boleh kosong' })
    .max(2000, { message: 'Pesan notifikasi maksimal 2000 karakter' })
    .refine((val) => !hasDangerousXssPattern(val), {
      message: 'Pesan notifikasi mengandung karakter tidak valid',
    }),
});

export const updateNotificationSchema = createNotificationSchema.partial();
