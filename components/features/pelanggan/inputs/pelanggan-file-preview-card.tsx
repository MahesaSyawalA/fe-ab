'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PelangganFilePreviewCardProps {
  value: string;
  onRemove: (e: React.MouseEvent) => void;
}

export function PelangganFilePreviewCard({
  value,
  onRemove,
}: PelangganFilePreviewCardProps) {
  return (
    <div className='relative mt-1 h-44 sm:h-52 md:h-60 w-full overflow-hidden rounded-xl border border-border bg-secondary/40'>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={value} alt='Preview' className='size-full object-cover' />
      <Button
        type='button'
        variant='ghost'
        size='icon-xs'
        onClick={onRemove}
        className='absolute top-2 right-2 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-white cursor-pointer'
        title='Hapus foto'
      >
        <X className='size-3.5' />
      </Button>
    </div>
  );
}

