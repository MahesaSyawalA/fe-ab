import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/date-utils';
import { AKTIVITAS_STAGE_CONFIG } from '@/constants/kanban-constants';
import { AktivitasWithDetails } from '@/types/ticket.types';
import { EvidenceItem } from '@/types/activity.types';
import { BuktiKunjungan } from '@/types/visit-proof.types';
import { cn } from '@/lib/utils';
import { ProspekAktivitasEvidence } from './prospek-aktivitas-evidence';
import { AktivitasEvidence } from './normalize-evidence';

export function ProspekAktivitasCard({ akt }: { akt: AktivitasWithDetails }) {
  const config = AKTIVITAS_STAGE_CONFIG[akt.jenis_kegiatan] || {
    label: akt.jenis_kegiatan,
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
    dotColor: '#2563EB',
  };

  const formattedWaktu = React.useMemo(() => {
    // Prioritaskan created_at agar menampilkan waktu aktivitas riil (misal: "Baru saja", "5 menit lalu")
    // bukan tanggal kalender aktivitas yang bernilai tengah malam UTC (00:00:00Z)
    if (akt.created_at) {
      return formatRelativeTime(akt.created_at);
    }
    if (akt.tanggal) {
      return formatRelativeTime(akt.tanggal);
    }
    return akt.waktu_label || '-';
  }, [akt.created_at, akt.tanggal, akt.waktu_label]);

  // Kumpulkan seluruh data bukti lampiran secara universal (baik evidence maupun bukti_kunjungan, format array maupun object)
  const evidences = React.useMemo(() => {
    const list: AktivitasEvidence[] = [];

    // 1. Lampiran Bukti Umum (mendukung array evidence[] maupun object tunggal evidence)
    const rawEvidenceList: EvidenceItem[] = Array.isArray(akt.evidence)
      ? akt.evidence
      : akt.evidence
        ? [akt.evidence]
        : [];

    for (const ev of rawEvidenceList) {
      if (ev && (ev.url_file || ev.url_preview || ev.nama_file || ev.deskripsi)) {
        list.push({
          ...ev,
          waktu_upload: ev.waktu_upload || formattedWaktu,
        });
      }
    }

    // 2. Lampiran Bukti Kunjungan (mendukung array bukti_kunjungan[] maupun object tunggal)
    const rawBuktiList: BuktiKunjungan[] = Array.isArray(akt.bukti_kunjungan)
      ? akt.bukti_kunjungan
      : akt.bukti_kunjungan
        ? [akt.bukti_kunjungan]
        : [];

    for (const bk of rawBuktiList) {
      if (bk && (bk.img_url || bk.file_url)) {
        const targetUrl = bk.img_url || bk.file_url || '';
        const ext = targetUrl.split('?')[0].split('.').pop()?.toLowerCase() || '';
        const isAudio = ['mp3', 'm4a', 'wav', 'aac', 'ogg', 'oga', 'opus'].includes(ext);
        const isDoc = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'].includes(ext);
        const defaultName = isAudio
          ? 'Rekaman Suara Kunjungan'
          : isDoc
            ? 'Dokumen Bukti Kunjungan'
            : 'Foto Bukti Kunjungan (Selfie/Check-in)';

        list.push({
          tipe: isAudio ? 'audio' : isDoc ? 'dokumen' : 'foto',
          nama_file: defaultName,
          deskripsi: `Jarak Klien: ${bk.jarak_klien}m (${
            bk.dalam_radius ? 'Dalam Radius' : 'Luar Radius'
          })`,
          url_preview: targetUrl,
          url_file: targetUrl,
          waktu_upload: bk.created_at ? formatRelativeTime(bk.created_at) : formattedWaktu,
        });

        // Jika ada file berkas pendukung terpisah pada bukti kunjungan
        if (bk.file_url && bk.file_url !== bk.img_url) {
          list.push({
            tipe: 'dokumen',
            nama_file: 'Lampiran Berkas Kunjungan',
            deskripsi: 'Lampiran dokumen pendukung kunjungan lapangan.',
            url_file: bk.file_url,
            waktu_upload: bk.created_at ? formatRelativeTime(bk.created_at) : formattedWaktu,
          });
        }
      }
    }

    return list;
  }, [akt.evidence, akt.bukti_kunjungan, formattedWaktu]);

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

        {/* Universal Evidence Renderer untuk semua tahap */}
        {evidences.length > 0 && (
          <div className='flex flex-col gap-2 pt-1'>
            {evidences.map((ev, idx) => (
              <ProspekAktivitasEvidence
                key={`${akt.id_aktivitas}-evidence-${idx}`}
                evidence={ev}
                fallbackTime={formattedWaktu}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
