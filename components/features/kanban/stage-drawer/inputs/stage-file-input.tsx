'use client';

import * as React from 'react';
import { Trash2, UploadCloud } from 'lucide-react';
import { Label, toast } from '@heroui/react';
import { TriangleExclamation } from '@gravity-ui/icons';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { cn } from '@/lib/utils';
import { validateAllowedFile } from '@/lib/file-validation';
import type { EvidenceFileState } from '../types';
import { StageFilePreviewCard } from './stage-file-preview-card';

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
  accept = 'image/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt',
  maxSizeInMb = 10,
  disabled,
  className,
}: StageFileInputProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const [showConfirmRemove, setShowConfirmRemove] = React.useState(false);

  const formatFileSize = (bytes: number): string => {
    const sizeInKb = bytes / 1024;
    return sizeInKb > 1024
      ? `${(sizeInKb / 1024).toFixed(1)} MB`
      : `${Math.round(sizeInKb)} KB`;
  };

  const handleProcessFile = (file: File) => {
    if (disabled) return;

    const validation = validateAllowedFile(file, {
      maxSizeBytes: maxSizeInMb * 1024 * 1024,
      category: 'evidence',
    });

    if (!validation.isValid) {
      const msg = validation.errorMessage || 'Format berkas tidak didukung.';
      setInternalError(msg);
      toast.danger('Berkas Tidak Valid', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            {msg}
          </span>
        ),
      });
      return;
    }

    setInternalError(null);

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

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmRemove(true);
  };

  const handleConfirmRemove = () => {
    onChange(null);
    setInternalError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setShowConfirmRemove(false);
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

      <input
        ref={inputRef}
        type='file'
        accept={accept}
        disabled={disabled}
        onChange={handleNativeInputChange}
        className='hidden'
      />

      {value ? (
        <StageFilePreviewCard
          file={value}
          disabled={disabled}
          onRemove={handleRemoveClick}
        />
      ) : (
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
          <UploadCloud
            className={cn(
              'size-8 mb-2 transition-colors',
              isDragging ? 'text-primary' : hasError ? 'text-rose-500' : 'text-muted-foreground/80',
            )}
            strokeWidth={1.5}
          />

          <span className='text-xs sm:text-sm font-semibold text-foreground leading-tight'>
            Choose a file or drag & drop it here
          </span>

          <span className='text-[10px] sm:text-[11px] text-muted-foreground mt-1'>
            .pdf, .docx, .jpg, .jpeg, .png formats, up to {maxSizeInMb}MB
          </span>

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

      {displayError && (
        <div className='mt-1 text-xs text-destructive flex items-center gap-1.5'>
          <TriangleExclamation width={14} height={14} className='shrink-0' />
          <span>{displayError}</span>
        </div>
      )}

      <ConfirmModal
        open={showConfirmRemove}
        onOpenChange={setShowConfirmRemove}
        title='Hapus Berkas Bukti?'
        description={
          <>
            Berkas <strong className='font-semibold text-foreground'>{value?.name || 'bukti ini'}</strong> akan dihapus dari formulir aktivitas.
          </>
        }
        confirmLabel='Hapus'
        cancelLabel='Batal'
        icon={<Trash2 className='size-7 text-rose-600' />}
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
}
