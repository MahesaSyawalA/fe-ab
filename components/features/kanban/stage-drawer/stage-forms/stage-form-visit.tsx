'use client';

import * as React from 'react';
import { MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface StageFormVisitProps {
  koordinatGps: string;
  statusRadius: string;
  tanggalAktivitas: string;
  onTanggalChange: (val: string) => void;
  jamAktivitas: string;
  onJamChange: (val: string) => void;
  picDitemui: string;
  onPicChange: (val: string) => void;
  jabatanPic: string;
  onJabatanChange: (val: string) => void;
  catatan: string;
  onCatatanChange: (val: string) => void;
}

export function StageFormVisit({
  koordinatGps,
  statusRadius,
  tanggalAktivitas,
  onTanggalChange,
  jamAktivitas,
  onJamChange,
  picDitemui,
  onPicChange,
  jabatanPic,
  onJabatanChange,
  catatan,
  onCatatanChange,
}: StageFormVisitProps) {
  return (
    <div className='flex flex-col gap-3.5'>
      <div className='rounded-2xl border border-blue-200 bg-blue-50/70 p-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex size-8 items-center justify-center rounded-xl bg-blue-600 text-white'>
              <MapPin className='size-4' />
            </div>
            <div className='flex flex-col'>
              <span className='text-xs font-bold text-blue-900'>
                Check-in Lokasi Kunjungan
              </span>
              <span className='text-[11px] text-blue-700'>
                Koordinat GPS: {koordinatGps}
              </span>
            </div>
          </div>
          <Badge className='bg-emerald-600 text-white text-[10px] h-5 rounded-full px-2'>
            {statusRadius}
          </Badge>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>
            Tanggal Kunjungan <span className='text-rose-500'>*</span>
          </Label>
          <Input
            type='date'
            value={tanggalAktivitas}
            onChange={(e) => onTanggalChange(e.target.value)}
            className='h-10 rounded-xl text-xs'
            required
          />
        </div>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>
            Jam Kunjungan <span className='text-rose-500'>*</span>
          </Label>
          <Input
            type='time'
            value={jamAktivitas}
            onChange={(e) => onJamChange(e.target.value)}
            className='h-10 rounded-xl text-xs'
            required
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>
            PIC yang Ditemui <span className='text-rose-500'>*</span>
          </Label>
          <Input
            value={picDitemui}
            onChange={(e) => onPicChange(e.target.value)}
            placeholder='e.g. dr. Hendra Sp.PD'
            className='h-10 rounded-xl text-xs'
            required
          />
        </div>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>Jabatan PIC</Label>
          <Input
            value={jabatanPic}
            onChange={(e) => onJabatanChange(e.target.value)}
            placeholder='e.g. Kepala Instalasi'
            className='h-10 rounded-xl text-xs'
          />
        </div>
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label className='text-xs font-semibold'>
          Hasil & Catatan Kunjungan Lapangan <span className='text-rose-500'>*</span>
        </Label>
        <Textarea
          rows={2}
          value={catatan}
          onChange={(e) => onCatatanChange(e.target.value)}
          placeholder='Tuliskan hasil diskusi kunjungan, respon dokter/PIC, dan pengamatan ruangan faskes...'
          className='rounded-xl text-xs'
          required
        />
      </div>
    </div>
  );
}
