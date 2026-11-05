import { ContactRound, ExternalLink } from 'lucide-react';
import { PelangganWithDetails } from '@/types/customer.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { PelangganResponsiveMap } from '../map';
import { PelangganCoordinateBox } from './pelanggan-coordinate-box';

/** Kartu "Lokasi & Koordinat": alamat, peta, tautan Google Maps, dan titik GPS. */
export function PelangganLocationCard({ pelanggan }: { pelanggan: PelangganWithDetails }) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${pelanggan.latitude},${pelanggan.longitude}`;

  return (
    <Card
      size='sm'
      className='rounded-2xl border border-border ring-0 py-4 md:py-5 shadow-2xs bg-card'
    >
      <CardContent className='gap-4 px-4 md:px-5'>
        <div className='flex items-center justify-between'>
          <SectionHeader
            icon={<ContactRound className='size-4' />}
            title='Lokasi & Koordinat'
          />
          <Button
            variant='ghost'
            size='sm'
            nativeButton={false}
            render={<a href={googleMapsUrl} target='_blank' rel='noreferrer' />}
            className='h-8 gap-1.5 px-2.5 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 cursor-pointer'
          >
            <ExternalLink className='size-3.5' />
            <span className='hidden sm:inline'>Buka di Maps</span>
          </Button>
        </div>

        <p className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
          {pelanggan.alamat}
        </p>

        <PelangganResponsiveMap
          latitude={pelanggan.latitude}
          longitude={pelanggan.longitude}
          title={pelanggan.nama_faskes}
          mobile={{ interactive: false, height: '175px' }}
          desktop={{ interactive: true, height: '280px' }}
          badgeClassName='right-3 bottom-3 h-6 px-2.5 text-[11px]'
        />

        <PelangganCoordinateBox
          latitude={pelanggan.latitude}
          longitude={pelanggan.longitude}
          radius={pelanggan.radius_kunjungan || 200}
        />
      </CardContent>
    </Card>
  );
}
