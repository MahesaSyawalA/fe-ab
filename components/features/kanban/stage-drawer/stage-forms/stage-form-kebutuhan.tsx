'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { formatNumberInput } from '@/lib/utils';
import { StageTextFieldInput, StageTextAreaInput } from '../inputs';

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
    <div className='flex flex-col gap-3'>
      <StageTextFieldInput
        label='Produk / Alkes yang Dibutuhkan'
        isRequired
        value={jenisAlkes}
        onChange={onJenisAlkesChange}
        placeholder='e.g. Mesin Hemodialisa, USG 4D, Ventilator ICU'
      />

      <div className='grid grid-cols-2 gap-2.5'>
        <StageTextFieldInput
          label='Jumlah Unit'
          isRequired
          type='number'
          min={1}
          value={jumlahUnit}
          onChange={onJumlahUnitChange}
        />
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>
            Urgensi Pengadaan <span className='text-rose-500'>*</span>
          </Label>
          <NativeSelect
            value={urgensiPengadaan}
            onChange={(e) => onUrgensiChange(e.target.value)}
            className='h-9 rounded-xl text-xs'
          >
            <option value='Mendesak'>Mendesak (Bulan Ini)</option>
            <option value='Rutin'>Rutin / Semester Berjalan</option>
            <option value='Tahun Depan'>Tahun Anggaran Depan</option>
          </NativeSelect>
        </div>
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label className='text-xs font-semibold'>Perkiraan Anggaran Klien (Budget Rp)</Label>
        <InputGroup className='h-9 rounded-xl border-border bg-card shadow-none'>
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

      <StageTextAreaInput
        label='Spesifikasi & Kebutuhan Teknis Ruangan'
        isRequired
        rows={2}
        value={spesifikasiKebutuhan}
        onChange={onSpesifikasiChange}
        placeholder='Rincian kebutuhan ruangan, kelistrikan, sistem RO, sertifikat BPFK, aksesoris tambahan...'
      />
    </div>
  );
}
