import { z } from 'zod';

export const createTicketSchema = z.object({
    id_pelanggan: z.uuid({ message: 'ID Pelanggan tidak valid atau belum dipilih' }),
    id_user: z.uuid({ message: 'ID User tidak valid' }),
    id_tahap: z.uuid({ message: 'ID Tahap tidak valid atau belum dipilih' }),
    id_kontak: z.uuid({ message: 'ID Kontak tidak valid' }).nullable().optional(),
    judul: z.string().min(1, { message: 'Judul tiket wajib diisi' }),
    estimasi_nilai: z.coerce.number({ message: 'Estimasi nilai harus berupa angka' }),
    estimasi_closing: z.string().min(1, { message: 'Estimasi closing wajib diisi' }),
    status: z.enum(["open", "won", "lost"], { message: 'Pilih status tiket yang valid' }),
    kebutuhan_pelanggan: z.string().min(1, { message: 'Kebutuhan pelanggan wajib diisi' }),
    prioritas: z.enum(["rendah", "sedang", "tinggi"], { message: 'Pilih prioritas tiket yang valid' }),
    posisi: z.coerce.number({ message: 'Posisi harus berupa angka' }).int({ message: 'Posisi harus berupa bilangan bulat' }),
    tanggal_penawaran_awal: z.string().nullable().optional(),
    tanggal_closing: z.string().nullable().optional(),
    alasan_lost: z.string().nullable().optional(),
});

export const updateTicketSchema = createTicketSchema.partial();