import { z } from 'zod';
import { hasDangerousXssPattern } from '@/lib/utils';

export const createTicketSchema = z.object({
  id_pelanggan: z.string().trim().min(1, { message: 'Pelanggan wajib dipilih' }),
  id_user: z.string().trim().min(1, { message: 'ID User tidak valid' }).optional(),
  id_tahap: z.string().trim().min(1, { message: 'Tahap prospek wajib dipilih' }).optional(),
  id_kontak: z.string().trim().nullable().optional(),
  judul: z
    .string()
    .trim()
    .min(1, { message: 'Judul tiket wajib diisi' })
    .max(200, { message: 'Judul tiket maksimal 200 karakter' })
    .refine((val) => !hasDangerousXssPattern(val), {
      message: 'Judul tiket mengandung karakter atau skrip yang tidak diperbolehkan',
    }),
  estimasi_nilai: z.coerce
    .number({ message: 'Estimasi nilai harus berupa angka' })
    .min(0, { message: 'Estimasi nilai minimal 0' }),
  estimasi_closing: z.union([
    z.string().trim().min(1, { message: 'Estimasi closing wajib diisi' }).max(50),
    z.date(),
  ]),
  status: z
    .enum(['open', 'won', 'lost'], { message: 'Pilih status tiket yang valid' })
    .default('open'),
  kebutuhan_pelanggan: z
    .string()
    .trim()
    .max(2000, { message: 'Kebutuhan pelanggan maksimal 2000 karakter' })
    .refine((val) => !hasDangerousXssPattern(val), {
      message: 'Kebutuhan pelanggan mengandung karakter tidak valid',
    })
    .optional()
    .default(''),
  prioritas: z
    .enum(['rendah', 'sedang', 'tinggi'], {
      message: 'Pilih prioritas tiket yang valid',
    })
    .default('sedang'),
  posisi: z.coerce
    .number({ message: 'Posisi harus berupa angka' })
    .int()
    .min(0)
    .default(1),
  tanggal_penawaran_awal: z.union([z.string().trim().max(50), z.date()]).nullable().optional(),
  tanggal_closing: z.union([z.string().trim().max(50), z.date()]).nullable().optional(),
  alasan_lost: z
    .string()
    .trim()
    .max(1000, { message: 'Alasan lost maksimal 1000 karakter' })
    .refine((val) => !hasDangerousXssPattern(val), {
      message: 'Alasan lost mengandung karakter tidak valid',
    })
    .nullable()
    .optional(),
});

export const updateTicketSchema = createTicketSchema.partial();

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;
export type UpdateTicketFormValues = z.infer<typeof updateTicketSchema>;
