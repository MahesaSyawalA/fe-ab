import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
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

  const formattedWaktu = React.useMemo(() => {
    if (akt.waktu_label) return akt.waktu_label;
    if (akt.tanggal) {
      try {
        return format(new Date(akt.tanggal), 'd MMM yyyy, HH:mm', {
          locale: id,
        });
      } catch {
        return String(akt.tanggal);
      }
    }
    return '-';
  }, [akt.waktu_label, akt.tanggal]);

  const evidenceData =
    akt.evidence ||
    (akt.bukti_kunjungan
      ? {
          tipe: 'foto' as const,
          nama_file: 'Foto Bukti Kunjungan (Selfie/Check-in)',
          deskripsi: `Jarak Klien: ${akt.bukti_kunjungan.jarak_klien}m (${akt.bukti_kunjungan.dalam_radius ? 'Dalam Radius' : 'Luar Radius'})`,
          url_preview: akt.bukti_kunjungan.img_url,
          url_file: akt.bukti_kunjungan.file_url || undefined,
          waktu_upload: formattedWaktu,
        }
      : null);

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
            {formattedWaktu}
          </span>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm bg-card p-2.5 sm:p-3 rounded-xl border border-border'>
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground'>Petugas:</span>
            <span className='font-semibold text-foreground'>{akt.nama_petugas || 'Sales'}</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground'>PIC Ditemui:</span>
            <span className='font-semibold text-foreground'>{akt.pic_ditemui || 'PIC Outlet'}</span>
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <span className='text-xs font-bold text-foreground'>
            Catatan & Pembahasan:
          </span>
          <p className='text-xs sm:text-sm leading-relaxed text-muted-foreground'>
            {akt.catatan || 'Tidak ada catatan tambahan.'}
          </p>
        </div>

        {evidenceData && (
          <ProspekAktivitasEvidence
            evidence={evidenceData}
            fallbackTime={formattedWaktu}
          />
        )}
      </CardContent>
    </Card>
  );
}
