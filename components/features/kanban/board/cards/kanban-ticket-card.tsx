import * as React from 'react';
import { Building2, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { TiketWithDetails } from '@/types/ticket.types';
import { PRIORITY_CONFIG } from '@/constants/kanban-constants';
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

  return (
    <Card
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-2xl border border-border/80 bg-white py-0 shadow-xs ring-0 transition-all hover:border-primary/40 hover:shadow-md',
        isSelected && 'border-primary ring-2 ring-primary/20 shadow-xl',
        className,
      )}
    >
      <CardContent className='flex flex-col gap-2.5 p-3.5'>
        {/* Top Row: Priority Pill & Ticket Code */}
        <div className='flex items-center justify-between gap-2'>
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
          <span className='text-[11px] font-normal text-muted-foreground'>
            {ticket.kode_tiket}
          </span>
        </div>

        {/* Title & Hospital */}
        <div className='flex flex-col gap-1'>
          <h4 className='line-clamp-1 text-sm font-bold text-foreground'>
            {ticket.judul}
          </h4>
          <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
            <Building2 className='size-3.5 shrink-0 text-muted-foreground' />
            <span className='truncate'>{ticket.nama_outlet}</span>
          </div>
        </div>

        <Separator className='bg-border/60' />

        {/* Bottom Row: Price, Date, Avatar */}
        <div className='flex items-center justify-between gap-2 pt-0.5'>
          <span className='text-sm font-bold text-accent'>
            {formatCompactRupiah(ticket.estimasi_nilai)}
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
