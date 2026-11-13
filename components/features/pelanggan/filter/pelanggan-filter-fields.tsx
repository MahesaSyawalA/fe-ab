'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export const OUTLET_FILTER_OPTIONS = [
  { id: 'semua', label: 'Semua Tipe', dotColor: 'bg-kanban-purple' },
  { id: 'Rumah Sakit', label: 'Rumah Sakit', dotColor: 'bg-kanban-pink' },
  { id: 'Klinik', label: 'Klinik', dotColor: 'bg-kanban-orange' },
  { id: 'Apotek', label: 'Apotek / Laboratorium', dotColor: 'bg-kanban-green' },
  { id: 'Individu', label: 'Individu', dotColor: 'bg-kanban-lightblue' },
];

export interface PelangganFilterFieldsProps {
  draftTipe: string;
  onDraftTipeChange: (tipe: string) => void;
}

export function PelangganFilterFields({
  draftTipe,
  onDraftTipeChange,
}: PelangganFilterFieldsProps) {
  return (
    <div className='flex flex-col gap-2.5'>
      <Label className='text-xs font-bold text-foreground'>Tipe Outlet</Label>
      <div className='flex flex-wrap gap-2'>
        {OUTLET_FILTER_OPTIONS.map((opt) => {
          const isSelected = draftTipe === opt.id;
          return (
            <Button
              key={opt.id}
              type='button'
              variant='outline'
              size='sm'
              onClick={() => onDraftTipeChange(opt.id)}
              className={cn(
                'h-9 rounded-full px-4 text-xs font-medium shadow-none transition-all cursor-pointer gap-2',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary font-semibold hover:bg-primary/15 hover:text-primary'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted/40 hover:text-foreground',
              )}
            >
              <span className={cn('size-2 rounded-full shrink-0', opt.dotColor)} />
              {opt.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
