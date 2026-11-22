import { z } from 'zod';
import { hasDangerousXssPattern, sanitizeSafeUrl } from '@/lib/utils';

export const createOfferSchema = z.object({
  id_tiket: z.uuid({ message: 'ID Tiket tidak valid atau belum dipilih' }),
  id_aktivitas: z.uuid({ message: 'ID Aktivitas tidak valid' }).nullable().optional(),
  no_penawaran: z
    .string()
    .trim()
    .min(1, { message: 'Nomor penawaran wajib diisi' })
    .max(100, { message: 'Nomor penawaran maksimal 100 karakter' })
    .refine((val) => !hasDangerousXssPattern(val), {
      message: 'Nomor penawaran mengandung karakter tidak valid',
    }),
  revisi_ke: z.coerce
    .number({ message: 'Revisi harus berupa angka' })
    .int({ message: 'Revisi harus berupa bilangan bulat' })
    .min(0, { message: 'Revisi minimal 0' }),
  tanggal_penawaran: z.string().trim().min(1, { message: 'Tanggal penawaran wajib diisi' }).max(50),
  total_nilai: z.coerce
    .number({ message: 'Total nilai harus berupa angka' })
    .min(0, { message: 'Total nilai minimal 0' }),
  status: z.enum(['draft', 'dikirim', 'disetujui', 'ditolak'], {
    message: 'Pilih status penawaran yang valid',
  }),
  url_file_penawaran: z
    .string()
    .trim()
    .min(1, { message: 'File penawaran wajib diupload' })
    .max(500, { message: 'URL file penawaran maksimal 500 karakter' })
    .refine((val) => Boolean(sanitizeSafeUrl(val, { allowBlob: false, allowRelative: false })), {
      message: 'URL file penawaran harus berupa URL http/https yang valid',
    }),
});

export const updateOfferSchema = createOfferSchema.partial();
