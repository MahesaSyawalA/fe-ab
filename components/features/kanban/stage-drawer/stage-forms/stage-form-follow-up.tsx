'use client';

import * as React from 'react';
import {
  StageSelectInput,
  StageSelectOption,
  StageDatePicker,
} from '../inputs';

const MEDIA_KOMUNIKASI_OPTIONS: StageSelectOption[] = [
  { value: 'WhatsApp', label: 'WhatsApp Messenger' },
  { value: 'Telepon', label: 'Panggilan Telepon' },
  { value: 'Tatap Muka', label: 'Pertemuan Langsung' },
  { value: 'Online', label: 'Zoom / Google Meet' },
];

interface StageFormFollowUpProps {
  mediaKomunikasi: string;
  onMediaKomunikasiChange: (val: string) => void;
  jadwalFollowUp: string;
  onJadwalFollowUpChange: (val: string) => void;
  responKlien?: string;
  onResponKlienChange?: (val: string) => void;
  estimasiNilai?: string;
  onEstimasiNilaiChange?: (val: string) => void;
}

export function StageFormFollowUp({
  mediaKomunikasi,
  onMediaKomunikasiChange,
  jadwalFollowUp,
  onJadwalFollowUpChange,
}: StageFormFollowUpProps) {
  return (
    <div className='flex flex-col gap-3'>
      {/* Media Komunikasi (1 Baris Penuh) */}
      <StageSelectInput
        label='Media Komunikasi'
        name='mediaKomunikasi'
        isRequired
        value={mediaKomunikasi}
        onChange={onMediaKomunikasiChange}
        options={MEDIA_KOMUNIKASI_OPTIONS}
      />

      {/* Jadwal Follow Up Berikutnya (1 Baris Penuh) */}
      <StageDatePicker
        label='Jadwal Follow Up Berikutnya'
        name='jadwalFollowUp'
        isRequired
        value={jadwalFollowUp}
        onChange={onJadwalFollowUpChange}
      />
    </div>
  );
}
