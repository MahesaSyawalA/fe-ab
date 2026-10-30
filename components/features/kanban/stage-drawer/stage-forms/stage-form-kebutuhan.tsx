'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NativeSelect } from '@/components/ui/native-select';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { formatNumberInput } from '@/lib/utils';

interface StageFormKebutuhanProps {
  jenisAlkes: string;
  onJenisAlkesChange: (val: string) => void;
  jumlahUnit: string;
  onJumlahUnitChange: (val: string) => void;
  urgensiPengadaan: string;
  onUrgensiChange: (val: string) => void;
  estimasiBudget: string;
  onEstimasiBudgetChange: (val: string) => void;
  spesifikasiKebutuhan: string;
  onSpesifikasiChange: (val: string) => void;
}

export function StageFormKebutuhan({
  jenisAlkes,
  onJenisAlkesChange,
  jumlahUnit,
  onJumlahUnitChange,
  urgensiPengadaan,
  onUrgensiChange,
  estimasiBudget,
  onEstimasiBudgetChange,
  spesifikasiKebutuhan,
  onSpesifikasiChange,
}: StageFormKebutuhanProps) {
  return (
    <div className='flex flex-col gap-3.5'>
      <div className='flex flex-col gap-1.5'>
        <Label className='text-xs font-semibold'>
          Produk / Alkes yang Dibutuhkan <span className='text-rose-500'>*</span>
        </Label>
        <Input
          value={jenisAlkes}
          onChange={(e) => onJenisAlkesChange(e.target.value)}
          placeholder='e.g. Mesin Hemodialisa, USG 4D, Ventilator ICU'
          className='h-10 rounded-xl text-xs'
          required
        />
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>
            Jumlah Unit <span className='text-rose-500'>*</span>
          </Label>
          <Input
            type='number'
            min={1}
            value={jumlahUnit}
            onChange={(e) => onJumlahUnitChange(e.target.value)}
            className='h-10 rounded-xl text-xs'
            required
          />
        </div>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>
            Urgensi Pengadaan <span className='text-rose-500'>*</span>
          </Label>
          <NativeSelect
            value={urgensiPengadaan}
            onChange={(e) => onUrgensiChange(e.target.value)}
            className='h-10 rounded-xl text-xs'
          >
            <option value='Mendesak'>Mendesak (Bulan Ini)</option>
            <option value='Rutin'>Rutin / Semester Berjalan</option>
            <option value='Tahun Depan'>Tahun Anggaran Depan</option>
          </NativeSelect>
        </div>
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label className='text-xs font-semibold'>Perkiraan Anggaran Klien (Budget Rp)</Label>
        <InputGroup className='h-10 rounded-xl border-border bg-card shadow-none'>
          <InputGroupAddon align='inline-start' className='pl-3 text-xs font-bold text-muted-foreground'>
            Rp
          </InputGroupAddon>
          <InputGroupInput
            value={estimasiBudget}
            onChange={(e) => onEstimasiBudgetChange(formatNumberInput(e.target.value))}
            placeholder='0'
            className='text-xs'
          />
        </InputGroup>
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label className='text-xs font-semibold'>
          Spesifikasi & Kebutuhan Teknis Ruangan <span className='text-rose-500'>*</span>
        </Label>
        <Textarea
          rows={2}
          value={spesifikasiKebutuhan}
          onChange={(e) => onSpesifikasiChange(e.target.value)}
          placeholder='Rincian kebutuhan ruangan, kelistrikan, sistem RO, sertifikat BPFK, aksesoris tambahan...'
          className='rounded-xl text-xs'
          required
        />
      </div>
    </div>
  );
}
