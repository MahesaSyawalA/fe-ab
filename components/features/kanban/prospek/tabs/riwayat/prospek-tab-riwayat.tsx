import { History } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { TiketWithDetails } from '@/types/ticket.types';
import { ProspekRiwayatItem } from './prospek-riwayat-item';

export function ProspekTabRiwayat({ ticket }: { ticket: TiketWithDetails }) {
  const riwayatList = ticket.riwayat_list ?? [];

  return (
    <CardContent className='flex flex-col gap-3 p-4 sm:p-6'>
      {riwayatList.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-border/70 bg-muted/20'>
          <History className='size-10 text-muted-foreground/40 mb-2.5' />
          <p className='text-xs sm:text-sm font-semibold text-foreground'>
            Belum Ada Riwayat Perpindahan Tahap
          </p>
          <p className='text-[11px] sm:text-xs text-muted-foreground max-w-sm mt-1'>
            Setiap kali tiket dipindahkan ke tahapan baru, riwayat aktivitas dan nama pengguna yang memindahkan akan tercatat otomatis di sini.
          </p>
        </div>
      ) : (
        <div className='flex flex-col gap-2.5'>
          {riwayatList.map((item) => (
            <ProspekRiwayatItem key={item.id_riwayat} item={item} />
          ))}
        </div>
      )}
    </CardContent>
  );
}
