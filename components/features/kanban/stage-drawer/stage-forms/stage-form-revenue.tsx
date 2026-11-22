'use client';

import * as React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Label } from '@heroui/react';
import { cn } from '@/lib/utils';
import { LostReasonFields } from '@/components/features/kanban/shared/lost-reason-fields';
import { StageCurrencyInput } from '../inputs';

export interface StageFormRevenueProps {
  statusClosing: 'won' | 'lost';
  onStatusClosingChange: (val: 'won' | 'lost') => void;
  realisasiRevenue: string;
  onRealisasiRevenueChange: (val: string) => void;
  lostReasonCategory: string;
  onLostReasonCategoryChange: (val: string) => void;
  lostReasonDetail: string;
  onLostReasonDetailChange: (val: string) => void;
  lostReasonTouched?: boolean;
  onLostReasonTouchedChange?: (val: boolean) => void;
}

export function StageFormRevenue({
  statusClosing,
  onStatusClosingChange,
  realisasiRevenue,
  onRealisasiRevenueChange,
  lostReasonCategory,
  onLostReasonCategoryChange,
  lostReasonDetail,
  onLostReasonDetailChange,
  lostReasonTouched,
  onLostReasonTouchedChange,
}: StageFormRevenueProps) {
  return (
    <div className='flex flex-col gap-3'>

      <div className='flex flex-col gap-1.5'>
        <Label isRequired className='text-sm font-medium text-foreground'>Hasil Penawaran</Label>
        <div
          role='radiogroup'
          aria-label='Hasil Penawaran'
          className='flex flex-col gap-2 w-full'
        >

          <div
            role='radio'
            aria-checked={statusClosing === 'won'}
            tabIndex={0}
            onClick={() => onStatusClosingChange('won')}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onStatusClosingChange('won');
              }
            }}
            className={cn(
              'flex items-center justify-between gap-2.5 sm:gap-3 py-2 px-3 sm:py-2.5 sm:px-3.5 min-h-[52px] rounded-xl cursor-pointer select-none border transition-colors duration-150 outline-none shadow-2xs',
              statusClosing === 'won'
                ? 'border-emerald-500 bg-emerald-50/25 ring-1 ring-emerald-500'
                : 'border-border/80 hover:border-slate-300 bg-card',
            )}
          >
            <div className='flex items-center gap-2.5 sm:gap-3 min-w-0'>
              <div className='size-8.5 sm:size-9 rounded-full bg-[#E8FAF0] dark:bg-emerald-950/40 flex items-center justify-center shrink-0 text-[#22C55E]'>
                <CheckCircle2 className='size-4.5 sm:size-5 text-[#22C55E]' strokeWidth={2.2} />
              </div>
              <div className='flex flex-col gap-0.5 text-left min-w-0'>
                <span className='text-xs sm:text-sm font-bold text-foreground leading-tight'>
                  WON
                </span>
                <span className='text-[10px] sm:text-xs text-muted-foreground leading-snug'>
                  Penawaran disetujui. Lanjut input Purchase Order.
                </span>
              </div>
            </div>

            <div
              className={cn(
                'size-4.5 sm:size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-150',
                statusClosing === 'won'
                  ? 'border-emerald-500 bg-white dark:bg-card'
                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-card',
              )}
            >
              <div
                className={cn(
                  'size-2 sm:size-2.5 rounded-full transition-transform duration-150',
                  statusClosing === 'won'
                    ? 'scale-100 bg-emerald-500'
                    : 'scale-0 bg-transparent',
                )}
              />
            </div>
          </div>

          <div
            role='radio'
            aria-checked={statusClosing === 'lost'}
            tabIndex={0}
            onClick={() => onStatusClosingChange('lost')}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onStatusClosingChange('lost');
              }
            }}
            className={cn(
              'flex items-center justify-between gap-2.5 sm:gap-3 py-2 px-3 sm:py-2.5 sm:px-3.5 min-h-[52px] rounded-xl cursor-pointer select-none border transition-colors duration-150 outline-none shadow-2xs',
              statusClosing === 'lost'
                ? 'border-rose-500 bg-rose-50/25 ring-1 ring-rose-500'
                : 'border-border/80 hover:border-slate-300 bg-card',
            )}
          >
            <div className='flex items-center gap-2.5 sm:gap-3 min-w-0'>
              <div className='size-8.5 sm:size-9 rounded-full bg-[#FEECEC] dark:bg-rose-950/40 flex items-center justify-center shrink-0 text-[#EF4444]'>
                <XCircle className='size-4.5 sm:size-5 text-[#EF4444]' strokeWidth={2.2} />
              </div>
              <div className='flex flex-col gap-0.5 text-left min-w-0'>
                <span className='text-xs sm:text-sm font-bold text-foreground leading-tight'>
                  LOST
                </span>
                <span className='text-[10px] sm:text-xs text-muted-foreground leading-snug'>
                  Deal batal. Wajib isi alasan kalah.
                </span>
              </div>
            </div>

            <div
              className={cn(
                'size-4.5 sm:size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-150',
                statusClosing === 'lost'
                  ? 'border-rose-500 bg-white dark:bg-card'
                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-card',
              )}
            >
              <div
                className={cn(
                  'size-2 sm:size-2.5 rounded-full transition-transform duration-150',
                  statusClosing === 'lost'
                    ? 'scale-100 bg-rose-500'
                    : 'scale-0 bg-transparent',
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {statusClosing === 'lost' && (
        <div className='rounded-xl border border-rose-200/80 bg-rose-50/30 p-3 dark:border-rose-900/50 dark:bg-rose-950/15'>
          <LostReasonFields
            selectedCategory={lostReasonCategory}
            onCategoryChange={onLostReasonCategoryChange}
            detail={lostReasonDetail}
            onDetailChange={onLostReasonDetailChange}
            touched={lostReasonTouched}
            onTouchedChange={onLostReasonTouchedChange}
          />
        </div>
      )}

      <StageCurrencyInput
        label='Nilai Revenue'
        name='realisasiRevenue'
        isRequired
        value={realisasiRevenue}
        onChange={onRealisasiRevenueChange}
        placeholder='45.000.000'
        prefix='RP'
        prefixClassName='text-primary font-bold'
      />
    </div>
  );
}
