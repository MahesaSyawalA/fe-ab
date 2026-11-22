import { z } from 'zod';
import { hasDangerousXssPattern } from '@/lib/utils';

export const createActivitySchema = z.object({
  id_user: z.string().uuid({ message: 'ID User tidak valid atau belum ditemukan' }),
  id_tiket: z.string().uuid({ message: 'Pilih tiket yang sesuai terlebih dahulu' }),
  tanggal: z.union([z.string().trim().min(1, { message: 'Tanggal aktivitas wajib diisi' }).max(50), z.date()]),
  catatan: z
    .string()
    .trim()
    .min(5, { message: 'Catatan terlalu pendek, minimal isi 5 karakter' })
    .max(2000, { message: 'Catatan maksimal 2000 karakter' })
    .refine((val) => !hasDangerousXssPattern(val), {
      message: 'Catatan mengandung karakter atau skrip yang tidak diperbolehkan',
    }),
  jenis_kegiatan: z.enum(
    [
      'visit',
      'kebutuhan',
      'opportunity',
      'follow_up',
      'quotation',
      'po',
      'revenue',
    ],
    {
      message:
        'Pilih salah satu jenis kegiatan yang sesuai (visit, kebutuhan, opportunity, follow_up, quotation, po, revenue)',
    },
  ),
  jadwal_follow_up: z.union([z.string().trim().max(50), z.date()]).nullable().optional(),
});

export const updateActivitySchema = createActivitySchema.partial();
