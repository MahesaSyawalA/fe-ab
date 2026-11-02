import { Building2, Calendar } from 'lucide-react';
import { SurfaceCard } from '@/components/ui/surface-card';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PRIORITY_CONFIG } from '@/constants/kanban-constants';
import { TiketWithDetails } from '@/types/ticket.types';
import { cn, formatFullRupiah } from '@/lib/utils';

interface ProspekSummaryCardProps {
  ticket: TiketWithDetails;
  stageLabel: string;
}

export function ProspekSummaryCard({
  ticket,
  stageLabel,
}: ProspekSummaryCardProps) {
  const priority = PRIORITY_CONFIG[ticket.prioritas];

  return (
    <SurfaceCard>
      <CardContent className='flex flex-col gap-3 p-4 lg:p-5'>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center justify-between gap-2'>
            <span className='text-[11px] font-mono font-medium text-muted-foreground'>
              {ticket.kode_tiket}
            </span>
          </div>

          <h2 className='text-base lg:text-lg font-bold text-foreground leading-snug pt-0.5'>
            {ticket.judul}
          </h2>
          <div className='flex items-center gap-1.5 text-xs text-secondary-foreground'>
            <Building2 className='size-3.5 shrink-0 text-secondary-foreground' />
            <span className='truncate'>{ticket.nama_faskes}</span>
          </div>
        </div>

        <Separator className='bg-border/60' />

        <div className='grid grid-cols-2 gap-3 rounded-xl bg-card p-3 border border-border'>
          <div className='flex flex-col gap-0.5'>
            <span className='text-[11px] text-secondary-foreground tracking-wider font-normal'>
              Estimasi Revenue
            </span>
            <span className='text-sm sm:text-base font-bold text-primary truncate'>
              {formatFullRupiah(ticket.estimasi_nilai)}
            </span>
          </div>

          <div className='flex flex-col gap-0.5'>
            <span className='text-[11px] text-secondary-foreground tracking-wider font-normal'>
              Estimasi Closing
            </span>
            <div className='flex items-center gap-1 text-xs font-semibold text-foreground pt-0.5'>
              <Calendar className='size-3.5 text-secondary-foreground shrink-0' />
              <span className='truncate'>
                {ticket.closing_full_label || '31 Okt 2026'}
              </span>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-1.5 pt-0.5'>
          <Badge className='h-5 rounded-md border-0 bg-violet-600 px-2 text-[10px] font-medium text-white'>
            {stageLabel}
          </Badge>
          <Badge
            className={cn(
              'h-5 gap-1.5 rounded-full px-2 text-[10px] font-semibold',
              priority.badgeClass,
            )}
          >
            <span className={cn('size-1.5 rounded-full', priority.dotClass)} />
            {priority.label}
          </Badge>
        </div>
      </CardContent>
    </SurfaceCard>
  );
}
