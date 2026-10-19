import { z } from 'zod';

export const createOfferSchema = z.object({
    id_tiket: z.uuid({ message: 'ID Tiket tidak valid atau belum dipilih' }),
    id_aktivitas: z.uuid({ message: 'ID Aktivitas tidak valid' }).nullable().optional(),
    no_penawaran: z.string().min(1, { message: 'Nomor penawaran wajib diisi' }),
    revisi_ke: z.coerce.number({ message: 'Revisi harus berupa angka' }).int({ message: 'Revisi harus berupa bilangan bulat' }),
    tanggal_penawaran: z.string().min(1, { message: 'Tanggal penawaran wajib diisi' }),
    total_nilai: z.coerce.number({ message: 'Total nilai harus berupa angka' }),
    status: z.enum(['draft', 'dikirim', 'disetujui', 'ditolak'], {
        message: 'Pilih status penawaran yang valid'
    }),
    url_file_penawaran: z.string().min(1, { message: 'File penawaran wajib diupload' }),
});

export const updateOfferSchema = createOfferSchema.partial();