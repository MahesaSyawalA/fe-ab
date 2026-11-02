'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { StageSelectInput, StageSelectOption } from '../inputs';

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
      <div className='flex flex-col gap-1.5'>
        <Label className='text-xs font-semibold'>
          Jadwal Follow Up Berikutnya <span className='text-rose-500'>*</span>
        </Label>
        <Input
          type='date'
          value={jadwalFollowUp}
          onChange={(e) => onJadwalFollowUpChange(e.target.value)}
          className='h-9 rounded-xl text-xs'
          required
        />
      </div>
    </div>
  );
}
