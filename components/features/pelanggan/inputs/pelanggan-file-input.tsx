'use client';

import * as React from 'react';
import { UploadCloud, X } from 'lucide-react';
import { Label } from '@heroui/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
}: PelangganFileInputProps) {
  const isReq = isRequired ?? required;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleProcessFile = (file: File) => {
    if (disabled) return;

    // Validasi ukuran file (default 10MB)
    const maxSizeBytes = maxSizeInMb * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Ukuran file melebihi batas maksimal ${maxSizeInMb}MB`);
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

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    onRemove?.();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
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
        /* State File/Foto Terunggah (Preview Card) */
        <div className='relative mt-1 h-44 sm:h-52 md:h-60 w-full overflow-hidden rounded-xl border border-border bg-secondary/40'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt='Preview' className='size-full object-cover' />
          <Button
            type='button'
            variant='ghost'
            size='icon-xs'
            onClick={handleRemove}
            className='absolute top-2 right-2 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-white cursor-pointer'
            title='Hapus foto'
          >
            <X className='size-3.5' />
          </Button>
        </div>
      ) : (
        /* State Kosong (Dropzone UI Sesuai Kanban) */
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
          {/* Ikon Tengah: Cloud dengan Panah ke Atas */}
          <UploadCloud
            className={cn(
              'size-8 mb-2 transition-colors',
              isDragging ? 'text-primary' : error ? 'text-rose-500' : 'text-muted-foreground/80',
            )}
            strokeWidth={1.5}
          />

          {/* Teks Utama */}
          <span className='text-xs sm:text-sm font-semibold text-foreground leading-tight'>
            Choose a file or drag & drop it here
          </span>

          {/* Teks Format & Limit Ukuran */}
          <span className='text-[10px] sm:text-[11px] text-muted-foreground mt-1'>
            .jpg, .jpeg, .png, .webp formats, up to {maxSizeInMb}MB
          </span>

          {/* Tombol Browse File */}
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

      {error && (
        <span className='text-xs text-destructive mt-1 font-medium'>{error}</span>
      )}
    </div>
  );
}

