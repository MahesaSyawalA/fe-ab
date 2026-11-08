import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  format,
  isValid,
} from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format waktu relatif dalam bahasa Indonesia berbasis date-fns:
 * - < 1 menit: "Baru saja"
 * - < 60 menit: "X menit lalu"
 * - < 24 jam: "X jam lalu"
 * - 1 - 7 hari: "X hari lalu"
 * - > 7 hari: Format tanggal lokal Indonesia ringkas (misal: "18 Nov 2026")
 */
export function formatRelativeTime(
  date: string | Date | null | undefined,
): string {
  if (!date) return '-';

  const targetDate = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(targetDate)) return '-';

  const now = new Date();
  const diffInMs = now.getTime() - targetDate.getTime();

  // Waktu di masa depan atau kurang dari 60 detik yang lalu
  if (diffInMs < 60 * 1000) {
    return 'Baru saja';
  }

  const diffInMinutes = differenceInMinutes(now, targetDate);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit lalu`;
  }

  const diffInHours = differenceInHours(now, targetDate);
  if (diffInHours < 24) {
    return `${diffInHours} jam lalu`;
  }

  const diffInDays = differenceInDays(now, targetDate);
  if (diffInDays <= 7) {
    return `${diffInDays} hari lalu`;
  }

  return format(targetDate, 'd MMM yyyy', { locale: id });
}

