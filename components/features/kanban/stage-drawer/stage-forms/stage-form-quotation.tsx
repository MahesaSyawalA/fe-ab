'use client';

import * as React from 'react';
import { StageTextFieldInput, StageCurrencyInput } from '../inputs';

export interface StageFormQuotationProps {
  noQuotation: string;
  onNoQuotationChange: (val: string) => void;
  nilaiQuotation: string;
  onNilaiQuotationChange: (val: string) => void;
  revisiKe: string;
}

export function StageFormQuotation({
  noQuotation,
  nilaiQuotation,
  onNilaiQuotationChange,
  revisiKe,
}: StageFormQuotationProps) {
  return (
    <div className='flex flex-col gap-3'>

      <StageTextFieldInput
        label='Nomor Penawaran (Auto-Generated)'
        isRequired
        readOnly
        value={noQuotation}
        placeholder='Dibuat otomatis saat disimpan'
        inputClassName='bg-muted/60 text-muted-foreground cursor-default'
      />

      <StageCurrencyInput
        label='Total Nilai Penawaran'
        name='nilaiQuotation'
        isRequired
        value={nilaiQuotation}
        onChange={onNilaiQuotationChange}
        placeholder='45.000.000'
        prefix='RP'
        prefixClassName='text-primary font-bold'
      />

      <StageTextFieldInput
        label='Penawaran ke-'
        isRequired
        readOnly
        value={revisiKe}
        inputClassName='bg-muted/60 text-muted-foreground cursor-default'
      />
    </div>
  );
}
