'use client';

import * as React from 'react';
import { Label } from '@heroui/react';
import { StageTextAreaInput } from '@/components/features/kanban/stage-drawer/inputs/stage-text-area-input';
import { cn } from '@/lib/utils';

export const LOST_REASON_OPTIONS = [
  'Harga terlalu tinggi',
  'Memilih kompetitor',
  'Anggaran dibatalkan',
  'Spesifikasi tidak sesuai',
  'Lainnya',
] as const;

export const LOST_REASON_MAX_LENGTH = 1000;

export function formatLostReason(category: string, detail: string): string {
  const cleanCategory = category.trim();
  const cleanDetail = detail.trim();
  if (cleanCategory && cleanDetail) {
    return `[${cleanCategory}] ${cleanDetail}`;
  }
  return cleanDetail || cleanCategory;
}

export function parseLostReason(raw?: string | null): {
  category: string | null;
  detail: string;
} {
  if (!raw) return { category: null, detail: '' };
  const trimmed = raw.trim();
  const match = trimmed.match(/^\[([^\]]+)\]\s*([\s\S]*)$/);
  if (match) {
    return {
      category: match[1]?.trim() || null,
      detail: match[2]?.trim() || '',
    };
  }
  return { category: null, detail: trimmed };
}

interface LostReasonFieldsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  detail: string;
  onDetailChange: (detail: string) => void;
  touched?: boolean;
  onTouchedChange?: (touched: boolean) => void;
}

export function LostReasonFields({
  selectedCategory,
  onCategoryChange,
  detail,
  onDetailChange,
  touched = false,
  onTouchedChange,
}: LostReasonFieldsProps) {
  const detailTrimmed = detail.trim();
  const showCategoryError = touched && !selectedCategory;
  const showDetailError = touched && detailTrimmed.length === 0;

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-col gap-2'>
        <Label isRequired className='text-xs sm:text-sm font-semibold text-foreground'>
          Alasan Lost
        </Label>
        <div
          role='radiogroup'
          aria-label='Kategori Alasan Lost'
          className='flex flex-wrap gap-2'
        >
          {LOST_REASON_OPTIONS.map((option) => {
            const isSelected = selectedCategory === option;
            return (
              <button
                key={option}
                type='button'
                role='radio'
                aria-checked={isSelected}
                onClick={() => {
                  onCategoryChange(option);
                  onTouchedChange?.(true);
                }}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer select-none',
                  isSelected
                    ? 'border-orange-400 bg-orange-50/60 text-orange-600 font-semibold dark:bg-orange-950/30 dark:text-orange-400'
                    : 'border-border bg-card text-secondary-foreground hover:border-slate-300 hover:bg-muted/40',
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
        {showCategoryError && (
          <span className='text-[11px] text-destructive'>
            Pilih salah satu kategori alasan lost.
          </span>
        )}
      </div>

      <div className='flex flex-col gap-1'>
        <StageTextAreaInput
          rows={4}
          value={detail}
          onChange={(val) => {
            onDetailChange(val.slice(0, LOST_REASON_MAX_LENGTH));
            onTouchedChange?.(true);
          }}
          isInvalid={showDetailError}
          errorMessage={
            showDetailError ? 'Penjelasan alasan lost wajib diisi.' : undefined
          }
          placeholder='Jelaskan alasan prospek ini gagal closing (kompetitor, harga, anggaran, dll)...'
          aria-label='Penjelasan Alasan Lost'
          inputClassName='min-h-[104px] rounded-xl'
        />
        <div className='flex justify-end text-[10px] text-muted-foreground pr-1'>
          {detail.length}/{LOST_REASON_MAX_LENGTH} Characters
        </div>
      </div>
    </div>
  );
}
