'use client';

import * as React from 'react';
import { Camera, File, FileText, Mic, X } from 'lucide-react';
import { detectFileType, type EvidenceFileState } from '../types';

const EVIDENCE_ICON = {
  foto: Camera,
  audio: Mic,
  teks: FileText,
  dokumen: FileText,
} as const;

export interface StageFilePreviewCardProps {
  file: EvidenceFileState;
  disabled?: boolean;
  onRemove: (e: React.MouseEvent) => void;
}

export function StageFilePreviewCard({
  file,
  disabled,
  onRemove,
}: StageFilePreviewCardProps) {
  const FileIcon = EVIDENCE_ICON[detectFileType(file.name)] || File || FileText;

  return (
    <div className='flex items-center justify-between gap-3 rounded-md border border-border/80 bg-card px-3.5 py-2.5 shadow-2xs transition-colors'>
      <div className='flex items-center gap-2.5 min-w-0 flex-1'>
        <FileIcon className='size-4 shrink-0 text-primary' />
        <div className='flex flex-col min-w-0 flex-1 text-left'>
          <span className='truncate text-xs font-semibold text-foreground leading-tight'>
            {file.name}
          </span>
          <span className='text-[10px] text-muted-foreground mt-0.5'>
            {file.size}
          </span>
        </div>
      </div>

      <button
        type='button'
        onClick={(e) => onRemove(e)}
        disabled={disabled}
        className='shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors cursor-pointer disabled:cursor-not-allowed'
        title='Hapus file'
      >
        <X className='size-4' />
      </button>
    </div>
  );
}
