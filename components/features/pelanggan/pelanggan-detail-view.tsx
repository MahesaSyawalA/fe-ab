'use client';

import * as React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from '@heroui/react';
import { PelangganWithDetails } from '@/types/customer.types';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useDeletePelangganMutation } from '@/hooks/queries';
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
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const deleteMutation = useDeletePelangganMutation();

  // Sales dan Manager dapat mengedit/menghapus; Director hanya memantau (view-only)
  const isAllowedToEdit = canEdit ?? (session?.user?.role !== 'director');

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(pelanggan.id_pelanggan);
      toast.success('Data berhasil dihapus', {
        description: `Pelanggan "${pelanggan.nama_outlet}" telah dihapus.`,
      });
      setIsDeleteOpen(false);
      onBack();
    } catch {
      toast.danger('Gagal Menghapus Pelanggan', {
        description: 'Terjadi kesalahan sistem saat menghapus data outlet.',
      });
    }
  };

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
            <div className='flex items-center gap-1.5'>
              {/* Mobile Actions (< md) */}
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
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                onClick={() => setIsDeleteOpen(true)}
                className='size-8 rounded-full text-destructive hover:bg-destructive/10 cursor-pointer md:hidden'
                aria-label='Hapus Pelanggan'
              >
                <Trash2 className='size-4' />
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

              {/* Desktop Delete Button (>= md) */}
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setIsDeleteOpen(true)}
                className='hidden md:flex h-9 rounded-xl border-destructive/30 bg-destructive/5 text-destructive shadow-2xs hover:bg-destructive/10 gap-1.5 px-3.5 cursor-pointer text-xs font-semibold'
              >
                <Trash2 className='size-3.5' />
                <span>Hapus</span>
              </Button>
            </div>
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

      {/* Modal Konfirmasi Hapus Pelanggan */}
      <ConfirmModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title='Hapus Pelanggan?'
        description={`Data pelanggan "${pelanggan.nama_outlet}" dan seluruh riwayat terkait akan dihapus secara permanen dari sistem.`}
        confirmLabel='Hapus'
        cancelLabel='Batal'
        icon={<Trash2 className='size-7 text-rose-600' />}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
