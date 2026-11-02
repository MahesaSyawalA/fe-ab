'use client';

import * as React from 'react';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Kontak } from '@/types/contact.types';
import {
  StageTextFieldInput,
  StageSelectInput,
  StageDatePicker,
} from '../inputs';

interface StageFormVisitProps {
  koordinatGps: string;
  statusRadius?: string;
  waktuAktivitas: string;
  onWaktuChange: (val: string) => void;
  picDitemui: string;
  onPicSelect: (nama: string, jabatan: string, noTelp?: string) => void;
  jabatanPic: string;
  kontakList?: Kontak[];
}

export function StageFormVisit({
  koordinatGps,
  waktuAktivitas,
  onWaktuChange,
  picDitemui,
  onPicSelect,
  jabatanPic,
  kontakList = [],
}: StageFormVisitProps) {
  // Pastikan kontak list minimal punya item PIC saat ini jika belum ada di kontakList
  const options = React.useMemo(() => {
    const list = [...kontakList];
    if (picDitemui && !list.some((k) => k.nama.toLowerCase() === picDitemui.toLowerCase())) {
      list.unshift({
        id_kontak: 'current-pic',
        id_pelanggan: '',
        nama: picDitemui,
        jabatan: jabatanPic || 'PIC Terpilih',
        no_telp: '',
        email: '',
        created_at: '',
        updated_at: '',
      });
    }
    return list;
  }, [kontakList, picDitemui, jabatanPic]);

  const selectOptions = React.useMemo(() => {
    return options.map((k) => ({
      value: k.id_kontak,
      label: `${k.nama} ${k.kategori_peran ? `(${k.kategori_peran})` : ''}`.trim(),
    }));
  }, [options]);

  const selectedContact =
    options.find(
      (k) => k.nama === picDitemui && (k.jabatan ?? '') === jabatanPic,
    ) ?? options.find((k) => k.nama === picDitemui);
  const selectedKey = selectedContact?.id_kontak ?? '';

  return (
    <div className='flex flex-col gap-3'>
      {/* Section Geo (Simple & Compact) */}
      <div className='flex items-center justify-between gap-2 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-1.5 text-xs text-blue-900'>
        <div className='flex items-center gap-1.5 min-w-0 truncate'>
          <MapPin className='size-3.5 text-blue-600 shrink-0' />
          <span className='font-medium text-muted-foreground'>Lokasi:</span>
          <span className='font-semibold text-blue-950 truncate'>{koordinatGps}</span>
        </div>
        <Badge className='bg-emerald-600 text-white text-[10px] h-5 rounded-full px-2 shrink-0 font-medium'>
          Dalam Radius (38m)
        </Badge>
      </div>

      {/* Input Tanggal Kunjungan */}
      <StageDatePicker
        label='Tanggal Kunjungan'
        name='waktuAktivitas'
        isRequired
        value={waktuAktivitas}
        onChange={onWaktuChange}
      />

      {/* PIC Relasi Data Client & Jabatan Otomatis */}
      <div className='grid grid-cols-2 gap-2.5'>
        <StageSelectInput
          label='PIC yang Ditemui'
          name='picDitemui'
          isRequired
          placeholder={
            options.length === 0 ? 'Tidak ada kontak client' : 'Pilih PIC...'
          }
          value={selectedKey}
          onChange={(selectedId) => {
            const selected = options.find((k) => k.id_kontak === selectedId);
            if (selected) {
              onPicSelect(
                selected.nama,
                selected.jabatan || '',
                selected.no_telp || '',
              );
            }
          }}
          options={selectOptions}
        />

        <StageTextFieldInput
          label='Jabatan PIC'
          value={jabatanPic}
          readOnly
          placeholder='Jabatan terisi otomatis'
        />
      </div>
    </div>
  );
}
