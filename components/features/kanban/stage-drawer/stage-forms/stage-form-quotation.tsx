'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { formatNumberInput } from '@/lib/utils';
import { StageTextFieldInput } from '../inputs';

interface StageFormQuotationProps {
  noQuotation: string;
  onNoQuotationChange: (val: string) => void;
  nilaiQuotation: string;
  onNilaiQuotationChange: (val: string) => void;
  revisiKe: string;
  onRevisiKeChange: (val: string) => void;
  masaBerlaku?: string;
  onMasaBerlakuChange?: (val: string) => void;
}

export function StageFormQuotation({
  noQuotation,
  onNoQuotationChange,
  nilaiQuotation,
  onNilaiQuotationChange,
  revisiKe,
  onRevisiKeChange,
}: StageFormQuotationProps) {
  return (
    <div className='flex flex-col gap-3'>
      {/* Nomor Penawaran (1 Baris Penuh) */}
      <StageTextFieldInput
        label='Nomor Penawaran'
        isRequired
        value={noQuotation}
        onChange={onNoQuotationChange}
        placeholder='QUO/ABM/2026/...'
        inputClassName='font-semibold'
      />

      {/* Total Nilai Penawaran (1 Baris Penuh) */}
      <div className='flex flex-col gap-1.5'>
        <Label className='text-xs font-semibold text-foreground'>
          Total Nilai Penawaran (Rp) <span className='text-rose-500'>*</span>
        </Label>
        <InputGroup className='h-9 rounded-xl border-border bg-card shadow-none'>
          <InputGroupAddon align='inline-start' className='pl-3 text-xs font-bold text-primary'>
            Rp
          </InputGroupAddon>
          <InputGroupInput
            value={nilaiQuotation}
            onChange={(e) => onNilaiQuotationChange(formatNumberInput(e.target.value))}
            placeholder='0'
            className='text-xs font-semibold'
            required
          />
        </InputGroup>
      </div>

      {/* Penawaran Ke- (1 Baris Penuh) */}
      <StageTextFieldInput
        label='Penawaran Ke-'
        type='number'
        min={1}
        value={revisiKe}
        onChange={onRevisiKeChange}
      />
    </div>
  );
}
