'use client';

import * as React from 'react';
import { Pencil } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { PelangganWithDetails } from '@/types/customer.types';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { Button } from '@/components/ui/button';
import {
  PelangganHero,
  PelangganLocationCard,
  PelangganPicList,
  PelangganStatsBand,
  PelangganEditModal,
} from './detail';

interface PelangganDetailViewProps {
  pelanggan: PelangganWithDetails;
  onBack: () => void;
  basePath?: string;
  canEdit?: boolean;
}

export function PelangganDetailView({
  pelanggan,
  onBack,
  canEdit,
}: PelangganDetailViewProps) {
  const { data: session } = useSession();
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  // Sales dan Manager dapat mengedit; Director hanya memantau (view-only)
  const isAllowedToEdit = canEdit ?? (session?.user?.role !== 'director');

  const contacts = pelanggan.kontak_list || pelanggan.kontak || [];

  return (
    <div className='mx-auto flex min-h-svh md:min-h-0 w-full max-w-xl md:max-w-6xl lg:max-w-7xl min-w-0 flex-col bg-background pb-12'>
      {/* Top Header */}
      <SubpageHeader
        title='Detail Pelanggan'
        subtitle='Informasi lengkap profil outlet, data geolokasi GPS, dan kontak PIC'
        onBack={onBack}
        rightAction={
          isAllowedToEdit ? (
            <>
              {/* Mobile Edit Button (< md) */}
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                onClick={() => setIsEditOpen(true)}
                className='size-8 rounded-full text-foreground hover:bg-muted cursor-pointer md:hidden'
                aria-label='Edit Pelanggan'
              >
                <Pencil className='size-4' />
              </Button>

              {/* Desktop Edit Button (>= md) */}
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setIsEditOpen(true)}
                className='hidden md:flex h-9 rounded-xl border-border bg-card text-foreground shadow-2xs hover:bg-secondary gap-1.5 px-3.5 cursor-pointer text-xs font-semibold'
              >
                <Pencil className='size-3.5' />
                <span>Edit Pelanggan</span>
              </Button>
            </>
          ) : undefined
        }
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
          contacts={contacts}
          className='lg:col-span-5'
        />
      </div>

      {/* Modal Edit Pelanggan */}
      <PelangganEditModal
        pelanggan={pelanggan}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </div>
  );
}
