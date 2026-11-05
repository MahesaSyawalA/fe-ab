'use client';

import { PelangganWithDetails } from '@/types/customer.types';
import { SubpageHeader } from '@/components/ui/subpage-header';
import {
  PelangganHero,
  PelangganLocationCard,
  PelangganPicList,
  PelangganStatsBand,
} from './detail';

interface PelangganDetailViewProps {
  pelanggan: PelangganWithDetails;
  onBack: () => void;
}

export function PelangganDetailView({
  pelanggan,
  onBack,
}: PelangganDetailViewProps) {
  return (
    <div className='mx-auto flex min-h-svh md:min-h-0 w-full max-w-xl md:max-w-6xl lg:max-w-7xl min-w-0 flex-col bg-background pb-12'>
      {/* Top Header */}
      <SubpageHeader
        title='Detail Pelanggan'
        subtitle='Informasi lengkap profil outlet, data geolokasi GPS, dan kontak PIC'
        onBack={onBack}
      />

      <PelangganHero pelanggan={pelanggan} />
      <PelangganStatsBand pelanggan={pelanggan} />

      {/* Main Content: 2 Columns on Desktop (7:5) */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 px-4 md:px-0 pt-4 md:pt-6 items-start'>
        {/* Left Column: Lokasi & Koordinat (7 cols on Desktop) */}
        <div className='lg:col-span-7 flex flex-col gap-4'>
          <PelangganLocationCard pelanggan={pelanggan} />
        </div>

        {/* Right Column: Daftar PIC (5 cols on Desktop) */}
        <PelangganPicList
          contacts={pelanggan.kontak_list || []}
          className='lg:col-span-5'
        />
      </div>
    </div>
  );
}
