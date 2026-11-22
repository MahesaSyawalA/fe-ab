import { z } from 'zod';
import { sanitizeSafeUrl } from '@/lib/utils';

export const createVisitProofSchema = z.object({
  id_aktivitas: z.string().uuid({ message: 'ID Aktivitas tidak valid atau belum dipilih' }),
  longitude: z.coerce
    .number({ message: 'Longitude harus berupa angka' })
    .min(-180, { message: 'Longitude minimal -180' })
    .max(180, { message: 'Longitude maksimal 180' }),
  latitude: z.coerce
    .number({ message: 'Latitude harus berupa angka' })
    .min(-90, { message: 'Latitude minimal -90' })
    .max(90, { message: 'Latitude maksimal 90' }),
  jarak_klien: z.coerce
    .number({ message: 'Jarak harus berupa angka' })
    .min(0, { message: 'Jarak tidak boleh negatif' }),
  dalam_radius: z.boolean({ message: 'Status radius wajib diisi dengan format yang benar' }),
  img_url: z
    .string()
    .trim()
    .min(1, { message: 'Bukti foto kunjungan wajib diupload' })
    .max(500, { message: 'URL foto maksimal 500 karakter' })
    .refine((val) => Boolean(sanitizeSafeUrl(val)), {
      message: 'URL foto kunjungan tidak valid',
    }),
  file_url: z
    .string()
    .trim()
    .max(500, { message: 'URL file maksimal 500 karakter' })
    .refine((val) => val === '' || Boolean(sanitizeSafeUrl(val)), {
      message: 'URL file lampiran tidak valid',
    })
    .nullable()
    .optional(),
});

export const updateVisitProofSchema = createVisitProofSchema.partial();
