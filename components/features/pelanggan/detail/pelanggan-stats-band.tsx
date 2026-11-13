import { PelangganWithDetails } from '@/types/customer.types';
import { StatCard } from '@/components/ui/stat-card';

export function PelangganStatsBand({ pelanggan }: { pelanggan: PelangganWithDetails }) {
  return (
    <div className='bg-card px-4 md:px-6 py-3.5 md:py-4 shadow-2xs md:rounded-2xl md:border md:border-border/60 md:mt-4'>
      <div className='grid grid-cols-3 gap-2.5 md:gap-6'>
        <StatCard
          value={pelanggan.tiket_aktif ?? 0}
          label='Tiket aktif'
          align='left'
        />
        <StatCard
          value={pelanggan.total_kunjungan ?? 0}
          label='Kunjungan'
          align='left'
        />
        <StatCard
          value={pelanggan.estimasi_nilai || 'Rp0'}
          label='Estimasi'
          align='left'
        />
      </div>
    </div>
  );
}
