'use client';

import * as React from 'react';
import { Camera, File, FileText, Mic, UploadCloud, X } from 'lucide-react';
import { Label } from '@heroui/react';
import { TriangleExclamation } from '@gravity-ui/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { detectFileType, EvidenceFileState } from '../types';

const EVIDENCE_ICON = {
  foto: Camera,
  audio: Mic,
  teks: FileText,
  dokumen: FileText,
} as const;

export interface StageFileInputProps {
  label?: string;
  isRequired?: boolean;
  value: EvidenceFileState | null;
  onChange: (file: EvidenceFileState | null) => void;
  isInvalid?: boolean;
  errorMessage?: string;
  accept?: string;
  maxSizeInMb?: number;
  disabled?: boolean;
  className?: string;
}

export function StageFileInput({
  label,
  isRequired,
  value,
  onChange,
  isInvalid,
  errorMessage,
  accept = '.pdf,.docx,.doc,.jpg,.jpeg,.png,.xls,.xlsx,.txt,.m4a,.mp3',
  maxSizeInMb = 10,
  disabled,
  className,
}: StageFileInputProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [internalError, setInternalError] = React.useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    const sizeInKb = bytes / 1024;
    return sizeInKb > 1024
      ? `${(sizeInKb / 1024).toFixed(1)} MB`
      : `${Math.round(sizeInKb)} KB`;
  };

  const handleProcessFile = (file: File) => {
    if (disabled) return;

    // 1. Validasi Batas Ukuran File (Maksimal 10MB)
    const maxSizeBytes = maxSizeInMb * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setInternalError(`Ukuran file melebihi batas maksimal ${maxSizeInMb}MB (${formatFileSize(file.size)})`);
      return;
    }

    // 2. Validasi Ekstensi File
    if (accept && accept !== '*') {
      const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const allowed = accept
        .split(',')
        .map((item) => item.trim().toLowerCase());
      const isAccepted = allowed.some((ext) => {
        if (ext.startsWith('.')) return ext === extension;
        if (ext.endsWith('/*')) {
          const typePrefix = ext.slice(0, -2);
          return file.type.startsWith(typePrefix);
        }
        return file.type === ext;
      });

      if (!isAccepted) {
        setInternalError('Format file tidak didukung. Harap unggah format yang sesuai.');
        return;
      }
    }

    // Bersihkan error jika file valid
    setInternalError(null);

    // Update state file
    onChange({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      rawFile: file,
    });
  };

  const handleNativeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setInternalError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleProcessFile(droppedFile);
    }
  };

  const displayError = internalError || (isInvalid ? errorMessage : undefined);
  const hasError = Boolean(displayError);

  const FileIcon = value
    ? EVIDENCE_ICON[detectFileType(value.name)] || File
    : FileText;

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      {label && (
        <Label
          isRequired={isRequired}
          className='text-sm font-medium text-foreground'
        >
          {label}
        </Label>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={inputRef}
        type='file'
        accept={accept}
        disabled={disabled}
        onChange={handleNativeInputChange}
        className='hidden'
      />

      {value ? (
        /* State File Terunggah (Card Preview Sesuai Figma) */
        <div className='flex items-center justify-between gap-3 rounded-md border border-border/80 bg-card px-3.5 py-2.5 shadow-2xs transition-colors'>
          <div className='flex items-center gap-2.5 min-w-0 flex-1'>
            <FileIcon className='size-4 shrink-0 text-primary' />
            <div className='flex flex-col min-w-0 flex-1 text-left'>
              <span className='truncate text-xs font-semibold text-foreground leading-tight'>
                {value.name}
              </span>
              <span className='text-[10px] text-muted-foreground mt-0.5'>
                {value.size}
              </span>
            </div>
          </div>

          <button
            type='button'
            onClick={handleRemoveFile}
            disabled={disabled}
            className='shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors cursor-pointer disabled:cursor-not-allowed'
            title='Hapus file'
          >
            <X className='size-4' />
          </button>
        </div>
      ) : (
        /* State Kosong (Dropzone UI Sesuai Desain Figma) */
        <div
          role='button'
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl border-2 border-dashed text-center transition-all duration-150 select-none outline-none',
            disabled
              ? 'border-slate-200 dark:border-slate-800 bg-muted/20 opacity-60 cursor-not-allowed'
              : 'cursor-pointer',
            isDragging
              ? 'border-primary bg-primary/5 ring-2 ring-primary/20 scale-[1.005]'
              : hasError
                ? 'border-rose-400 bg-rose-50/40 text-rose-700'
                : 'border-slate-300 dark:border-slate-600 bg-card hover:border-primary/60 hover:bg-muted/10',
          )}
        >
          {/* Ikon Tengah: Cloud dengan Panah ke Atas Sesuai Desain */}
          <UploadCloud
            className={cn(
              'size-8 mb-2 transition-colors',
              isDragging ? 'text-primary' : hasError ? 'text-rose-500' : 'text-muted-foreground/80',
            )}
            strokeWidth={1.5}
          />

          {/* Teks Utama */}
          <span className='text-xs sm:text-sm font-semibold text-foreground leading-tight'>
            Choose a file or drag & drop it here
          </span>

          {/* Teks Format & Limit Ukuran */}
          <span className='text-[10px] sm:text-[11px] text-muted-foreground mt-1'>
            .pdf, .docx, .jpg, .jpeg, .png formats, up to {maxSizeInMb}MB
          </span>

          {/* Tombol Browse File */}
          <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            className='mt-3 h-7 rounded-[8px] border-border/80 bg-card px-3.5 text-xs font-semibold text-foreground hover:bg-muted shadow-2xs cursor-pointer'
          >
            Browse File
          </Button>
        </div>
      )}

      {/* Pesan Error Validasi */}
      {displayError && (
        <div className='mt-1 text-xs text-destructive flex items-center gap-1.5'>
          <TriangleExclamation width={14} height={14} className='shrink-0' />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}

