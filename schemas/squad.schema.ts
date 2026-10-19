import { z } from 'zod';

export const createSquadSchema = z.object({
    id_supervisor: z.uuid({ message: 'ID Supervisor tidak valid' }).nullable().optional(),
    nama_squad: z.string().min(1, { message: 'Nama squad wajib diisi' }),
    kode_squad: z.string().min(1, { message: 'Kode squad wajib diisi' }),
    wilayah: z.string().min(1, { message: 'Wilayah wajib diisi' }),
    is_active: z.boolean({ message: 'Status aktif wajib diisi dengan format yang benar' }),
});

export const updateSquadSchema = createSquadSchema.partial();