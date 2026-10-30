'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { formatNumberInput } from '@/lib/utils';

interface StageFormFollowUpProps {
  mediaKomunikasi: string;
  onMediaKomunikasiChange: (val: string) => void;
  responKlien: string;
  onResponKlienChange: (val: string) => void;
  jadwalFollowUp: string;
  onJadwalFollowUpChange: (val: string) => void;
  estimasiNilai: string;
  onEstimasiNilaiChange: (val: string) => void;
}

export function StageFormFollowUp({
  mediaKomunikasi,
  onMediaKomunikasiChange,
  responKlien,
  onResponKlienChange,
  jadwalFollowUp,
  onJadwalFollowUpChange,
  estimasiNilai,
  onEstimasiNilaiChange,
}: StageFormFollowUpProps) {
  return (
    <div className='flex flex-col gap-3.5'>
      <div className='grid grid-cols-2 gap-3'>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>
            Media Komunikasi <span className='text-rose-500'>*</span>
          </Label>
          <NativeSelect
            value={mediaKomunikasi}
            onChange={(e) => onMediaKomunikasiChange(e.target.value)}
            className='h-10 rounded-xl text-xs'
          >
            <option value='WhatsApp'>WhatsApp Messenger</option>
            <option value='Telepon'>Panggilan Telepon</option>
            <option value='Tatap Muka'>Pertemuan Langsung</option>
            <option value='Online'>Zoom / Google Meet</option>
          </NativeSelect>
        </div>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>
            Respon Klien <span className='text-rose-500'>*</span>
          </Label>
          <NativeSelect
            value={responKlien}
            onChange={(e) => onResponKlienChange(e.target.value)}
            className='h-10 rounded-xl text-xs'
          >
            <option value='Tertarik & Minta Simulasi'>Tertarik & Minta Simulasi</option>
            <option value='Menunggu Persetujuan Direksi'>Menunggu Persetujuan Direksi</option>
            <option value='Meminta Diskon Tambahan'>Meminta Diskon Tambahan</option>
            <option value='Sedang Membandingkan Vendor'>Sedang Membandingkan Vendor</option>
          </NativeSelect>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>
            Jadwal Follow Up Berikutnya <span className='text-rose-500'>*</span>
          </Label>
          <Input
            type='date'
            value={jadwalFollowUp}
            onChange={(e) => onJadwalFollowUpChange(e.target.value)}
            className='h-10 rounded-xl text-xs'
            required
          />
        </div>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>Penyesuaian Nilai (Rp)</Label>
          <InputGroup className='h-10 rounded-xl border-border bg-card shadow-none'>
            <InputGroupAddon align='inline-start' className='pl-3 text-xs font-bold text-muted-foreground'>
              Rp
            </InputGroupAddon>
            <InputGroupInput
              value={estimasiNilai}
              onChange={(e) => onEstimasiNilaiChange(formatNumberInput(e.target.value))}
              placeholder='0'
              className='text-xs'
            />
          </InputGroup>
        </div>
      </div>
    </div>
  );
}
