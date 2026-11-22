import * as React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TiketStatus } from '@/types/ticket.types';
import { cn } from '@/lib/utils';

interface TicketOutcomeBadgeProps {
  status?: TiketStatus | string | null;
  verbose?: boolean;
  className?: string;
}

export function TicketOutcomeBadge({
  status,
  verbose = false,
  className,
}: TicketOutcomeBadgeProps) {
  if (status !== 'won' && status !== 'lost') return null;

  const isWon = status === 'won';
  const Icon = isWon ? CheckCircle2 : XCircle;
  const label = isWon
    ? verbose
      ? 'Menang (WON)'
      : 'Won'
    : verbose
      ? 'Kalah (LOST)'
      : 'Lost';

  return (
    <Badge
      className={cn(
        'h-5 gap-1 rounded-full border px-2 text-[10px] font-bold tracking-wide uppercase',
        isWon
          ? 'border-emerald-500/30 bg-emerald-50 text-emerald-700'
          : 'border-rose-500/30 bg-rose-50 text-rose-600',
        className,
      )}
    >
      <Icon className='size-3 shrink-0' />
      <span>{label}</span>
    </Badge>
  );
}
