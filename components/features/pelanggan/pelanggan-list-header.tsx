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
    <div className='flex flex-col items-start gap-3'>
      <div>
        <h1 className='text-lg font-bold text-foreground tracking-tight leading-snug'>
          {title}
        </h1>
        <p className='text-xs text-secondary-foreground'>{subtitle}</p>
      </div>

      <Button
        onClick={onAddClick}
        className='h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs px-3.5 gap-1.5 shadow-xs cursor-pointer'
      >
        <Plus className='size-3.5 stroke-[2.5]' />
        Tambah Pelanggan
      </Button>
    </div>
  );
}
