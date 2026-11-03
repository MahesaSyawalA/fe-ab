'use client';

import * as React from 'react';
import {
  StageSelectInput,
  StageSelectOption,
  StageDatePicker,
} from '../inputs';
import { StageDrawerMode } from '../types';

const MEDIA_KOMUNIKASI_OPTIONS: StageSelectOption[] = [
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'Telepon', label: 'Telepon' },
  { value: 'Email', label: 'Email' },
  { value: 'Pertemuan Langsung', label: 'Pertemuan Langsung' },
  { value: 'Video Call', label: 'Video Call' },
];

export interface StageFormFollowUpProps {
  mode?: StageDrawerMode;
  mediaKomunikasi: string;
  onMediaKomunikasiChange: (val: string) => void;
  jadwalFollowUp: string;
  onJadwalFollowUpChange: (val: string) => void;
}

export function StageFormFollowUp({
  mode = 'create',
  mediaKomunikasi,
  onMediaKomunikasiChange,
  jadwalFollowUp,
  onJadwalFollowUpChange,
}: StageFormFollowUpProps) {
  const isMove = mode === 'move';

  return (
    <div className='flex flex-col gap-3'>
      {/* Media Komunikasi * */}
      <StageSelectInput
        label='Media Komunikasi'
        name='mediaKomunikasi'
        isRequired
        value={mediaKomunikasi}
        onChange={onMediaKomunikasiChange}
        options={MEDIA_KOMUNIKASI_OPTIONS}
        placeholder='Pilih Media Komunikasi...'
      />

      {/* Jadwal Follow Up Berikutnya * (Move) vs Jadwal Follow Up (opsional) (Create) */}
      <StageDatePicker
        label={isMove ? 'Jadwal Follow Up Berikutnya' : 'Jadwal Follow Up (opsional)'}
        name='jadwalFollowUp'
        isRequired={isMove}
        value={jadwalFollowUp}
        onChange={onJadwalFollowUpChange}
      />
    </div>
  );
}
