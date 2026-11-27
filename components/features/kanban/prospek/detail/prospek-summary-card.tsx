import { Building2, Calendar } from 'lucide-react';
import { SurfaceCard } from '@/components/ui/surface-card';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  PenawaranStatusBadge,
  PenawaranValidityBadge,
} from '@/components/ui/penawaran-badges';
import { TicketOutcomeBadge } from '@/components/ui/ticket-status-badge';
import { Separator } from '@/components/ui/separator';
import { parseLostReason } from '@/components/features/kanban/shared/lost-reason-fields';
import { PRIORITY_CONFIG, AKTIVITAS_STAGE_CONFIG } from '@/constants/kanban-constants';
import {
  getPenawaranValidity,
  isPenawaranActiveForValidity,
} from '@/lib/penawaran-utils';
import { TiketWithDetails } from '@/types/ticket.types';
import { cn, formatFullRupiah, formatShortDate } from '@/lib/utils';

interface ProspekSummaryCardProps {
  ticket: TiketWithDetails;
  stageLabel: string;
}

export function ProspekSummaryCard({
  ticket,
  stageLabel,
}: ProspekSummaryCardProps) {
  const priority = PRIORITY_CONFIG[ticket.prioritas];
  const stageConfig =
    AKTIVITAS_STAGE_CONFIG[ticket.id_tahap] ||
    AKTIVITAS_STAGE_CONFIG[stageLabel.toLowerCase()] || {
      badgeClass: 'bg-kanban-purple/10 text-kanban-purple border-kanban-purple/20',
      solidClass: 'bg-kanban-purple text-white',
      dotColor: '#7C5CFC',
    };

  const latestPenawaran = ticket.penawaran_list?.[0];
  const latestValidity =
    latestPenawaran && isPenawaranActiveForValidity(latestPenawaran.status)
      ? getPenawaranValidity(latestPenawaran.tanggal_penawaran)
      : null;

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
            <span className='truncate'>{ticket.nama_outlet}</span>
          </div>
        </div>

        <Separator className='bg-border/60' />

        <div className='grid grid-cols-2 gap-3 rounded-xl bg-card p-3 border border-border'>
          <div className='flex flex-col gap-0.5'>
            <span className='text-[11px] text-secondary-foreground tracking-wider font-normal'>
              {ticket.nilai_revenue != null ? 'Revenue' : 'Estimasi Revenue'}
            </span>
            <span
              className={cn(
                'text-sm sm:text-base font-bold truncate',
                ticket.nilai_revenue != null ? 'text-emerald-700 dark:text-emerald-400' : 'text-accent',
              )}
            >
              {formatFullRupiah(ticket.nilai_revenue ?? ticket.estimasi_nilai)}
            </span>
          </div>

          <div className='flex flex-col gap-0.5'>
            <span className='text-[11px] text-secondary-foreground tracking-wider font-normal'>
              Estimasi Closing
            </span>
            <div className='flex items-center gap-1 text-xs font-semibold text-foreground pt-0.5'>
              <Calendar className='size-3.5 text-secondary-foreground shrink-0' />
              <span className='truncate'>
                {ticket.closing_full_label ||
                  (ticket.estimasi_closing
                    ? formatShortDate(ticket.estimasi_closing)
                    : '-')}
              </span>
            </div>
          </div>

          {ticket.durasi_siklus_hari != null && (
            <div className='col-span-2 flex flex-col gap-0.5'>
              <span className='text-[11px] text-secondary-foreground tracking-wider font-normal'>
                Durasi Siklus (Penawaran sampai Closing)
              </span>
              <span className='text-xs font-semibold text-foreground'>
                {ticket.durasi_siklus_hari.toLocaleString('id-ID')} hari
              </span>
            </div>
          )}
        </div>

        <div className='flex flex-wrap items-center gap-1.5 pt-0.5'>
          <Badge
            className={cn(
              'h-5 rounded-full border-0 px-2.5 text-[10px] font-medium text-white',
              stageConfig.solidClass || 'bg-kanban-purple text-white',
            )}
          >
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
          <TicketOutcomeBadge status={ticket.status} />
          {latestPenawaran && (
            <PenawaranStatusBadge status={latestPenawaran.status} />
          )}
          {latestValidity && (
            <PenawaranValidityBadge validity={latestValidity} />
          )}
        </div>

        {ticket.status === 'lost' && ticket.alasan_lost && (() => {
          const parsedLost = parseLostReason(ticket.alasan_lost);
          return (
            <div className='flex flex-col gap-1.5 rounded-xl border border-rose-200/80 bg-rose-50/70 px-3 py-2.5 text-xs text-rose-700'>
              <div className='flex flex-wrap items-center gap-1.5'>
                <span className='font-semibold'>Alasan Lost:</span>
                {parsedLost.category && (
                  <span className='inline-flex items-center rounded-full border border-rose-300/80 bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-rose-600'>
                    {parsedLost.category}
                  </span>
                )}
              </div>
              {parsedLost.detail && (
                <p className='text-xs leading-relaxed text-rose-700/90'>
                  {parsedLost.detail}
                </p>
              )}
            </div>
          );
        })()}
      </CardContent>
    </SurfaceCard>
  );
}
