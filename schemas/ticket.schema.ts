import { z } from 'zod';

export const createTicketSchema = z.object({
  id_pelanggan: z.string().uuid({ message: 'ID Pelanggan tidak valid atau belum dipilih' }),
  id_user: z.string().uuid({ message: 'ID User tidak valid' }),
  id_tahap: z.string().uuid({ message: 'ID Tahap tidak valid atau belum dipilih' }),
  id_kontak: z.string().uuid({ message: 'ID Kontak tidak valid' }).nullable().optional(),
  judul: z.string().min(1, { message: 'Judul tiket wajib diisi' }),
  estimasi_nilai: z.coerce.number({ message: 'Estimasi nilai harus berupa angka' }),
  estimasi_closing: z.union([z.string().min(1, { message: 'Estimasi closing wajib diisi' }), z.date()]),
  status: z.enum(['open', 'won', 'lost'], { message: 'Pilih status tiket yang valid' }),
  kebutuhan_pelanggan: z.string().min(1, { message: 'Kebutuhan pelanggan wajib diisi' }),
  prioritas: z.enum(['rendah', 'sedang', 'tinggi'], { message: 'Pilih prioritas tiket yang valid' }),
  posisi: z.coerce.number({ message: 'Posisi harus berupa angka' }).int({ message: 'Posisi harus berupa bilangan bulat' }),
  tanggal_penawaran_awal: z.union([z.string(), z.date()]).nullable().optional(),
  tanggal_closing: z.union([z.string(), z.date()]).nullable().optional(),
  alasan_lost: z.string().nullable().optional(),
});

export const updateTicketSchema = createTicketSchema.partial();
