'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';

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
      <div className='flex flex-col gap-1.5'>
        <Label className='text-xs font-semibold'>
          Media Komunikasi <span className='text-rose-500'>*</span>
        </Label>
        <NativeSelect
          value={mediaKomunikasi}
          onChange={(e) => onMediaKomunikasiChange(e.target.value)}
          className='h-9 rounded-xl text-xs bg-card'
        >
          <option value='WhatsApp'>WhatsApp Messenger</option>
          <option value='Telepon'>Panggilan Telepon</option>
          <option value='Tatap Muka'>Pertemuan Langsung</option>
          <option value='Online'>Zoom / Google Meet</option>
        </NativeSelect>
      </div>

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
