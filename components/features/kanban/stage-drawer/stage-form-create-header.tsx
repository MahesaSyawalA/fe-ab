'use client';

import * as React from 'react';
import { Building2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { PelangganWithDetails } from '@/types/customer.types';

interface StageFormCreateHeaderProps {
  selectedPelangganId: string;
  onFaskesChange: (pelangganId: string) => void;
  pelangganList: PelangganWithDetails[];
  judulProspek: string;
  onJudulChange: (judul: string) => void;
}

export function StageFormCreateHeader({
  selectedPelangganId,
  onFaskesChange,
  pelangganList,
  judulProspek,
  onJudulChange,
}: StageFormCreateHeaderProps) {
  return (
    <div className='flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-3.5'>
      <div className='flex items-center gap-2 text-xs font-bold text-primary'>
        <Building2 className='size-4' />
        Informasi Prospek & Klien
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label className='text-xs font-semibold'>
          Fasilitas Kesehatan (Faskes) <span className='text-rose-500'>*</span>
        </Label>
        <NativeSelect
          value={selectedPelangganId}
          onChange={(e) => onFaskesChange(e.target.value)}
          className='h-10 rounded-xl text-xs bg-white'
          required
        >
          {pelangganList.map((p) => (
            <option key={p.id_pelanggan} value={p.id_pelanggan}>
              {p.nama_faskes} ({p.tipe_faskes})
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label className='text-xs font-semibold'>
          Judul Prospek / Pengadaan <span className='text-rose-500'>*</span>
        </Label>
        <Input
          value={judulProspek}
          onChange={(e) => onJudulChange(e.target.value)}
          placeholder='e.g. Pengadaan Mesin Hemodialisa 6 Unit'
          className='h-10 rounded-xl text-xs bg-white'
          required
        >
        </Input>
      </div>
    </div>
  );
}
