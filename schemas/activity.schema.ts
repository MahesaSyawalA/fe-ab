import { z } from 'zod';

export const createActivitySchema = z.object({
  id_user: z.string().uuid({ message: 'ID User tidak valid atau belum ditemukan' }),
  id_tiket: z.string().uuid({ message: 'Pilih tiket yang sesuai terlebih dahulu' }),
  tanggal: z.union([z.string().min(1, { message: 'Tanggal aktivitas wajib diisi' }), z.date()]),
  catatan: z.string().min(5, { message: 'Catatan terlalu pendek, minimal isi 5 karakter' }),
  jenis_kegiatan: z.enum([
    'visit',
    'kebutuhan',
    'opportunity',
    'follow_up',
    'quotation',
    'po',
    'revenue',
  ], {
    message: 'Pilih salah satu jenis kegiatan yang sesuai (visit, kebutuhan, opportunity, follow_up, quotation, po, revenue)',
  }),
  jadwal_follow_up: z.union([z.string(), z.date()]).nullable().optional(),
});

export const updateActivitySchema = createActivitySchema.partial();
