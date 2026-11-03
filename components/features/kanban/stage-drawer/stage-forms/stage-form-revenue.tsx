'use client';

import * as React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { StageCurrencyInput } from '../inputs';

interface StageFormRevenueProps {
  statusClosing: 'won' | 'lost';
  onStatusClosingChange: (val: 'won' | 'lost') => void;
  realisasiRevenue: string;
  onRealisasiRevenueChange: (val: string) => void;
  noInvoiceBast?: string;
  onNoInvoiceBastChange?: (val: string) => void;
  metodePembayaran?: string;
  onMetodePembayaranChange?: (val: string) => void;
}

export function StageFormRevenue({
  statusClosing,
  onStatusClosingChange,
  realisasiRevenue,
  onRealisasiRevenueChange,
}: StageFormRevenueProps) {
  return (
    <div className='flex flex-col gap-3'>
      {/* Hasil Akhir (WON / LOST) */}
      <div className='flex flex-col gap-1.5'>
        <Label className='text-sm font-medium text-foreground'>
          Hasil Akhir <span className='text-rose-500'>*</span>
        </Label>
        <div className='grid grid-cols-2 gap-2.5'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onStatusClosingChange('won')}
            className={cn(
              'h-9 rounded-xl text-xs font-bold gap-2 cursor-pointer',
              statusClosing === 'won'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs'
                : 'border-border text-muted-foreground',
            )}
          >
            <CheckCircle2 className='size-4 text-emerald-600' />
            WON
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => onStatusClosingChange('lost')}
            className={cn(
              'h-9 rounded-xl text-xs font-bold gap-2 cursor-pointer',
              statusClosing === 'lost'
                ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-xs'
                : 'border-border text-muted-foreground',
            )}
          >
            <X className='size-4 text-rose-600' />
            LOST
          </Button>
        </div>
      </div>

      {/* Nilai Revenue (1 Baris Penuh) */}
      <StageCurrencyInput
        label='Nilai Revenue (Rp)'
        name='realisasiRevenue'
        isRequired
        value={realisasiRevenue}
        onChange={onRealisasiRevenueChange}
        placeholder='0'
        prefix='Rp'
        prefixClassName='text-foreground'
        inputClassName='font-bold'
      />
    </div>
  );
}
