import { z } from 'zod';
import { hasDangerousXssPattern, sanitizeSafeUrl } from '@/lib/utils';

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
    .min(1, { message: 'Radius kunjungan harus lebih dari 0 meter' })
    .max(100000, { message: 'Radius kunjungan maksimal 100.000 meter' }),
);

const safeRequiredText = (label: string, max: number, min = 1) =>
  z
    .string()
    .trim()
    .min(min, {
      message: min === 1 ? `${label} wajib diisi` : `${label} minimal ${min} karakter`,
    })
    .max(max, { message: `${label} maksimal ${max} karakter` })
    .refine((val) => !hasDangerousXssPattern(val), {
      message: `${label} mengandung karakter atau skrip yang tidak diperbolehkan`,
    });

export const createCustomerSchema = z.object({
  nama_outlet: safeRequiredText('Nama outlet', 150),
  tipe_outlet: safeRequiredText('Tipe outlet', 50),
  alamat: safeRequiredText('Alamat', 1000, 5),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  radius_kunjungan: radiusKunjunganSchema,
  img_url: z
    .string()
    .trim()
    .min(1, { message: 'Foto outlet wajib diunggah' })
    .refine((val) => Boolean(sanitizeSafeUrl(val)), {
      message: 'URL foto outlet tidak valid',
    }),
  kontak: z
    .array(
      z.object({
        nama: safeRequiredText('Nama kontak', 150),
        jabatan: safeRequiredText('Jabatan kontak', 100),
        no_telp: z
          .string()
          .trim()
          .min(9, { message: 'Nomor telepon minimal 9 digit' })
          .max(20, { message: 'Nomor telepon maksimal 20 karakter' })
          .refine((val) => val.replace(/\D/g, '').length >= 9, {
            message: 'Nomor telepon minimal 9 digit angka',
          }),
        email: z
          .string()
          .trim()
          .min(1, { message: 'Email kontak wajib diisi' })
          .max(150, { message: 'Email kontak maksimal 150 karakter' })
          .email({ message: 'Format email kontak tidak valid' }),
      }),
    )
    .optional(),
});

export const updateCustomerSchema = z.object({
  nama_outlet: safeRequiredText('Nama outlet', 150),
  tipe_outlet: safeRequiredText('Tipe outlet', 50),
  alamat: safeRequiredText('Alamat', 1000, 5),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  radius_kunjungan: radiusKunjunganSchema,
  img_url: z
    .string()
    .trim()
    .refine((val) => val === '' || Boolean(sanitizeSafeUrl(val)), {
      message: 'URL foto outlet tidak valid',
    })
    .optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
