import { z } from 'zod';

export const createVisitProofSchema = z.object({
  id_aktivitas: z.string().uuid({ message: 'ID Aktivitas tidak valid atau belum dipilih' }),
  longitude: z.coerce.number({ message: 'Longitude harus berupa angka' }),
  latitude: z.coerce.number({ message: 'Latitude harus berupa angka' }),
  jarak_klien: z.coerce.number({ message: 'Jarak harus berupa angka' }),
  dalam_radius: z.boolean({ message: 'Status radius wajib diisi dengan format yang benar' }),
  img_url: z.string().min(1, { message: 'Bukti foto kunjungan wajib diupload' }),
  file_url: z.string().nullable().optional(),
});

export const updateVisitProofSchema = createVisitProofSchema.partial();
