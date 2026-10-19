import { z } from 'zod';

export const createKanbanStageSchema = z.object({
    nama_tahap: z.string().min(1, { message: 'Nama tahap wajib diisi' }),
    urutan: z.coerce.number({ message: 'Urutan harus berupa angka' }).int({ message: 'Urutan harus berupa bilangan bulat' }),
    jenis_tahap: z.enum([
        'visit',
        'kebutuhan',
        'opportunity',
        'follow_up',
        'quotation',
        'po',
        'revenue',
    ], {
        message: 'Pilih jenis tahap yang valid'
    }),
    is_tahap_akhir: z.boolean({ message: 'Status tahap akhir wajib diisi dengan format yang benar' }),
    is_aktif: z.boolean({ message: 'Status aktif wajib diisi dengan format yang benar' }),
});

export const updateKanbanStageSchema = createKanbanStageSchema.partial();