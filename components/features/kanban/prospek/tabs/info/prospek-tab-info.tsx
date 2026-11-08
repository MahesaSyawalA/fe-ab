import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TiketWithDetails } from '@/types/ticket.types';
import { PRIORITY_CONFIG } from '@/constants/kanban-constants';
import { cn, formatFullRupiah, formatShortDate } from '@/lib/utils';
import { ProspekInfoRow } from './prospek-info-row';

export function ProspekTabInfo({ ticket }: { ticket: TiketWithDetails }) {
  const telepon = ticket.no_telp_pic || '';
  const priorityConfig = PRIORITY_CONFIG[ticket.prioritas];

  const closingFormatted =
    ticket.closing_full_label ||
    (ticket.estimasi_closing ? formatShortDate(ticket.estimasi_closing) : '-');

  return (
    <CardContent className='flex flex-col divide-y divide-border/60 p-0'>
      <ProspekInfoRow label='Pelanggan' value={ticket.nama_outlet || '-'} />
      <ProspekInfoRow
        label='Kontak PIC'
        value={ticket.nama_pic || '-'}
      />
      <ProspekInfoRow
        label='Jabatan PIC'
        value={ticket.jabatan_pic || '-'}
      />
      <ProspekInfoRow
        label='No. Telepon / WhatsApp'
        value={telepon || '-'}
        href={telepon ? `tel:${telepon.replace(/[^0-9+]/g, '')}` : undefined}
      />
      <ProspekInfoRow
        label='Sales PIC'
        value={ticket.nama_sales || '-'}
      />
      <ProspekInfoRow
        label='Estimasi Nilai'
        value={
          <span className='font-bold text-accent'>
            {formatFullRupiah(ticket.estimasi_nilai || 0)}
          </span>
        }
      />
      <ProspekInfoRow
        label='Target Estimasi Closing'
        value={closingFormatted}
      />
      <ProspekInfoRow
        label='Prioritas Prospek'
        value={
          <Badge
            className={cn(
              'h-5 gap-1.5 rounded-full px-2 text-[10px] font-semibold',
              priorityConfig?.badgeClass || 'bg-muted text-muted-foreground',
            )}
          >
            <span
              className={cn(
                'size-1.5 rounded-full',
                priorityConfig?.dotClass || 'bg-muted-foreground',
              )}
            />
            {priorityConfig?.label || ticket.prioritas || '-'}
          </Badge>
        }
      />
      <ProspekInfoRow
        label='Kebutuhan & Spesifikasi Pelanggan'
        value={ticket.kebutuhan_pelanggan || 'Belum ada catatan kebutuhan spesifik.'}
        isMultiline
      />
    </CardContent>
  );
}
