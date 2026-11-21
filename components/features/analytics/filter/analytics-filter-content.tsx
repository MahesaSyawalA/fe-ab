'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { FilterDatePicker } from '@/components/features/kanban/filter/inputs/filter-date-picker';
import {
  FilterSelectInput,
  type FilterSelectOption,
} from '@/components/features/kanban/filter/inputs/filter-select-input';
import { currentMonthRange } from '@/lib/date-utils';
import type { AnalyticsParams } from '@/types/analytics.types';

export interface AnalyticsFilterFieldsProps {
  draft: AnalyticsParams;
  setDraft: React.Dispatch<React.SetStateAction<AnalyticsParams>>;
  salesOptions: FilterSelectOption[];
  squadOptions: FilterSelectOption[];
  tipeOptions: FilterSelectOption[];
}

export function countActiveAnalyticsFilters(params: AnalyticsParams): number {
  return [params.id_user, params.id_squad, params.tipe_outlet].filter(Boolean).length;
}

export function useAnalyticsFilterDraft(
  value: AnalyticsParams,
  onApply: (nextFilter: AnalyticsParams) => void,
  onClose: () => void,
) {
  const [draft, setDraft] = React.useState<AnalyticsParams>(value);

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleReset = () => {
    setDraft(currentMonthRange());
  };

  return {
    draft,
    setDraft,
    activeCount: countActiveAnalyticsFilters(draft),
    handleApply,
    handleReset,
  };
}

export function AnalyticsFilterFields({
  draft,
  setDraft,
  salesOptions,
  squadOptions,
  tipeOptions,
}: AnalyticsFilterFieldsProps) {
  const pick = (v: string) => v || undefined;

  return (
    <div className='flex flex-col gap-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <FilterDatePicker
          label='Dari Tanggal'
          aria-label='Dari Tanggal'
          value={draft.from ?? ''}
          onChange={(v) => setDraft((prev) => ({ ...prev, from: pick(v) }))}
          groupClassName='h-10 sm:h-9 rounded-md'
        />
        <FilterDatePicker
          label='Sampai Tanggal'
          aria-label='Sampai Tanggal'
          value={draft.to ?? ''}
          onChange={(v) => setDraft((prev) => ({ ...prev, to: pick(v) }))}
          groupClassName='h-10 sm:h-9 rounded-md'
        />
      </div>

      <FilterSelectInput
        label='Sales'
        aria-label='Sales'
        options={salesOptions}
        value={draft.id_user ?? ''}
        onChange={(v) => setDraft((prev) => ({ ...prev, id_user: pick(v) }))}
        placeholder='Semua Sales'
        triggerClassName='h-10 sm:h-9 rounded-md'
      />

      <FilterSelectInput
        label='Squad'
        aria-label='Squad'
        options={squadOptions}
        value={draft.id_squad ?? ''}
        onChange={(v) => setDraft((prev) => ({ ...prev, id_squad: pick(v) }))}
        placeholder='Semua Squad'
        triggerClassName='h-10 sm:h-9 rounded-md'
      />

      <FilterSelectInput
        label='Tipe Pelanggan'
        aria-label='Tipe Pelanggan'
        options={tipeOptions}
        value={draft.tipe_outlet ?? ''}
        onChange={(v) => setDraft((prev) => ({ ...prev, tipe_outlet: pick(v) }))}
        placeholder='Semua Tipe'
        triggerClassName='h-10 sm:h-9 rounded-md'
      />
    </div>
  );
}

export function AnalyticsFilterFooterActions({
  onReset,
  onApply,
}: {
  onReset: () => void;
  onApply: () => void;
}) {
  return (
    <>
      <Button
        type='button'
        variant='outline'
        onClick={onReset}
        className='h-10 sm:h-9 w-full rounded-md text-xs font-semibold cursor-pointer border-border bg-card shadow-none hover:bg-muted/50'
      >
        Reset
      </Button>
      <Button
        type='button'
        onClick={onApply}
        className='h-10 sm:h-9 w-full rounded-md text-xs font-semibold text-white shadow-sm bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary transition-all cursor-pointer'
      >
        Terapkan Filter
      </Button>
    </>
  );
}
