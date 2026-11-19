import * as React from 'react';
import { ArrowRight, Clock, Trash2, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AKTIVITAS_STAGE_CONFIG } from '@/constants/kanban-constants';
import { formatRelativeTime } from '@/lib/date-utils';
import type { DeletedActivityLog } from '@/store/kanban-store';
import type { TiketWithDetails } from '@/types/ticket.types';

type RiwayatItem = NonNullable<TiketWithDetails['riwayat_list']>[number];

export function ProspekRiwayatItem({ item }: { item: RiwayatItem }) {
  const formattedWaktu = React.useMemo(() => {
    if (item.waktu_pindah) {
      return formatRelativeTime(item.waktu_pindah);
    }
    return item.waktu_label || '-';
  }, [item.waktu_label, item.waktu_pindah]);

  return (
    <div className='flex items-start justify-between gap-3 p-3 sm:p-4 rounded-xl border border-border/60 bg-card hover:bg-muted/10 transition-colors'>
      <div className='flex flex-col gap-2 min-w-0 flex-1'>
        <div className='flex items-center gap-1.5 flex-wrap min-w-0'>
          {item.nama_tahap_asal ? (
            <>
              <Badge
                variant='outline'
                className='h-5 px-2 text-[10px] font-medium bg-muted/30 border-border text-muted-foreground'
              >
                {item.nama_tahap_asal}
              </Badge>
              <ArrowRight className='size-3 text-muted-foreground shrink-0' />
              <Badge
                variant='outline'
                className='h-5 px-2 text-[10px] font-semibold bg-primary/10 text-primary border-primary/20'
              >
                {item.nama_tahap_tujuan}
              </Badge>
            </>
          ) : (
            <Badge
              variant='outline'
              className='h-5 px-2 text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
            >
              Tiket Dibuat: {item.nama_tahap_tujuan}
            </Badge>
          )}
        </div>

        <div className='flex items-center gap-1.5 text-xs text-secondary-foreground'>
          <UserRound className='size-3.5 text-secondary-foreground/80 shrink-0' />
          <span>
            Oleh <strong className='text-secondary-foreground font-semibold'>{item.nama_user || 'Sales'}</strong>
          </span>
        </div>
      </div>

      <div className='flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground shrink-0 self-start pt-0.5'>
        <Clock className='size-3 text-muted-foreground/70 shrink-0' />
        <span className='whitespace-nowrap'>{formattedWaktu}</span>
      </div>
    </div>
  );
}

export function ProspekDeletedAktivitasItem({ log }: { log: DeletedActivityLog }) {
  const stageLabel =
    AKTIVITAS_STAGE_CONFIG[log.jenis_kegiatan]?.label || log.jenis_kegiatan;
  const formattedWaktu = log.waktu_hapus
    ? formatRelativeTime(log.waktu_hapus)
    : '-';

  return (
    <div className='flex items-start justify-between gap-3 p-3 sm:p-4 rounded-xl border border-destructive/20 bg-destructive/5 transition-colors'>
      <div className='flex flex-col gap-1.5 min-w-0 flex-1'>
        <div className='flex items-center gap-1.5 flex-wrap min-w-0'>
          <Badge
            variant='outline'
            className='h-5 gap-1 px-2 text-[10px] font-semibold bg-destructive/10 text-destructive border-destructive/25'
          >
            <Trash2 className='size-2.5 shrink-0' />
            <span>Aktivitas Dihapus · {stageLabel}</span>
          </Badge>
        </div>

        {log.catatan && (
          <p className='text-xs text-secondary-foreground line-clamp-2 leading-relaxed'>
            {log.catatan}
          </p>
        )}

        <div className='flex items-center gap-1.5 text-xs text-secondary-foreground'>
          <UserRound className='size-3.5 text-secondary-foreground/80 shrink-0' />
          <span>
            Dihapus oleh <strong className='text-secondary-foreground font-semibold'>{log.nama_user || 'Pengguna'}</strong>
          </span>
        </div>
      </div>

      <div className='flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground shrink-0 self-start pt-0.5'>
        <Clock className='size-3 text-muted-foreground/70 shrink-0' />
        <span className='whitespace-nowrap'>{formattedWaktu}</span>
      </div>
    </div>
  );
}
