import { z } from 'zod';

function parseStrictNumber(val: unknown): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed === '') return NaN;
    return Number(trimmed);
  }
  return NaN;
}

const latitudeSchema = z.preprocess(
  parseStrictNumber,
  z
    .number({ message: 'Latitude harus berupa angka' })
    .refine((val) => Number.isFinite(val), { message: 'Latitude harus berupa angka' })
    .min(-90, { message: 'Latitude minimal -90' })
    .max(90, { message: 'Latitude maksimal 90' }),
);

const longitudeSchema = z.preprocess(
  parseStrictNumber,
  z
    .number({ message: 'Longitude harus berupa angka' })
    .refine((val) => Number.isFinite(val), { message: 'Longitude harus berupa angka' })
    .min(-180, { message: 'Longitude minimal -180' })
    .max(180, { message: 'Longitude maksimal 180' }),
);

const radiusKunjunganSchema = z.preprocess(
  parseStrictNumber,
  z
    .number({ message: 'Radius kunjungan harus berupa angka' })
    .refine((val) => Number.isFinite(val), { message: 'Radius kunjungan harus berupa angka' })
    .min(1, { message: 'Radius kunjungan harus lebih dari 0 meter' }),
);

export const createCustomerSchema = z.object({
  nama_outlet: z.string().min(1, { message: 'Nama outlet wajib diisi' }),
  tipe_outlet: z.string().min(1, { message: 'Tipe outlet wajib diisi/dipilih' }),
  alamat: z.string().min(5, { message: 'Alamat terlalu pendek, minimal 5 karakter' }),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  radius_kunjungan: radiusKunjunganSchema,
  img_url: z.string().min(1, { message: 'Foto outlet wajib diunggah' }),
  kontak: z.array(z.object({
    nama: z.string().min(1, { message: 'Nama kontak wajib diisi' }),
    jabatan: z.string().min(1, { message: 'Jabatan kontak wajib diisi' }),
    no_telp: z.string().min(9, { message: 'Nomor telepon minimal 9 digit' }),
    email: z.string().min(1, { message: 'Email kontak wajib diisi' }).email({ message: 'Format email kontak tidak valid' }),
  })).optional(),
});

export const updateCustomerSchema = z.object({
  nama_outlet: z.string().min(1, { message: 'Nama outlet wajib diisi' }),
  tipe_outlet: z.string().min(1, { message: 'Tipe outlet wajib diisi/dipilih' }),
  alamat: z.string().min(5, { message: 'Alamat terlalu pendek, minimal 5 karakter' }),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  radius_kunjungan: radiusKunjunganSchema,
  img_url: z.string().optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
