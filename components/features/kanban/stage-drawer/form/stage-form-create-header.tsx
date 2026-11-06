'use client';

import * as React from 'react';
import { Building2 } from 'lucide-react';
import type { PelangganWithDetails } from '@/types/customer.types';
import { StageTextFieldInput, StageSelectInput } from '../inputs';

interface StageFormCreateHeaderProps {
  selectedPelangganId: string;
  onOutletChange: (pelangganId: string) => void;
  pelangganList: PelangganWithDetails[];
  judulProspek: string;
  onJudulChange: (judul: string) => void;
}

export function StageFormCreateHeader({
  selectedPelangganId,
  onOutletChange,
  pelangganList,
  judulProspek,
  onJudulChange,
}: StageFormCreateHeaderProps) {
  const outletOptions = React.useMemo(
    () =>
      pelangganList.map((p) => ({
        value: p.id_pelanggan,
        label: `${p.nama_outlet} (${p.tipe_outlet})`,
      })),
    [pelangganList],
  );

  return (
    <div className='flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-3.5'>
      <div className='flex items-center gap-2 text-xs font-bold text-primary'>
        <Building2 className='size-4' />
        Informasi Prospek & Klien
      </div>

      <StageSelectInput
        label='Outlet Pelanggan'
        name='pelanggan'
        isRequired
        placeholder='Pilih outlet pelanggan...'
        value={selectedPelangganId}
        onChange={onOutletChange}
        options={outletOptions}
        triggerClassName='bg-white'
      />

      <StageTextFieldInput
        label='Judul Prospek / Pengadaan'
        isRequired
        value={judulProspek}
        onChange={onJudulChange}
        placeholder='e.g. Pengadaan Mesin Hemodialisa 6 Unit'
        inputClassName='bg-white'
      />
    </div>
  );
}
