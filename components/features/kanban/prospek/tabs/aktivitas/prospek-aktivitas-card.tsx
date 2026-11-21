import * as React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/date-utils';
import { AKTIVITAS_STAGE_CONFIG } from '@/constants/kanban-constants';
import { AktivitasWithDetails } from '@/types/ticket.types';
import { EvidenceItem } from '@/types/activity.types';
import { BuktiKunjungan } from '@/types/visit-proof.types';
import { cn, formatFullRupiah, formatShortDate } from '@/lib/utils';
import { ProspekAktivitasEvidence } from './prospek-aktivitas-evidence';
import { AktivitasEvidence } from './normalize-evidence';

interface ProspekAktivitasCardProps {
  akt: AktivitasWithDetails;
  canEdit?: boolean;
  onEdit?: (akt: AktivitasWithDetails) => void;
  onDelete?: (akt: AktivitasWithDetails) => void;
}

export function ProspekAktivitasCard({
  akt,
  canEdit = false,
  onEdit,
  onDelete,
}: ProspekAktivitasCardProps) {
  const config = AKTIVITAS_STAGE_CONFIG[akt.jenis_kegiatan] || {
    label: akt.jenis_kegiatan,
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
    dotColor: '#2563EB',
  };

  const formattedWaktu = React.useMemo(() => {
    if (akt.created_at) {
      return formatRelativeTime(akt.created_at);
    }
    if (akt.tanggal) {
      return formatRelativeTime(akt.tanggal);
    }
    return akt.waktu_label || '-';
  }, [akt.created_at, akt.tanggal, akt.waktu_label]);

  const evidences = React.useMemo(() => {
    const list: AktivitasEvidence[] = [];

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

  const penawaranInfo = React.useMemo(() => {
    if (!akt.penawaran) return null;
    return Array.isArray(akt.penawaran)
      ? (akt.penawaran[0] ?? null)
      : akt.penawaran;
  }, [akt.penawaran]);

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
          <div className='flex items-center gap-1.5'>
            <span className='text-[11px] sm:text-xs text-muted-foreground'>
              {formattedWaktu}
            </span>
            {canEdit && (
              <div className='flex items-center gap-1'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon-sm'
                  onClick={() => onEdit?.(akt)}
                  aria-label='Edit Aktivitas'
                  className='h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer'
                >
                  <Pencil className='size-3.5' />
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon-sm'
                  onClick={() => onDelete?.(akt)}
                  aria-label='Hapus Aktivitas'
                  className='h-7 w-7 sm:h-8 sm:w-8 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/15 cursor-pointer'
                >
                  <Trash2 className='size-3.5' />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm bg-card p-2.5 sm:p-3 rounded-xl border border-border'>
          <div className='flex items-center gap-2'>
            <span className='text-secondary-foreground'>Petugas:</span>
            <span className='font-semibold text-secondary-foreground'>{akt.nama_petugas || 'Sales'}</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-secondary-foreground'>PIC Ditemui:</span>
            <span className='font-semibold text-secondary-foreground'>{akt.pic_ditemui || 'PIC Outlet'}</span>
          </div>
        </div>

        {penawaranInfo && (
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm bg-muted/40 p-2.5 sm:p-3 rounded-xl border border-border'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-[11px] text-muted-foreground'>Nomor Penawaran</span>
              <span className='font-mono font-semibold text-foreground'>
                {penawaranInfo.no_penawaran}
              </span>
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-[11px] text-muted-foreground'>Revisi</span>
              <span className='font-semibold text-foreground'>
                {penawaranInfo.revisi_ke === 0
                  ? 'Penawaran Awal'
                  : `Revisi ke-${penawaranInfo.revisi_ke}`}
              </span>
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-[11px] text-muted-foreground'>Nilai Penawaran</span>
              <span className='font-bold text-accent'>
                {formatFullRupiah(Number(penawaranInfo.total_nilai) || 0)}
              </span>
            </div>
          </div>
        )}

        {akt.purchase_order && (
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm bg-muted/40 p-2.5 sm:p-3 rounded-xl border border-border'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-[11px] text-muted-foreground'>Nomor PO</span>
              <span className='font-mono font-semibold text-foreground'>
                {akt.purchase_order.no_po}
              </span>
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-[11px] text-muted-foreground'>Tanggal PO</span>
              <span className='font-semibold text-foreground'>
                {akt.purchase_order.tanggal_po
                  ? formatShortDate(akt.purchase_order.tanggal_po)
                  : '-'}
              </span>
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-[11px] text-muted-foreground'>Nilai PO</span>
              <span className='font-bold text-accent'>
                {formatFullRupiah(Number(akt.purchase_order.nilai_po) || 0)}
              </span>
            </div>
          </div>
        )}

        <div className='flex flex-col gap-1'>
          <span className='text-xs font-bold text-foreground'>
            Catatan & Pembahasan:
          </span>
          <p className='text-xs sm:text-sm leading-relaxed text-secondary-foreground'>
            {akt.catatan || 'Tidak ada catatan tambahan.'}
          </p>
        </div>

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
