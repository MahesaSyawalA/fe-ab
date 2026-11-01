import { CardContent } from '@/components/ui/card';
import { TiketWithDetails } from '@/types/ticket.types';
import { ProspekInfoRow } from './prospek-info-row';

export function ProspekTabInfo({ ticket }: { ticket: TiketWithDetails }) {
  const telepon = ticket.no_telp_pic || '0812-3456-7890';

  return (
    <CardContent className='flex flex-col divide-y divide-border/60 p-0'>
      <ProspekInfoRow label='Pelanggan' value={ticket.nama_faskes} />
      <ProspekInfoRow
        label='Kontak PIC'
        value={ticket.nama_pic || 'Bpk. Hendra Wijaya'}
      />
      <ProspekInfoRow
        label='Jabatan'
        value={ticket.jabatan_pic || 'Direktur Umum'}
      />
      <ProspekInfoRow
        label='Telepon'
        value={telepon}
        href={`tel:${telepon.replace(/[^0-9+]/g, '')}`}
      />
      <ProspekInfoRow
        label='Sales PIC'
        value={ticket.nama_sales || 'Rina Putri'}
      />
    </CardContent>
  );
}
