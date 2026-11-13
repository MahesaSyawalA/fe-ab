'use client';

import * as React from 'react';
import {
  StageTextFieldInput,
  StageCurrencyInput,
  StageDatePicker,
} from '../inputs';

export interface StageFormPoProps {
  noPo: string;
  onNoPoChange: (val: string) => void;
  nominalPo: string;
  onNominalPoChange: (val: string) => void;
  targetPengiriman: string;
  onTargetPengirimanChange: (val: string) => void;
}

export function StageFormPo({
  noPo,
  nominalPo,
  onNominalPoChange,
  targetPengiriman,
  onTargetPengirimanChange,
}: StageFormPoProps) {
  return (
    <div className='flex flex-col gap-3'>

      <StageTextFieldInput
        label='Nomor PO (Auto-Generated)'
        isRequired
        readOnly
        value={noPo || 'PO-RS-2026-892'}
        placeholder='PO-RS-2026-892'
        inputClassName='bg-muted/60 text-muted-foreground cursor-default'
      />

      <StageCurrencyInput
        label='Total Nilai Purchase Order'
        name='nominalPo'
        isRequired
        value={nominalPo}
        onChange={onNominalPoChange}
        placeholder='45.000.000'
        prefix='RP'
        prefixClassName='text-primary font-bold'
      />

      <StageDatePicker
        label='Target Tanggal Pengiriman'
        name='targetPengiriman'
        isRequired
        value={targetPengiriman}
        onChange={onTargetPengirimanChange}
      />
    </div>
  );
}
