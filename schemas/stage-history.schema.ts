import { z } from 'zod';

export const createStageHistorySchema = z.object({
    id_tiket: z.uuid({ message: 'ID Tiket tidak valid atau belum dipilih' }),
    id_tahap_asal: z.uuid({ message: 'ID Tahap asal tidak valid' }).nullable().optional(),
    id_tahap_tujuan: z.uuid({ message: 'ID Tahap tujuan tidak valid atau belum dipilih' }),
    id_user: z.uuid({ message: 'ID User tidak valid' }),
    waktu_pindah: z.string().optional(),
});

export const updateStageHistorySchema = createStageHistorySchema.partial();