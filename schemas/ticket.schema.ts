import { z } from 'zod';

export const createTicketSchema = z.object({
  id_pelanggan: z.string().min(1, { message: 'Pelanggan wajib dipilih' }),
  id_user: z.string().min(1, { message: 'ID User tidak valid' }).optional(),
  id_tahap: z.string().min(1, { message: 'Tahap prospek wajib dipilih' }).optional(),
  id_kontak: z.string().nullable().optional(),
  judul: z.string().min(1, { message: 'Judul tiket wajib diisi' }),
  estimasi_nilai: z.coerce
    .number({ message: 'Estimasi nilai harus berupa angka' })
    .min(0, { message: 'Estimasi nilai minimal 0' }),
  estimasi_closing: z.union([
    z.string().min(1, { message: 'Estimasi closing wajib diisi' }),
    z.date(),
  ]),
  status: z
    .enum(['open', 'won', 'lost'], { message: 'Pilih status tiket yang valid' })
    .default('open'),
  kebutuhan_pelanggan: z.string().optional().default(''),
  prioritas: z
    .enum(['rendah', 'sedang', 'tinggi'], {
      message: 'Pilih prioritas tiket yang valid',
    })
    .default('sedang'),
  posisi: z.coerce
    .number({ message: 'Posisi harus berupa angka' })
    .int()
    .default(1),
  tanggal_penawaran_awal: z.union([z.string(), z.date()]).nullable().optional(),
  tanggal_closing: z.union([z.string(), z.date()]).nullable().optional(),
  alasan_lost: z.string().nullable().optional(),
});

export const updateTicketSchema = createTicketSchema.partial();

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;
export type UpdateTicketFormValues = z.infer<typeof updateTicketSchema>;
