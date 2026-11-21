import * as React from 'react';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  PENAWARAN_STATUS_CONFIG,
  getPenawaranValidity,
  type PenawaranValidityInfo,
} from '@/lib/penawaran-utils';
import type { StatusPenawaran } from '@/types/offer.types';

interface PenawaranStatusBadgeProps {
  status: StatusPenawaran;
  className?: string;
}

export function PenawaranStatusBadge({
  status,
  className,
}: PenawaranStatusBadgeProps) {
  const cfg = PENAWARAN_STATUS_CONFIG[status] ?? PENAWARAN_STATUS_CONFIG.draft;
  return (
    <Badge
      variant='outline'
      className={cn(
        'h-5 gap-1.5 rounded-full border px-2.5 text-[10px] font-semibold',
        cfg.badgeClass,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', cfg.dotClass)} />
      {cfg.label}
    </Badge>
  );
}

interface PenawaranValidityBadgeProps {
  tanggalPenawaran?: Date | string | null;
  validity?: PenawaranValidityInfo | null;
  compact?: boolean;
  showDetail?: boolean;
  className?: string;
}

export function PenawaranValidityBadge({
  tanggalPenawaran,
  validity: providedValidity,
  compact = false,
  showDetail = false,
  className,
}: PenawaranValidityBadgeProps) {
  const info = providedValidity ?? getPenawaranValidity(tanggalPenawaran);
  if (!info) return null;

  const Icon =
    info.state === 'expired'
      ? AlertTriangle
      : info.state === 'near_expiry' || info.state === 'last_day'
        ? Clock
        : CheckCircle2;

  return (
    <Badge
      variant='outline'
      className={cn(
        'h-5 gap-1 rounded-full border px-2 text-[10px] font-semibold',
        info.badgeClass,
        className,
      )}
      title={`${info.label} — ${info.detailLabel}`}
    >
      <Icon className='size-3 shrink-0' />
      <span>{compact ? info.shortLabel : info.label}</span>
      {showDetail && (
        <span className='font-normal opacity-80'>· {info.detailLabel}</span>
      )}
    </Badge>
  );
}
