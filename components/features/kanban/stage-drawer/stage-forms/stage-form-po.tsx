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

interface StageFormPoProps {
  noPo: string;
  onNoPoChange: (val: string) => void;
  nominalPo: string;
  onNominalPoChange: (val: string) => void;
  targetPengiriman: string;
  onTargetPengirimanChange: (val: string) => void;
  terminPembayaran: string;
  onTerminPembayaranChange: (val: string) => void;
}

export function StageFormPo({
  noPo,
  onNoPoChange,
  nominalPo,
  onNominalPoChange,
  targetPengiriman,
  onTargetPengirimanChange,
  terminPembayaran,
  onTerminPembayaranChange,
}: StageFormPoProps) {
  return (
    <div className='flex flex-col gap-3'>
      <div className='grid grid-cols-2 gap-2.5'>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>
            Nomor Purchase Order (PO) <span className='text-rose-500'>*</span>
          </Label>
          <Input
            value={noPo}
            onChange={(e) => onNoPoChange(e.target.value)}
            placeholder='PO-RS-2026-...'
            className='h-9 rounded-xl text-xs font-semibold'
            required
          />
        </div>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>
            Nominal Total PO (Rp) <span className='text-rose-500'>*</span>
          </Label>
          <InputGroup className='h-9 rounded-xl border-border bg-card shadow-none'>
            <InputGroupAddon align='inline-start' className='pl-3 text-xs font-bold text-sky-600'>
              Rp
            </InputGroupAddon>
            <InputGroupInput
              value={nominalPo}
              onChange={(e) => onNominalPoChange(formatNumberInput(e.target.value))}
              placeholder='0'
              className='text-xs font-semibold'
              required
            />
          </InputGroup>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2.5'>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>
            Target Tanggal Pengiriman Unit <span className='text-rose-500'>*</span>
          </Label>
          <Input
            type='date'
            value={targetPengiriman}
            onChange={(e) => onTargetPengirimanChange(e.target.value)}
            className='h-9 rounded-xl text-xs'
            required
          />
        </div>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>
            Termin Pembayaran <span className='text-rose-500'>*</span>
          </Label>
          <NativeSelect
            value={terminPembayaran}
            onChange={(e) => onTerminPembayaranChange(e.target.value)}
            className='h-9 rounded-xl text-xs'
          >
            <option value='DP 30% - Pelunasan 70%'>DP 30% - Pelunasan 70%</option>
            <option value='Net 30 Hari'>Net 30 Hari Setelah BAST</option>
            <option value='Net 14 Hari'>Net 14 Hari</option>
            <option value='Tunai 100%'>Tunai 100% Sebelum Kirim</option>
          </NativeSelect>
        </div>
      </div>
    </div>
  );
}
