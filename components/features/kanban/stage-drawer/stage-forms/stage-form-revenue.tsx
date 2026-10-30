'use client';

import * as React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NativeSelect } from '@/components/ui/native-select';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { cn, formatNumberInput } from '@/lib/utils';

interface StageFormRevenueProps {
  statusClosing: 'won' | 'lost';
  onStatusClosingChange: (val: 'won' | 'lost') => void;
  realisasiRevenue: string;
  onRealisasiRevenueChange: (val: string) => void;
  noInvoiceBast: string;
  onNoInvoiceBastChange: (val: string) => void;
  metodePembayaran: string;
  onMetodePembayaranChange: (val: string) => void;
}

export function StageFormRevenue({
  statusClosing,
  onStatusClosingChange,
  realisasiRevenue,
  onRealisasiRevenueChange,
  noInvoiceBast,
  onNoInvoiceBastChange,
  metodePembayaran,
  onMetodePembayaranChange,
}: StageFormRevenueProps) {
  return (
    <div className='flex flex-col gap-3.5'>
      <div className='flex flex-col gap-1.5'>
        <Label className='text-xs font-semibold'>
          Hasil Penjualan Akhir <span className='text-rose-500'>*</span>
        </Label>
        <div className='grid grid-cols-2 gap-3'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onStatusClosingChange('won')}
            className={cn(
              'h-11 rounded-xl text-xs font-bold gap-2 cursor-pointer',
              statusClosing === 'won'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs'
                : 'border-border text-muted-foreground',
            )}
          >
            <CheckCircle2 className='size-4 text-emerald-600' />
            Won (Berhasil Closing)
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => onStatusClosingChange('lost')}
            className={cn(
              'h-11 rounded-xl text-xs font-bold gap-2 cursor-pointer',
              statusClosing === 'lost'
                ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-xs'
                : 'border-border text-muted-foreground',
            )}
          >
            <X className='size-4 text-rose-600' />
            Lost (Batal / Gagal)
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>
            Realisasi Nilai Revenue (Rp) <span className='text-rose-500'>*</span>
          </Label>
          <InputGroup className='h-10 rounded-xl border-border bg-card shadow-none'>
            <InputGroupAddon align='inline-start' className='pl-3 text-xs font-bold text-emerald-600'>
              Rp
            </InputGroupAddon>
            <InputGroupInput
              value={realisasiRevenue}
              onChange={(e) => onRealisasiRevenueChange(formatNumberInput(e.target.value))}
              placeholder='0'
              className='text-xs font-bold text-emerald-700'
              required
            />
          </InputGroup>
        </div>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>No. Invoice & BAST</Label>
          <Input
            value={noInvoiceBast}
            onChange={(e) => onNoInvoiceBastChange(e.target.value)}
            placeholder='INV/ABM/... & BAST-...'
            className='h-10 rounded-xl text-xs'
          />
        </div>
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label className='text-xs font-semibold'>
          Metode Pembayaran <span className='text-rose-500'>*</span>
        </Label>
        <NativeSelect
          value={metodePembayaran}
          onChange={(e) => onMetodePembayaranChange(e.target.value)}
          className='h-10 rounded-xl text-xs'
        >
          <option value='Transfer Bank Mandiri'>Transfer Bank Mandiri PT AB Medical</option>
          <option value='BCA Virtual Account'>BCA Virtual Account</option>
          <option value='Bilyet Giro'>Bilyet Giro / Cek Bank</option>
        </NativeSelect>
      </div>
    </div>
  );
}
