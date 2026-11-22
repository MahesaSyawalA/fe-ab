import { z } from 'zod';
import { hasDangerousXssPattern, sanitizeSafeUrl } from '@/lib/utils';

export const createPurchaseOrderSchema = z.object({
  id_penawaran: z.uuid({ message: 'ID Penawaran tidak valid' }).nullable().optional(),
  id_tiket: z.uuid({ message: 'ID Tiket tidak valid atau belum dipilih' }),
  no_po: z
    .string()
    .trim()
    .min(1, { message: 'Nomor PO wajib diisi' })
    .max(100, { message: 'Nomor PO maksimal 100 karakter' })
    .refine((val) => !hasDangerousXssPattern(val), {
      message: 'Nomor PO mengandung karakter tidak valid',
    }),
  tanggal_po: z.string().trim().min(1, { message: 'Tanggal PO wajib diisi' }).max(50),
  nilai_po: z.coerce
    .number({ message: 'Nilai PO harus berupa angka' })
    .min(0, { message: 'Nilai PO minimal 0' }),
  status: z.enum(['diterima', 'diproses', 'selesai', 'dibatalkan'], {
    message: 'Pilih status PO yang valid',
  }),
  url_file_po: z
    .string()
    .trim()
    .min(1, { message: 'File PO wajib diupload' })
    .max(500, { message: 'URL file PO maksimal 500 karakter' })
    .refine((val) => Boolean(sanitizeSafeUrl(val, { allowBlob: false, allowRelative: false })), {
      message: 'URL file PO harus berupa URL http/https yang valid',
    }),
  nilai_revenue: z.coerce
    .number({ message: 'Nilai revenue harus berupa angka' })
    .min(0, { message: 'Nilai revenue minimal 0' }),
  tanggal_revenue: z.string().trim().max(50).nullable().optional(),
});

export const updatePurchaseOrderSchema = createPurchaseOrderSchema.partial();
