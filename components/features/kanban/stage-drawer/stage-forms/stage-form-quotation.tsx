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
      {/* Nomor Penawaran (Auto-Generated) dengan background grey/disabled style */}
      <StageTextFieldInput
        label='Nomor Penawaran (Auto-Generated)'
        isRequired
        readOnly
        value={noQuotation || 'QTN-2024-0145-R2'}
        placeholder='QTN-2024-0145-R2'
        inputClassName='bg-muted/60 text-muted-foreground cursor-default'
      />

      {/* Total Nilai Penawaran * */}
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

      {/* Penawaran ke- * */}
      <StageTextFieldInput
        label='Penawaran ke-'
        isRequired
        type='text'
        inputMode='numeric'
        value={revisiKe}
        placeholder='1'
        onChange={(val) => {
          // Hanya izinkan angka, tanpa force fallback agar sales leluasa hapus dan ubah angka
          const digitsOnly = val.replace(/\D/g, '');
          onRevisiKeChange(digitsOnly);
        }}
        onBlur={() => {
          // Jika dikosongkan lalu fokus berpindah, fallback aman ke '1'
          if (!revisiKe || revisiKe === '0') {
            onRevisiKeChange('1');
          }
        }}
        inputClassName='[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
      />
    </div>
  );
}
