import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AKTIVITAS_STAGE_CONFIG } from '@/constants/kanban-constants';
import { AktivitasWithDetails } from '@/types/ticket.types';
import { cn } from '@/lib/utils';
import { ProspekAktivitasEvidence } from './prospek-aktivitas-evidence';

export function ProspekAktivitasCard({ akt }: { akt: AktivitasWithDetails }) {
  const config = AKTIVITAS_STAGE_CONFIG[akt.jenis_kegiatan] || {
    label: akt.jenis_kegiatan,
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
    dotColor: '#2563EB',
  };

  return (
    <Card className='rounded-xl border border-border/70 bg-card py-0 shadow-2xs'>
      <CardContent className='flex flex-col gap-3 p-4 sm:p-5'>
        <div className='flex items-center justify-between gap-2'>
          <Badge
            variant='outline'
            className={cn(
              'h-5 px-2.5 text-[10px] font-bold uppercase tracking-wider rounded-full border',
              config.badgeClass,
            )}
          >
            {config.label}
          </Badge>
          <span className='text-[11px] sm:text-xs text-muted-foreground'>
            {akt.waktu_label}
          </span>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm bg-card p-2.5 sm:p-3 rounded-xl border border-border'>
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground'>Petugas:</span>
            <span className='font-semibold text-foreground'>{akt.nama_petugas}</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground'>PIC Ditemui:</span>
            <span className='font-semibold text-foreground'>{akt.pic_ditemui}</span>
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <span className='text-xs font-bold text-foreground'>
            Catatan & Pembahasan:
          </span>
          <p className='text-xs sm:text-sm leading-relaxed text-muted-foreground'>
            {akt.catatan}
          </p>
        </div>

        {akt.evidence && (
          <ProspekAktivitasEvidence
            evidence={akt.evidence}
            fallbackTime={akt.waktu_label}
          />
        )}
      </CardContent>
    </Card>
  );
}
