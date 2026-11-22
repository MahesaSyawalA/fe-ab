import * as React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TiketStatus } from '@/types/ticket.types';
import { cn } from '@/lib/utils';

interface TicketOutcomeBadgeProps {
  status?: TiketStatus | string | null;
  className?: string;
}

export function TicketOutcomeBadge({
  status,
  className,
}: TicketOutcomeBadgeProps) {
  if (status !== 'won' && status !== 'lost') return null;

  const isWon = status === 'won';
  const Icon = isWon ? CheckCircle2 : XCircle;
  const label = isWon ? 'Won' : 'Lost';

  return (
    <Badge
      className={cn(
        'h-5 gap-1 rounded-full border-0 px-2 text-[10px] font-bold tracking-wide uppercase text-card',
        isWon ? 'bg-success' : 'bg-destructive',
        className,
      )}
    >
      <Icon className='size-3 shrink-0' />
      <span>{label}</span>
    </Badge>
  );
}
