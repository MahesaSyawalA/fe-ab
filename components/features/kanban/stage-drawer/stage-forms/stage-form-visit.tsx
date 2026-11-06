'use client';

import * as React from 'react';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StageDrawerMode } from '../types';
import type { Kontak } from '@/types/contact.types';
import {
  StageTextFieldInput,
  StageSelectInput,
  StageDatePicker,
} from '../inputs';

export interface StageFormVisitProps {
  mode?: StageDrawerMode;
  koordinatGps?: string;
  statusRadius?: string;
  onRefreshLocation?: () => void;
  waktuAktivitas?: string;
  onWaktuChange?: (val: string) => void;
  picDitemui?: string;
  onPicSelect?: (nama: string, jabatan: string, noTelp?: string) => void;
  jabatanPic?: string;
  kontakList?: Kontak[];
}

export function StageFormVisit({
  mode = 'create',
  koordinatGps = '-6.2008, 106.8765',
  statusRadius = 'Dalam Radius (38m)',
  onRefreshLocation,
  waktuAktivitas = '',
  onWaktuChange,
  picDitemui = '',
  onPicSelect,
  jabatanPic = '',
  kontakList = [],
}: StageFormVisitProps) {
  // PIC Options
  const picOptions = React.useMemo(() => {
    const list = [...kontakList];
    if (picDitemui && !list.some((k) => k.nama.toLowerCase() === picDitemui.toLowerCase())) {
      list.unshift({
        id_kontak: 'current-pic',
        id_pelanggan: '',
        nama: picDitemui,
        jabatan: jabatanPic || 'PIC Outlet',
        no_telp: '',
        email: '',
        kategori_peran: null,
        inisial: null,
        created_at: '',
        updated_at: '',
      });
    }
    return list.map((k) => ({
      value: k.id_kontak,
      label: k.nama,
    }));
  }, [kontakList, picDitemui, jabatanPic]);

  const selectedContact =
    kontakList.find((k) => k.nama === picDitemui) || kontakList[0];
  const selectedPicKey = selectedContact?.id_kontak ?? (picOptions[0]?.value || '');

  return (
    <div className='flex flex-col gap-3'>
      {/* Section Geo (Simple & Compact Box) */}
      <div className='flex items-center justify-between gap-2 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2 text-xs text-blue-900'>
        <div className='flex items-center gap-1.5 min-w-0 truncate'>
          <MapPin className='size-4 text-blue-600 shrink-0' />
          <span className='font-medium text-muted-foreground'>Lokasi:</span>
          <span className='font-semibold text-blue-950 truncate'>{koordinatGps}</span>
        </div>
        <Badge className='bg-emerald-500 hover:bg-emerald-500 text-white text-[10px] h-5 rounded-full px-2.5 shrink-0 font-medium border-0'>
          {statusRadius}
        </Badge>
      </div>

      {mode === 'move' ? (
        <>
          {/* Waktu Kunjungan * */}
          <StageDatePicker
            label='Waktu Kunjungan'
            name='waktuKunjungan'
            isRequired
            value={waktuAktivitas}
            onChange={(val) => onWaktuChange?.(val)}
          />

          {/* PIC Outlet * */}
          <StageSelectInput
            label='PIC Outlet'
            name='picOutlet'
            isRequired
            placeholder={picOptions.length === 0 ? 'Belum ada kontak outlet' : 'Pilih PIC Outlet...'}
            value={selectedPicKey}
            onChange={(id) => {
              const contact = kontakList.find((k) => k.id_kontak === id);
              if (contact && onPicSelect) {
                onPicSelect(contact.nama, contact.jabatan || '', contact.no_telp || '');
              }
            }}
            options={picOptions}
          />

          {/* Jabatan PIC * */}
          <StageTextFieldInput
            label='Jabatan PIC'
            isRequired
            readOnly
            value={jabatanPic}
            placeholder='Jabatan PIC'
            inputClassName='bg-muted/60 text-muted-foreground cursor-default'
          />
        </>
      ) : (
        /* Tombol Lebar Ambil Titik Koordinat Saat Ini (Hanya di mode create) */
        <Button
          type='button'
          variant='outline'
          onClick={onRefreshLocation}
          className='h-9 w-full rounded-[8px] border border-blue-300 bg-blue-50/40 text-blue-600 hover:bg-blue-50 hover:text-blue-700 text-xs font-semibold cursor-pointer shadow-none'
        >
          Ambil Titik Koordinat Saat Ini
        </Button>
      )}
    </div>
  );
}
