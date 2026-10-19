import { z } from 'zod';

export const createActivitySchema = z.object({
    id_user: z.uuid({ message: 'ID User tidak valid atau belum ditemukan' }),
    id_tiket: z.uuid({ message: 'Pilih tiket yang sesuai terlebih dahulu' }),
    tanggal: z.string().min(1, { message: 'Tanggal aktivitas wajib diisi bro' }),
    catatan: z.string().min(5, { message: 'Catatan terlalu pendek, minimal isi 5 karakter' }),
    jenis_kegiatan: z.enum([
        'kunjungan',
        'follow_up',
        'penawaran',
        'closing'
    ], {
        message: 'Pilih salah satu jenis kegiatan yang tersedia'
    }),
    jadwal_follow_up: z.string().nullable().optional(),
});

export const updateActivitySchema = createActivitySchema.partial();