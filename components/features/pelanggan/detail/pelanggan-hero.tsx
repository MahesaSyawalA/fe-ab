import { Check, MapPin } from 'lucide-react';
import { PelangganWithDetails } from '@/types/customer.types';
import { DEFAULT_OUTLET_IMAGE } from '@/constants/pelanggan-constants';
import { Badge } from '@/components/ui/badge';

/** Banner foto outlet dengan nama, tipe, status, dan alamat di atas gradien. */
export function PelangganHero({ pelanggan }: { pelanggan: PelangganWithDetails }) {
  return (
    <div className='relative h-52 md:h-64 lg:h-72 w-full overflow-hidden bg-slate-900 md:rounded-3xl md:border md:border-border/60 md:shadow-sm'>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={pelanggan.img_url || DEFAULT_OUTLET_IMAGE}
        alt={pelanggan.nama_faskes}
        className='size-full object-cover'
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10' />

      <div className='absolute inset-x-4 md:inset-x-8 bottom-4 md:bottom-6 flex flex-col gap-2 text-white'>
        <div className='flex flex-wrap items-center gap-2 md:gap-2.5'>
          <h2 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm'>
            {pelanggan.nama_faskes}
          </h2>
          <Badge className='h-5 md:h-6 rounded-md bg-primary-default px-2 md:px-2.5 text-[11px] md:text-xs font-semibold text-white'>
            {pelanggan.tipe_faskes}
          </Badge>
          <Badge className='h-5 md:h-6 gap-1 rounded-md bg-success px-2 md:px-2.5 text-[11px] md:text-xs font-semibold text-white'>
            <Check className='size-3 stroke-[2.5]' />
            {pelanggan.status || 'Aktif'}
          </Badge>
        </div>

        <div className='flex items-center gap-1.5 text-xs md:text-sm text-white/90'>
          <MapPin className='size-3.5 shrink-0 text-white/80' />
          <p className='leading-relaxed line-clamp-2 md:line-clamp-none max-w-3xl'>
            {pelanggan.alamat}
          </p>
        </div>
      </div>
    </div>
  );
}
