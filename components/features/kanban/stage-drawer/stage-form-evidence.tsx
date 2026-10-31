'use client';

import * as React from 'react';
import { Camera, File, FileText, Mic, Paperclip, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { detectFileType, EvidenceFileState } from './types';

const EVIDENCE_ICON = { foto: Camera, audio: Mic, teks: FileText, dokumen: File } as const;

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
}: StageFormEvidenceProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeInKb = file.size / 1024;
    onEvidenceFileChange({
      name: file.name,
      size: sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${Math.round(sizeInKb)} KB`,
      type: file.type,
      url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    });
    onEvidenceErrorChange(false);
  };

  const FileIcon = evidenceFile ? EVIDENCE_ICON[detectFileType(evidenceFile.name)] : Paperclip;

  return (
    <div className='flex flex-col gap-1.5'>
      <Label className='text-xs font-semibold text-foreground'>
        Bukti Aktivitas <span className='text-rose-500'>*</span>
      </Label>

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt'
        onChange={handleFileInputChange}
        className='hidden'
      />

      {evidenceFile ? (
        <div className='flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2'>
          <FileIcon className='size-4 shrink-0 text-primary' />
          <div className='flex min-w-0 flex-1 flex-col'>
            <span className='truncate text-xs font-semibold text-foreground'>{evidenceFile.name}</span>
            <span className='text-[10px] text-muted-foreground'>{evidenceFile.size}</span>
          </div>
          <button
            type='button'
            onClick={() => {
              onEvidenceFileChange(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className='shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-destructive cursor-pointer'
            title='Hapus file'
          >
            <X className='size-4' />
          </button>
        </div>
      ) : (
        <Button
          type='button'
          variant='outline'
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'h-9 w-full justify-start gap-2 rounded-xl border-dashed text-xs font-medium text-muted-foreground shadow-none cursor-pointer',
            evidenceError && 'border-rose-400 bg-rose-50/60 text-rose-600',
          )}
        >
          <Paperclip className='size-4' />
          Unggah foto, audio, atau dokumen
        </Button>
      )}

      <Input
        value={evidenceDeskripsi}
        onChange={(e) => {
          onEvidenceDeskripsiChange(e.target.value);
          if (e.target.value.trim()) onEvidenceErrorChange(false);
        }}
        placeholder='Keterangan bukti (singkat)'
        className={cn(
          'h-9 rounded-xl text-xs',
          evidenceError && !evidenceDeskripsi.trim() && 'border-rose-400 focus-visible:ring-rose-400',
        )}
        required
      />
    </div>
  );
}
