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

const DANGEROUS_HTML_REGEX =
  /<\s*\/?\s*(script|iframe|object|embed|svg|style|link|meta|form|base|applet|body|html)\b|on[a-z]+\s*=|javascript\s*:|vbscript\s*:|data\s*:\s*text\/html/i;

export function hasDangerousXssPattern(value: string): boolean {
  return DANGEROUS_HTML_REGEX.test(value);
}

const SAFE_DATA_IMAGE_REGEX =
  /^data:image\/(png|jpe?g|webp|gif|heic|heif);base64,[A-Za-z0-9+/=\s]+$/i;

export function sanitizeSafeUrl(
  url?: string | null,
  options: { allowBlob?: boolean; allowRelative?: boolean; allowDataImage?: boolean } = {
    allowBlob: true,
    allowRelative: true,
    allowDataImage: false,
  },
): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (options.allowRelative && trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }
  if (options.allowDataImage && SAFE_DATA_IMAGE_REGEX.test(trimmed)) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return trimmed;
    }
    if (options.allowBlob && parsed.protocol === 'blob:') {
      return trimmed;
    }
    return '';
  } catch {
    return '';
  }
}

export function sanitizePhoneHref(phone?: string | null): string {
  if (!phone) return '';
  const cleaned = phone.replace(/[^0-9+]/g, '');
  return cleaned ? `tel:${cleaned}` : '';
}

export function sanitizeMailtoHref(email?: string | null): string {
  if (!email) return '';
  const cleaned = email.trim().replace(/[\r\n<>"]/g, '');
  return cleaned ? `mailto:${cleaned}` : '';
}

export function getJwtExpiryMs(token?: string | null): number | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decoded = atob(padded);
    const payload = JSON.parse(decoded) as { exp?: unknown };
    return typeof payload.exp === 'number' && Number.isFinite(payload.exp)
      ? payload.exp * 1000
      : null;
  } catch {
    return null;
  }
}
