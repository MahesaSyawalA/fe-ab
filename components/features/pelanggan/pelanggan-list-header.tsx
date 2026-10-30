import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PelangganListHeaderProps {
  title?: string;
  subtitle?: string;
  onAddClick: () => void;
}

export function PelangganListHeader({
  title = 'Pelanggan',
  subtitle = 'Daftar Pelanggan - Jakarta',
  onAddClick,
}: PelangganListHeaderProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full'>
      <div>
        <h1 className='text-lg sm:text-xl font-bold text-foreground tracking-tight leading-snug'>
          {title}
        </h1>
        <p className='text-xs sm:text-sm text-secondary-foreground'>{subtitle}</p>
      </div>

      <Button
        onClick={onAddClick}
        className='h-9.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-4 gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto'
      >
        <Plus className='size-3.5 stroke-[2.5]' />
        Tambah Pelanggan
      </Button>
    </div>
  );
}
