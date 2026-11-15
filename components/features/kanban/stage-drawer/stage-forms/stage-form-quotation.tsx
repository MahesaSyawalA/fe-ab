'use client';

import * as React from 'react';
import { StageTextFieldInput, StageCurrencyInput } from '../inputs';

export interface StageFormQuotationProps {
  noQuotation: string;
  onNoQuotationChange: (val: string) => void;
  nilaiQuotation: string;
  onNilaiQuotationChange: (val: string) => void;
  revisiKe: string;
  onRevisiKeChange: (val: string) => void;
}

export function StageFormQuotation({
  noQuotation,
  nilaiQuotation,
  onNilaiQuotationChange,
  revisiKe,
  onRevisiKeChange,
}: StageFormQuotationProps) {
  return (
    <div className='flex flex-col gap-3'>

      <StageTextFieldInput
        label='Nomor Penawaran (Auto-Generated)'
        isRequired
        readOnly
        value={noQuotation || 'QTN-2024-0145-R2'}
        placeholder='Contoh: QTN-2026-001'
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
        type='text'
        inputMode='numeric'
        value={revisiKe}
        placeholder='1'
        onChange={(val) => {
          const digitsOnly = val.replace(/\D/g, '');
          onRevisiKeChange(digitsOnly);
        }}
        onBlur={() => {
          if (!revisiKe || revisiKe === '0') {
            onRevisiKeChange('1');
          }
        }}
        inputClassName='[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
      />
    </div>
  );
}
