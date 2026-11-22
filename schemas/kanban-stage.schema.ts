import { z } from 'zod';
import { hasDangerousXssPattern } from '@/lib/utils';

export const createKanbanStageSchema = z.object({
  nama_tahap: z
    .string()
    .trim()
    .min(1, { message: 'Nama tahap wajib diisi' })
    .max(100, { message: 'Nama tahap maksimal 100 karakter' })
    .refine((val) => !hasDangerousXssPattern(val), {
      message: 'Nama tahap mengandung karakter tidak valid',
    }),
  urutan: z.coerce
    .number({ message: 'Urutan harus berupa angka' })
    .int({ message: 'Urutan harus berupa bilangan bulat' })
    .min(1, { message: 'Urutan minimal 1' }),
  jenis_tahap: z.enum(
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
      message: 'Pilih jenis tahap yang valid',
    },
  ),
  is_tahap_akhir: z.boolean({ message: 'Status tahap akhir wajib diisi dengan format yang benar' }),
  is_aktif: z.boolean({ message: 'Status aktif wajib diisi dengan format yang benar' }),
  dotColor: z.string().trim().max(50, { message: 'Dot color maksimal 50 karakter' }).optional(),
});

export const updateKanbanStageSchema = createKanbanStageSchema.partial();
