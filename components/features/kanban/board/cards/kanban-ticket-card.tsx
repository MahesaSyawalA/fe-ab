import * as React from 'react';
import { Building2, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PenawaranValidityBadge } from '@/components/ui/penawaran-badges';
import { TicketOutcomeBadge } from '@/components/ui/ticket-status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { TiketWithDetails } from '@/types/ticket.types';
import { PRIORITY_CONFIG } from '@/constants/kanban-constants';
import {
  getPenawaranValidity,
  isPenawaranActiveForValidity,
} from '@/lib/penawaran-utils';
import { cn, formatCompactRupiah } from '@/lib/utils';

interface KanbanTicketCardProps {
  ticket: TiketWithDetails;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function KanbanTicketCard({
  ticket,
  isSelected = false,
  onClick,
  className,
}: KanbanTicketCardProps) {
  const priorityConfig =
    PRIORITY_CONFIG[ticket.prioritas] ?? PRIORITY_CONFIG.rendah;

  const latestPenawaran = ticket.penawaran_list?.[0];
  const latestValidity =
    latestPenawaran && isPenawaranActiveForValidity(latestPenawaran.status)
      ? getPenawaranValidity(latestPenawaran.tanggal_penawaran)
      : null;
  const showValidityAlert =
    latestValidity && latestValidity.state !== 'valid';

  return (
    <Card
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-2xl border border-border/80 bg-white py-0 shadow-xs ring-0 transition-all hover:border-primary/40 hover:shadow-md',
        ticket.status === 'won' && 'border-emerald-200/90 hover:border-emerald-400',
        ticket.status === 'lost' && 'border-rose-200/90 hover:border-rose-400',
        isSelected && 'border-primary ring-2 ring-primary/20 shadow-xl',
        className,
      )}
    >
      <CardContent className='flex flex-col gap-2.5 p-3.5'>

        <div className='flex items-center justify-between gap-2'>
          <div className='flex flex-wrap items-center gap-1.5 min-w-0'>
            <Badge
              className={cn(
                'h-5 gap-1.5 rounded-full px-2.5 text-[11px] font-semibold',
                priorityConfig.badgeClass,
              )}
            >
              <span
                className={cn('size-1.5 rounded-full', priorityConfig.dotClass)}
              />
              {priorityConfig.label}
            </Badge>
            <TicketOutcomeBadge status={ticket.status} />
          </div>
          <span className='shrink-0 text-[11px] font-normal text-muted-foreground'>
            {ticket.kode_tiket}
          </span>
        </div>

        <div className='flex flex-col gap-1'>
          <h4 className='line-clamp-1 text-sm font-bold text-foreground'>
            {ticket.judul}
          </h4>
          <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
            <Building2 className='size-3.5 shrink-0 text-muted-foreground' />
            <span className='truncate'>{ticket.nama_outlet}</span>
          </div>
          {showValidityAlert && (
            <div className='pt-1'>
              <PenawaranValidityBadge validity={latestValidity} compact />
            </div>
          )}
        </div>

        <Separator className='bg-border/60' />

        <div className='flex items-center justify-between gap-2 pt-0.5'>
          <span
            title={ticket.nilai_revenue != null ? 'Revenue' : 'Estimasi'}
            className={cn(
              'text-sm font-bold',
              ticket.nilai_revenue != null ? 'text-emerald-700 dark:text-emerald-400' : 'text-accent',
            )}
          >
            {formatCompactRupiah(ticket.nilai_revenue ?? ticket.estimasi_nilai)}
          </span>

          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              <Calendar className='size-3.5 shrink-0 text-muted-foreground' />
              <span>{ticket.closing_short_label || '12 Nov'}</span>
            </div>
            <Avatar className='size-6 rounded-full after:hidden'>
              <AvatarFallback className='rounded-full bg-primary/10 text-[10px] font-bold text-primary'>
                {ticket.inisial_sales || 'MT'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
