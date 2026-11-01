import { TiketWithDetails } from '@/types/ticket.types';

type RiwayatItem = NonNullable<TiketWithDetails['riwayat_list']>[number];

export function ProspekRiwayatItem({ item }: { item: RiwayatItem }) {
  return (
    <div className='flex items-start justify-between gap-3 border-b border-border/50 pb-3 last:border-b-0 last:pb-0'>
      <div className='flex flex-col gap-0.5'>
        <span className='text-xs sm:text-sm font-semibold text-foreground'>
          {item.nama_tahap_asal
            ? `${item.nama_tahap_asal} → ${item.nama_tahap_tujuan}`
            : `Tiket dibuat di tahap ${item.nama_tahap_tujuan}`}
        </span>
        <span className='text-[11px] sm:text-xs text-muted-foreground'>
          Oleh {item.nama_user}
        </span>
      </div>
      <span className='text-[11px] sm:text-xs text-muted-foreground shrink-0'>
        {item.waktu_label}
      </span>
    </div>
  );
}
