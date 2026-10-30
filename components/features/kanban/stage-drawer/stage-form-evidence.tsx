'use client';

import * as React from 'react';
import {
  Camera,
  File,
  FileText,
  Mic,
  Paperclip,
  ShieldCheck,
  UploadCloud,
  X,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { detectFileType, EvidenceFileState } from './types';

interface StageFormEvidenceProps {
  evidenceFile: EvidenceFileState | null;
  onEvidenceFileChange: (file: EvidenceFileState | null) => void;
  evidenceDeskripsi: string;
  onEvidenceDeskripsiChange: (val: string) => void;
  evidenceError: boolean;
  onEvidenceErrorChange: (err: boolean) => void;
  stageType: string;
}

export function StageFormEvidence({
  evidenceFile,
  onEvidenceFileChange,
  evidenceDeskripsi,
  onEvidenceDeskripsiChange,
  evidenceError,
  onEvidenceErrorChange,
  stageType,
}: StageFormEvidenceProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeInKb = file.size / 1024;
      const formattedSize =
        sizeInKb > 1024
          ? `${(sizeInKb / 1024).toFixed(1)} MB`
          : `${Math.round(sizeInKb)} KB`;

      const objectUrl = file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : undefined;

      onEvidenceFileChange({
        name: file.name,
        size: formattedSize,
        type: file.type,
        url: objectUrl,
      });
      onEvidenceErrorChange(false);
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl border p-4 transition-all',
        evidenceError
          ? 'border-2 border-rose-500 bg-rose-50/50 ring-2 ring-rose-200'
          : 'border-border/80 bg-slate-50/70',
      )}
    >
      {/* Evidence Section Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary'>
            <ShieldCheck className='size-4' />
          </div>
          <div className='flex flex-col'>
            <span className='text-xs font-bold text-foreground'>
              File Bukti Aktivitas <span className='text-rose-500'>*</span>
            </span>
            <span className='text-[10px] text-muted-foreground'>
              Unggah file foto, rekaman suara audio, dokumen PDF/Word, atau berkas catatan
            </span>
          </div>
        </div>
      </div>

      {/* Hidden Real File Input */}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt'
        onChange={handleFileInputChange}
        className='hidden'
      />

      {/* Unified File Upload Zone / Attached File Card */}
      {evidenceFile ? (
        <div className='flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-white p-3 shadow-xs'>
          <div className='flex items-center gap-3 min-w-0'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
              {detectFileType(evidenceFile.name) === 'foto' ? (
                <Camera className='size-5' />
              ) : detectFileType(evidenceFile.name) === 'audio' ? (
                <Mic className='size-5' />
              ) : detectFileType(evidenceFile.name) === 'teks' ? (
                <FileText className='size-5' />
              ) : (
                <File className='size-5' />
              )}
            </div>
            <div className='flex flex-col min-w-0'>
              <span className='text-xs font-semibold text-foreground truncate'>
                {evidenceFile.name}
              </span>
              <div className='flex items-center gap-2 text-[10px] text-muted-foreground'>
                <span>{evidenceFile.size}</span>
                <span>•</span>
                <span className='capitalize font-medium text-primary'>
                  {detectFileType(evidenceFile.name) === 'foto'
                    ? 'Foto / Gambar'
                    : detectFileType(evidenceFile.name) === 'audio'
                      ? 'Rekaman Audio'
                      : detectFileType(evidenceFile.name) === 'teks'
                        ? 'Catatan Teks'
                        : 'Dokumen Berkas'}
                </span>
              </div>
            </div>
          </div>
          <button
            type='button'
            onClick={() => {
              onEvidenceFileChange(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className='rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive cursor-pointer shrink-0'
            title='Hapus file'
          >
            <X className='size-4' />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'group flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all',
            evidenceError && !evidenceFile
              ? 'border-rose-400 bg-rose-50/60'
              : 'border-border/80 bg-white hover:border-primary/50 hover:bg-primary/5',
          )}
        >
          <div className='flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-105 transition-transform'>
            <UploadCloud className='size-5' />
          </div>
          <div className='flex flex-col gap-0.5'>
            <span className='text-xs font-semibold text-foreground'>
              Pilih atau Unggah File Bukti
            </span>
            <span className='text-[10px] text-muted-foreground'>
              Mendukung foto, audio rekaman, dokumen PDF/Word, atau file catatan
            </span>
          </div>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='mt-1 h-8 rounded-lg text-[11px] font-semibold gap-1.5 pointer-events-none'
          >
            <Paperclip className='size-3.5' />
            Pilih File dari Perangkat
          </Button>
        </div>
      )}

      {/* Quick sample file presets */}
      <div className='flex flex-wrap items-center gap-1.5 pt-0.5'>
        <span className='text-[10px] text-muted-foreground'>Contoh cepat:</span>
        <button
          type='button'
          onClick={() => {
            onEvidenceFileChange({
              name: `foto_kunjungan_${stageType}_${Date.now()}.jpg`,
              size: '1.4 MB',
            });
            onEvidenceErrorChange(false);
          }}
          className='rounded-md border border-border/60 bg-white px-2 py-0.5 text-[10px] text-muted-foreground hover:border-primary hover:text-primary cursor-pointer'
        >
          + Foto
        </button>
        <button
          type='button'
          onClick={() => {
            onEvidenceFileChange({
              name: `rekaman_suara_${stageType}_${Date.now()}.m4a`,
              size: '920 KB',
            });
            onEvidenceErrorChange(false);
          }}
          className='rounded-md border border-border/60 bg-white px-2 py-0.5 text-[10px] text-muted-foreground hover:border-primary hover:text-primary cursor-pointer'
        >
          + Audio
        </button>
        <button
          type='button'
          onClick={() => {
            onEvidenceFileChange({
              name: `dokumen_${stageType}_resmi_${Date.now()}.pdf`,
              size: '750 KB',
            });
            onEvidenceErrorChange(false);
          }}
          className='rounded-md border border-border/60 bg-white px-2 py-0.5 text-[10px] text-muted-foreground hover:border-primary hover:text-primary cursor-pointer'
        >
          + Dokumen PDF
        </button>
        <button
          type='button'
          onClick={() => {
            onEvidenceFileChange({
              name: `catatan_notulen_${stageType}_${Date.now()}.txt`,
              size: '35 KB',
            });
            onEvidenceErrorChange(false);
          }}
          className='rounded-md border border-border/60 bg-white px-2 py-0.5 text-[10px] text-muted-foreground hover:border-primary hover:text-primary cursor-pointer'
        >
          + Catatan Teks
        </button>
      </div>

      {/* Keterangan Deskripsi Bukti */}
      <div className='flex flex-col gap-1.5 pt-1 border-t border-border/60'>
        <Label className='text-xs font-semibold text-foreground'>
          Keterangan Bukti <span className='text-rose-500'>*</span>
        </Label>
        <Input
          value={evidenceDeskripsi}
          onChange={(e) => {
            onEvidenceDeskripsiChange(e.target.value);
            if (e.target.value.trim()) onEvidenceErrorChange(false);
          }}
          placeholder='Tuliskan ringkasan bukti verifikasi (e.g. Foto serah terima / Rekaman konfirmasi / Dokumen PO basah)'
          className={cn(
            'h-10 rounded-xl text-xs bg-white',
            evidenceError && !evidenceDeskripsi.trim() && 'border-rose-400 focus-visible:ring-rose-400',
          )}
          required
        />
      </div>
    </div>
  );
}
