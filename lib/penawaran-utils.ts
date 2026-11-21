import type { StatusPenawaran } from '@/types/offer.types';

/** Masa berlaku standar surat penawaran: 30 hari (1 bulan) inklusif hari ke-30. */
export const PENAWARAN_VALIDITY_DAYS = 30;

/** Ambang peringatan mendekati batas masa berlaku: sisa 1 s.d. 7 hari (umur 23–29 hari). */
export const PENAWARAN_NEAR_EXPIRY_THRESHOLD_DAYS = 7;

export type PenawaranValidityState = 'valid' | 'near_expiry' | 'last_day' | 'expired';

export interface PenawaranValidityInfo {
  state: PenawaranValidityState;
  label: string;
  shortLabel: string;
  detailLabel: string;
  ageDays: number;
  remainingDays: number;
  expiryDate: Date;
  badgeClass: string;
}

export interface PenawaranStatusConfigItem {
  value: StatusPenawaran;
  label: string;
  badgeClass: string;
  dotClass: string;
}

export const PENAWARAN_STATUS_CONFIG: Record<StatusPenawaran, PenawaranStatusConfigItem> = {
  draft: {
    value: 'draft',
    label: 'Draft',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-500',
  },
  dikirim: {
    value: 'dikirim',
    label: 'Dikirim',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    dotClass: 'bg-sky-500',
  },
  disetujui: {
    value: 'disetujui',
    label: 'Disetujui',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  ditolak: {
    value: 'ditolak',
    label: 'Ditolak',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-500',
  },
};

export const PENAWARAN_STATUS_OPTIONS: PenawaranStatusConfigItem[] = [
  PENAWARAN_STATUS_CONFIG.draft,
  PENAWARAN_STATUS_CONFIG.dikirim,
  PENAWARAN_STATUS_CONFIG.disetujui,
  PENAWARAN_STATUS_CONFIG.ditolak,
];

const MS_PER_DAY = 86_400_000;

function toLocalStartOfDay(input: Date | string): Date | null {
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) return null;
    return new Date(input.getFullYear(), input.getMonth(), input.getDate());
  }
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
  if (dateOnlyMatch) {
    const [, y, m, d] = dateOnlyMatch;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

/**
 * Menghitung status masa berlaku penawaran berdasarkan tanggal penawaran:
 * - Umur > 30 hari (mis. hari ini - 31 hari)        -> Kedaluwarsa
 * - Umur = 30 hari (tepat 1 bulan / batas hari ini) -> Masih berlaku (batas hari ini)
 * - Umur 23–29 hari (mis. hari ini - 29 hari)       -> Mendekati batas masa berlaku
 * - Umur < 23 hari                                  -> Masih berlaku
 */
export function getPenawaranValidity(
  tanggalPenawaran: Date | string | null | undefined,
  now: Date = new Date(),
): PenawaranValidityInfo | null {
  if (!tanggalPenawaran) return null;

  const offerDay = toLocalStartOfDay(tanggalPenawaran);
  const today = toLocalStartOfDay(now);
  if (!offerDay || !today) return null;

  const ageDays = Math.round((today.getTime() - offerDay.getTime()) / MS_PER_DAY);
  const remainingDays = PENAWARAN_VALIDITY_DAYS - ageDays;
  const expiryDate = new Date(
    offerDay.getFullYear(),
    offerDay.getMonth(),
    offerDay.getDate() + PENAWARAN_VALIDITY_DAYS,
  );

  if (ageDays > PENAWARAN_VALIDITY_DAYS) {
    const overdueDays = ageDays - PENAWARAN_VALIDITY_DAYS;
    return {
      state: 'expired',
      label: 'Kedaluwarsa',
      shortLabel: 'Kedaluwarsa',
      detailLabel: `Lewat ${overdueDays} hari`,
      ageDays,
      remainingDays,
      expiryDate,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    };
  }

  if (ageDays === PENAWARAN_VALIDITY_DAYS) {
    return {
      state: 'last_day',
      label: 'Masih berlaku (batas hari ini)',
      shortLabel: 'Batas hari ini',
      detailLabel: 'Berakhir hari ini',
      ageDays,
      remainingDays: 0,
      expiryDate,
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    };
  }

  if (remainingDays <= PENAWARAN_NEAR_EXPIRY_THRESHOLD_DAYS) {
    return {
      state: 'near_expiry',
      label: 'Mendekati batas masa berlaku',
      shortLabel: 'Mendekati kedaluwarsa',
      detailLabel: `Sisa ${remainingDays} hari`,
      ageDays,
      remainingDays,
      expiryDate,
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    };
  }

  return {
    state: 'valid',
    label: 'Masih berlaku',
    shortLabel: 'Masih berlaku',
    detailLabel: `Sisa ${remainingDays} hari`,
    ageDays,
    remainingDays,
    expiryDate,
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
}

export function isPenawaranActiveForValidity(status: StatusPenawaran): boolean {
  return status === 'draft' || status === 'dikirim';
}
