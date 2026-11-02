'use client';

import * as React from 'react';
import { StageTextFieldInput, StageCurrencyInput } from '../inputs';

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
      <StageCurrencyInput
        label='Total Nilai Penawaran (Rp)'
        name='nilaiQuotation'
        isRequired
        value={nilaiQuotation}
        onChange={onNilaiQuotationChange}
        placeholder='0'
        prefix='Rp'
        prefixClassName='text-foreground'
        inputClassName='font-semibold'
      />

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
