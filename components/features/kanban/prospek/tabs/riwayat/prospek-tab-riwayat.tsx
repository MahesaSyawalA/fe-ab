import { CardContent } from '@/components/ui/card';
import { TiketWithDetails } from '@/types/ticket.types';
import { ProspekRiwayatItem } from './prospek-riwayat-item';

export function ProspekTabRiwayat({ ticket }: { ticket: TiketWithDetails }) {
  const riwayatList = ticket.riwayat_list ?? [];

  return (
    <CardContent className='flex flex-col gap-3 p-4 sm:p-6'>
      {riwayatList.length === 0 ? (
        <p className='py-8 text-center text-xs sm:text-sm text-muted-foreground'>
          Belum ada riwayat perpindahan tahap.
        </p>
      ) : (
        riwayatList.map((item) => (
          <ProspekRiwayatItem key={item.id_riwayat} item={item} />
        ))
      )}
    </CardContent>
  );
}
