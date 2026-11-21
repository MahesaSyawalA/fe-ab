import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export { cn } from "cn"

export function guardPopupDismiss(onOpenChange: (open: boolean) => void) {
  return (nextOpen: boolean) => {
    if (!nextOpen && document.querySelector('[aria-haspopup][aria-expanded="true"]')) return;
    onOpenChange(nextOpen);
  };
}

export function toFiniteNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return 0;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function formatShortDate(date: Date | string): string {
  return format(new Date(date), 'd MMM yyyy', { locale: id });
}

export function formatCompactRupiah(amount: number | string | null | undefined): string {
  const safeAmount = toFiniteNumber(amount);
  if (safeAmount >= 1_000_000_000) {
    const val = (safeAmount / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
    return `Rp${val} M`;
  }
  if (safeAmount >= 1_000_000) {
    const val = (safeAmount / 1_000_000).toFixed(0);
    return `Rp${val}jt`;
  }
  return `Rp${safeAmount.toLocaleString('id-ID')}`;
}

export function formatFullRupiah(amount: number | string | null | undefined): string {
  const safeAmount = toFiniteNumber(amount);
  return `Rp ${safeAmount.toLocaleString('id-ID')}`;
}

export function formatNumberInput(amount: number | string): string {
  const num = typeof amount === 'string' ? Number(amount.replace(/\D/g, '')) : amount;
  if (!num || isNaN(num)) return '';
  return num.toLocaleString('id-ID');
}
