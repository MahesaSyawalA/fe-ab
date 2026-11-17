'use client';

import * as React from 'react';
import { Trash2, UploadCloud } from 'lucide-react';
import { Label, toast } from '@heroui/react';
import { TriangleExclamation } from '@gravity-ui/icons';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { cn } from '@/lib/utils';
import { validateAllowedFile } from '@/lib/file-validation';
import { PelangganFilePreviewCard } from './pelanggan-file-preview-card';

export interface PelangganFileInputProps {
  label?: string;
  helperText?: string;
  isRequired?: boolean;
  required?: boolean;
  value?: string;
  onChange?: (fileUrl: string, file?: File) => void;
  onRemove?: () => void;
  className?: string;
  accept?: string;
  maxSizeInMb?: number;
  disabled?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
}

export function PelangganFileInput({
  label,
  helperText,
  isRequired,
  required,
  value,
  onChange,
  onRemove,
  className,
  accept = 'image/*',
  maxSizeInMb = 10,
  disabled,
  isInvalid,
  errorMessage,
}: PelangganFileInputProps) {
  const isReq = isRequired ?? required;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showConfirmRemove, setShowConfirmRemove] = React.useState(false);
  const displayError = error || errorMessage;
  const invalid = isInvalid || Boolean(displayError);

  const handleProcessFile = (file: File) => {
    if (disabled) return;

    const validation = validateAllowedFile(file, {
      maxSizeBytes: maxSizeInMb * 1024 * 1024,
      category: 'image-only',
    });

    if (!validation.isValid) {
      const msg = validation.errorMessage || 'Berkas foto tidak valid';
      setError(msg);
      toast.danger('Berkas Tidak Valid', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            {msg}
          </span>
        ),
      });
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onChange?.(result, file);
    };
    reader.readAsDataURL(file);
  };

  const handleNativeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
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
    const relatedTarget = e.relatedTarget as Node | null;
    if (e.currentTarget.contains(relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmRemove(true);
  };

  const handleConfirmRemove = () => {
    setError(null);
    onChange?.('', undefined);
    onRemove?.();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setShowConfirmRemove(false);
  };

  return (
    <div className={cn('flex w-full min-w-0 flex-col gap-1.5', className)}>
      {label && (
        <Label
          isRequired={isReq}
          className='text-sm font-medium text-foreground'
        >
          {label}
        </Label>
      )}
      {helperText && (
        <p className='text-xs text-muted-foreground leading-relaxed mb-1'>
          {helperText}
        </p>
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
        <PelangganFilePreviewCard
          value={value}
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
              : error
                ? 'border-rose-400 bg-rose-50/40 text-rose-700'
                : 'border-slate-300 dark:border-slate-600 bg-card hover:border-primary/60 hover:bg-muted/10',
          )}
        >
          <UploadCloud
            className={cn(
              'size-8 mb-2 transition-colors',
              isDragging ? 'text-primary' : invalid ? 'text-rose-500' : 'text-muted-foreground/80',
            )}
            strokeWidth={1.5}
          />

          <span className='text-xs sm:text-sm font-semibold text-foreground leading-tight'>
            Choose a file or drag & drop it here
          </span>

          <span className='text-[10px] sm:text-[11px] text-muted-foreground mt-1'>
            .jpg, .jpeg, .png, .webp formats, up to {maxSizeInMb}MB
          </span>

          <Button
            type='button'
            variant='outline'
            size='sm'
            tabIndex={-1}
            disabled={disabled}
            className='mt-3.5 h-7 px-3 rounded-lg border border-border bg-card hover:bg-muted/60 text-xs font-medium text-foreground shadow-2xs pointer-events-none'
          >
            Browse File
          </Button>
        </div>
      )}

      {displayError && (
        <span className='text-xs text-destructive mt-1 font-medium flex items-center gap-1.5'>
          <TriangleExclamation width={14} height={14} className='shrink-0' />
          <span>{displayError}</span>
        </span>
      )}

      <ConfirmModal
        open={showConfirmRemove}
        onOpenChange={setShowConfirmRemove}
        title='Hapus Foto Outlet?'
        description='Foto outlet yang telah dipilih akan dihapus dari formulir.'
        confirmLabel='Hapus'
        cancelLabel='Batal'
        icon={<Trash2 className='size-7 text-rose-600' />}
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
}
