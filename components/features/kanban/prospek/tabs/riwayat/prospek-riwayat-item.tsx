import * as React from 'react';
import { ArrowRight, Clock, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/date-utils';
import { TiketWithDetails } from '@/types/ticket.types';

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
        {/* Badges alur perpindahan */}
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

        {/* User pemindah */}
        <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
          <UserRound className='size-3.5 text-muted-foreground/80 shrink-0' />
          <span>
            Oleh <strong className='text-foreground font-semibold'>{item.nama_user || 'Sales'}</strong>
          </span>
        </div>
      </div>

      {/* Tanggal & Jam */}
      <div className='flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground shrink-0 self-start pt-0.5'>
        <Clock className='size-3 text-muted-foreground/70 shrink-0' />
        <span className='whitespace-nowrap'>{formattedWaktu}</span>
      </div>
    </div>
  );
}
