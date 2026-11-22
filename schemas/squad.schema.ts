import { z } from 'zod';
import { hasDangerousXssPattern } from '@/lib/utils';

const safeText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, { message: `${label} wajib diisi` })
    .max(max, { message: `${label} maksimal ${max} karakter` })
    .refine((val) => !hasDangerousXssPattern(val), {
      message: `${label} mengandung karakter tidak valid`,
    });

export const createSquadSchema = z.object({
  id_supervisor: z.uuid({ message: 'ID Supervisor tidak valid' }).nullable().optional(),
  nama_squad: safeText('Nama squad', 100),
  kode_squad: safeText('Kode squad', 50),
  wilayah: safeText('Wilayah', 100),
  is_active: z.boolean({ message: 'Status aktif wajib diisi dengan format yang benar' }),
  member_ids: z.array(z.uuid({ message: 'ID anggota tidak valid' })).optional(),
});

export const updateSquadSchema = createSquadSchema.partial();

/** Skema form UI: supervisor wajib dipilih dan `member_ids` selalu ada. */
export const squadFormSchema = createSquadSchema.extend({
  id_supervisor: z.uuid({ message: 'Supervisor wajib dipilih' }),
  member_ids: z.array(z.uuid()),
});

export type SquadFormValues = z.infer<typeof squadFormSchema>;
