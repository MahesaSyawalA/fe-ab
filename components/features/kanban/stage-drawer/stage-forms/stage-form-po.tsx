'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { StageTextFieldInput, StageCurrencyInput } from '../inputs';

interface StageFormPoProps {
  noPo: string;
  onNoPoChange: (val: string) => void;
  nominalPo: string;
  onNominalPoChange: (val: string) => void;
  targetPengiriman: string;
  onTargetPengirimanChange: (val: string) => void;
  terminPembayaran?: string;
  onTerminPembayaranChange?: (val: string) => void;
}

export function StageFormPo({
  noPo,
  onNoPoChange,
  nominalPo,
  onNominalPoChange,
  targetPengiriman,
  onTargetPengirimanChange,
}: StageFormPoProps) {
  return (
    <div className='flex flex-col gap-3'>
      {/* Nomor PO (1 Baris Penuh) */}
      <StageTextFieldInput
        label='Nomor PO'
        isRequired
        value={noPo}
        onChange={onNoPoChange}
        placeholder='PO-RS-2026-...'
        inputClassName='font-semibold'
      />

      {/* Nominal Total PO (1 Baris Penuh) */}
      <StageCurrencyInput
        label='Nominal Total PO (Rp)'
        name='nominalPo'
        isRequired
        value={nominalPo}
        onChange={onNominalPoChange}
        placeholder='0'
        prefix='Rp'
        prefixClassName='text-foreground'
        inputClassName='font-semibold'
      />

      {/* Target Tanggal Pengiriman (1 Baris Penuh) */}
      <div className='flex flex-col gap-1.5'>
        <Label className='text-xs font-semibold text-foreground'>
          Target Tanggal Pengiriman <span className='text-rose-500'>*</span>
        </Label>
        <Input
          type='date'
          value={targetPengiriman}
          onChange={(e) => onTargetPengirimanChange(e.target.value)}
          className='h-9 rounded-xl text-xs'
          required
        />
      </div>
    </div>
  );
}
