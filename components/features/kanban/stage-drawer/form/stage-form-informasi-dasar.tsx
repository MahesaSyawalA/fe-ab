'use client';

import * as React from 'react';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { PRIORITY_CONFIG } from '@/constants/kanban-constants';
import { TiketPrioritas } from '@/types/ticket.types';
import type { PelangganWithDetails } from '@/types/customer.types';
import type { Kontak } from '@/types/contact.types';
import {
  StageTextFieldInput,
  StageSelectInput,
  StageCurrencyInput,
  StageDatePicker,
} from '../inputs';

export interface StageFormInformasiDasarProps {
  // Judul
  judulProspek: string;
  onJudulChange: (judul: string) => void;
  // Outlet
  selectedPelangganId: string;
  onFaskesChange: (pelangganId: string) => void;
  pelangganList: PelangganWithDetails[];
  // PIC Outlet
  picDitemui: string;
  onPicSelect: (nama: string, jabatan: string, noTelp?: string) => void;
  kontakList: Kontak[];
  // Jabatan PIC
  jabatanPic: string;
  // Estimasi Nilai Closing
  estimasiNilai: string;
  onEstimasiNilaiChange: (val: string) => void;
  // Target Tanggal Closing
  targetClosing: string;
  onTargetClosingChange: (val: string) => void;
  // Tingkat Prioritas
  prioritas: TiketPrioritas;
  onPrioritasChange: (p: TiketPrioritas) => void;
}

export function StageFormInformasiDasar({
  judulProspek,
  onJudulChange,
  selectedPelangganId,
  onFaskesChange,
  pelangganList,
  picDitemui,
  onPicSelect,
  kontakList,
  jabatanPic,
  estimasiNilai,
  onEstimasiNilaiChange,
  targetClosing,
  onTargetClosingChange,
  prioritas,
  onPrioritasChange,
}: StageFormInformasiDasarProps) {
  // Opsi dropdown Outlet (Faskes)
  const outletOptions = React.useMemo(
    () =>
      pelangganList.map((p) => ({
        value: p.id_pelanggan,
        label: `${p.nama_faskes} (${p.tipe_faskes})`,
      })),
    [pelangganList],
  );

  // Opsi dropdown PIC Outlet
  const picOptions = React.useMemo(() => {
    const list = [...kontakList];
    if (picDitemui && !list.some((k) => k.nama.toLowerCase() === picDitemui.toLowerCase())) {
      list.unshift({
        id_kontak: 'current-pic',
        id_pelanggan: selectedPelangganId,
        nama: picDitemui,
        jabatan: jabatanPic || 'PIC Outlet',
        no_telp: '',
        email: '',
        created_at: '',
        updated_at: '',
      });
    }
    return list.map((k) => ({
      value: k.id_kontak,
      label: k.nama,
    }));
  }, [kontakList, picDitemui, jabatanPic, selectedPelangganId]);

  const selectedContact =
    kontakList.find((k) => k.nama === picDitemui) || kontakList[0];
  const selectedPicKey = selectedContact?.id_kontak ?? (picOptions[0]?.value || '');

  return (
    <div className='flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3.5 sm:p-4'>
      {/* Header INFORMASI DASAR */}
      <div className='flex items-center gap-2 text-xs font-bold text-primary tracking-wide uppercase'>
        <Building2 className='size-4 text-primary shrink-0' />
        <span>INFORMASI DASAR</span>
      </div>

      {/* 1. Judul Prospek / Pengadaan */}
      <StageTextFieldInput
        label='Judul Prospek / Pengadaan'
        isRequired
        value={judulProspek}
        onChange={onJudulChange}
        placeholder='e.g. Pengadaan Mesin Hemodialisa 6 Unit'
        inputClassName='bg-white'
      />

      {/* 2. Outlet */}
      <StageSelectInput
        label='Outlet'
        name='outlet'
        isRequired
        placeholder='Pilih Outlet...'
        value={selectedPelangganId}
        onChange={onFaskesChange}
        options={outletOptions}
        triggerClassName='bg-white'
      />

      {/* 3. PIC Outlet */}
      <StageSelectInput
        label='PIC Outlet'
        name='picOutlet'
        isRequired
        placeholder={picOptions.length === 0 ? 'Belum ada kontak outlet' : 'Pilih PIC Outlet...'}
        value={selectedPicKey}
        onChange={(id) => {
          const contact = kontakList.find((k) => k.id_kontak === id);
          if (contact) {
            onPicSelect(contact.nama, contact.jabatan || '', contact.no_telp || '');
          }
        }}
        options={picOptions}
        triggerClassName='bg-white'
      />

      {/* 4. Jabatan PIC (Read-only disabled style) */}
      <StageTextFieldInput
        label='Jabatan PIC'
        isRequired
        readOnly
        value={jabatanPic}
        placeholder='Jabatan PIC'
        inputClassName='bg-muted/60 text-muted-foreground cursor-default'
      />

      {/* 5. Estimasi Nilai Closing */}
      <StageCurrencyInput
        label='Estimasi Nilai Closing'
        name='estimasiNilaiClosing'
        isRequired
        value={estimasiNilai}
        onChange={onEstimasiNilaiChange}
        prefix='RP'
        prefixClassName='text-primary font-bold'
        inputGroupClassName='bg-white'
      />

      {/* 6. Target Tanggal Closing */}
      <StageDatePicker
        label='Target Tanggal Closing'
        name='targetTanggalClosing'
        isRequired
        value={targetClosing}
        onChange={onTargetClosingChange}
        className='bg-white'
      />

      {/* 7. Tingkat Prioritas */}
      <div className='flex flex-col gap-1.5'>
        <Label className='text-sm font-semibold text-foreground'>
          Tingkat Prioritas <span className='text-rose-500'>*</span>
        </Label>
        <div className='grid grid-cols-3 gap-2'>
          {(['rendah', 'sedang', 'tinggi'] as TiketPrioritas[]).map((p) => {
            const cfg = PRIORITY_CONFIG[p];
            const isSelected = prioritas === p;
            return (
              <Button
                key={p}
                type='button'
                variant='outline'
                size='sm'
                onClick={() => onPrioritasChange(p)}
                className={cn(
                  'h-9 rounded-[8px] border text-xs font-semibold gap-1.5 cursor-pointer bg-white transition-all',
                  isSelected
                    ? p === 'tinggi'
                      ? 'border-rose-400 bg-rose-50/80 text-rose-700 shadow-2xs'
                      : p === 'sedang'
                        ? 'border-amber-400 bg-amber-50/80 text-amber-700 shadow-2xs'
                        : 'border-emerald-400 bg-emerald-50/80 text-emerald-700 shadow-2xs'
                    : 'border-border text-foreground hover:bg-muted/40',
                )}
              >
                <span className={cn('size-1.5 rounded-full', cfg.dotClass)} />
                <span>{cfg.formLabel}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

