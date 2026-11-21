'use client';

import * as React from 'react';
import { SurfaceCard } from '@/components/ui/surface-card';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FilterDatePicker } from '@/components/features/kanban/filter/inputs/filter-date-picker';
import {
  FilterSelectInput,
  type FilterSelectOption,
} from '@/components/features/kanban/filter/inputs/filter-select-input';
import { PELANGGAN_CATEGORY_CHIPS } from '@/constants/pelanggan-constants';
import { currentMonthRange } from '@/lib/date-utils';
import { useSquadListQuery, useUserListQuery } from '@/hooks/queries';
import type { AnalyticsParams } from '@/types/analytics.types';

interface AnalyticsFilterBarProps {
  value: AnalyticsParams;
  onChange: (next: AnalyticsParams) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='flex min-w-0 flex-col gap-1'>
      <Label className='text-[11px] text-secondary-foreground'>{label}</Label>
      {children}
    </div>
  );
}

export function AnalyticsFilterBar({ value, onChange }: AnalyticsFilterBarProps) {
  const { data: users } = useUserListQuery({ role: 'sales', limit: 100 });
  const { data: squads } = useSquadListQuery({ limit: 100 });
  const set = (patch: AnalyticsParams) => onChange({ ...value, ...patch });
  const pick = (v: string) => v || undefined;

  const salesOptions: FilterSelectOption[] = [
    { value: '', label: 'Semua Sales' },
    ...(users?.data?.map((u) => ({ value: u.id_user, label: u.nama })) ?? []),
  ];

  const squadOptions: FilterSelectOption[] = [
    { value: '', label: 'Semua Squad' },
    ...(squads?.data?.map((s) => ({ value: s.id_squad, label: s.nama_squad })) ?? []),
  ];

  const tipeOptions: FilterSelectOption[] = [
    { value: '', label: 'Semua Tipe' },
    ...PELANGGAN_CATEGORY_CHIPS.map((c) => ({ value: c.id, label: c.label })),
  ];

  return (
    <SurfaceCard>
      <CardContent className='grid grid-cols-1 gap-3 p-3.5 sm:grid-cols-2 sm:p-4 lg:grid-cols-6'>
        <Field label='Dari Tanggal'>
          <FilterDatePicker
            aria-label='Dari Tanggal'
            value={value.from ?? ''}
            onChange={(v) => set({ from: pick(v) })}
            groupClassName='h-10 sm:h-9 rounded-md'
          />
        </Field>
        <Field label='Sampai Tanggal'>
          <FilterDatePicker
            aria-label='Sampai Tanggal'
            value={value.to ?? ''}
            onChange={(v) => set({ to: pick(v) })}
            groupClassName='h-10 sm:h-9 rounded-md'
          />
        </Field>
        <Field label='Sales'>
          <FilterSelectInput
            aria-label='Sales'
            options={salesOptions}
            value={value.id_user ?? ''}
            onChange={(v) => set({ id_user: pick(v) })}
            placeholder='Semua Sales'
            triggerClassName='h-10 sm:h-9 rounded-md'
          />
        </Field>
        <Field label='Squad'>
          <FilterSelectInput
            aria-label='Squad'
            options={squadOptions}
            value={value.id_squad ?? ''}
            onChange={(v) => set({ id_squad: pick(v) })}
            placeholder='Semua Squad'
            triggerClassName='h-10 sm:h-9 rounded-md'
          />
        </Field>
        <Field label='Tipe Pelanggan'>
          <FilterSelectInput
            aria-label='Tipe Pelanggan'
            options={tipeOptions}
            value={value.tipe_outlet ?? ''}
            onChange={(v) => set({ tipe_outlet: pick(v) })}
            placeholder='Semua Tipe'
            triggerClassName='h-10 sm:h-9 rounded-md'
          />
        </Field>
        <div className='flex min-w-0 items-end'>
          <Button
            variant='outline'
            className='h-10 sm:h-9 w-full rounded-md text-xs font-semibold cursor-pointer border-border bg-card shadow-none hover:bg-muted/50'
            onClick={() => onChange(currentMonthRange())}
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </SurfaceCard>
  );
}
