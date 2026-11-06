import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export { cn } from "cn"

/** Contoh: `10 Sep 2026`. */
export function formatShortDate(date: Date | string): string {
  return format(new Date(date), 'd MMM yyyy', { locale: id });
}

export function formatCompactRupiah(amount: number): string {
  if (amount >= 1_000_000_000) {
    const val = (amount / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
    return `Rp${val} M`;
  }
  if (amount >= 1_000_000) {
    const val = (amount / 1_000_000).toFixed(0);
    return `Rp${val}jt`;
  }
  return `Rp${amount.toLocaleString('id-ID')}`;
}

export function formatFullRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function formatNumberInput(amount: number | string): string {
  const num = typeof amount === 'string' ? Number(amount.replace(/\D/g, '')) : amount;
  if (!num || isNaN(num)) return '';
  return num.toLocaleString('id-ID');
}
