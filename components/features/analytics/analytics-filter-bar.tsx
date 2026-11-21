'use client';

import * as React from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Calendar, ChevronDown, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FilterSelectOption } from '@/components/features/kanban/filter/inputs/filter-select-input';
import { PELANGGAN_CATEGORY_CHIPS } from '@/constants/pelanggan-constants';
import { currentMonthRange } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { useSquadListQuery, useUserListQuery } from '@/hooks/queries';
import type { AnalyticsParams } from '@/types/analytics.types';
import { AnalyticsFilterDrawer } from './filter/analytics-filter-drawer';
import { countActiveAnalyticsFilters } from './filter/analytics-filter-content';

interface AnalyticsFilterBarProps {
  value: AnalyticsParams;
  onChange: (next: AnalyticsParams) => void;
}

export function formatPeriodLabel(from?: string, to?: string): string {
  const fallback = currentMonthRange();
  const startStr = from || fallback.from;
  const endStr = to || fallback.to;
  const start = parseISO(startStr);
  const end = parseISO(endStr);
  if (!isValid(start) || !isValid(end)) return 'Pilih Periode';
  if (start.getFullYear() === end.getFullYear()) {
    return `${format(start, 'd MMM', { locale: localeId })} – ${format(end, 'd MMM yyyy', { locale: localeId })}`;
  }
  return `${format(start, 'd MMM yyyy', { locale: localeId })} – ${format(end, 'd MMM yyyy', { locale: localeId })}`;
}

export function AnalyticsFilterBar({ value, onChange }: AnalyticsFilterBarProps) {
  const [filterOpen, setFilterOpen] = React.useState(false);
  const { data: users } = useUserListQuery({ role: 'sales', limit: 100 });
  const { data: squads } = useSquadListQuery({ limit: 100 });

  const salesOptions: FilterSelectOption[] = React.useMemo(
    () => [
      { value: '', label: 'Semua Sales' },
      ...(users?.data?.map((u) => ({ value: u.id_user, label: u.nama })) ?? []),
    ],
    [users?.data],
  );

  const squadOptions: FilterSelectOption[] = React.useMemo(
    () => [
      { value: '', label: 'Semua Squad' },
      ...(squads?.data?.map((s) => ({ value: s.id_squad, label: s.nama_squad })) ?? []),
    ],
    [squads?.data],
  );

  const tipeOptions: FilterSelectOption[] = React.useMemo(
    () => [
      { value: '', label: 'Semua Tipe' },
      ...PELANGGAN_CATEGORY_CHIPS.map((c) => ({ value: c.id, label: c.label })),
    ],
    [],
  );

  const activeCount = countActiveAnalyticsFilters(value);
  const periodLabel = formatPeriodLabel(value.from, value.to);

  const activeChips: { key: 'id_user' | 'id_squad' | 'tipe_outlet'; label: string }[] = [];
  if (value.id_user) {
    const label = salesOptions.find((o) => o.value === value.id_user)?.label ?? 'Sales';
    activeChips.push({ key: 'id_user', label });
  }
  if (value.id_squad) {
    const label = squadOptions.find((o) => o.value === value.id_squad)?.label ?? 'Squad';
    activeChips.push({ key: 'id_squad', label });
  }
  if (value.tipe_outlet) {
    const label = tipeOptions.find((o) => o.value === value.tipe_outlet)?.label ?? value.tipe_outlet;
    activeChips.push({ key: 'tipe_outlet', label });
  }

  const handleRemoveChip = (key: 'id_user' | 'id_squad' | 'tipe_outlet') => {
    onChange({ ...value, [key]: undefined });
  };

  const handleResetNonPeriod = () => {
    onChange({
      ...value,
      id_user: undefined,
      id_squad: undefined,
      tipe_outlet: undefined,
    });
  };

  return (
    <div className='flex w-full min-w-0 flex-col gap-2.5'>
      <div className='flex w-full min-w-0 items-center justify-between sm:justify-start gap-2.5'>
        <Button
          type='button'
          variant='outline'
          onClick={() => setFilterOpen(true)}
          className='h-10 min-w-0 flex-1 sm:flex-initial justify-between sm:justify-start gap-2 rounded-xl border-border bg-card px-3.5 text-xs sm:text-sm font-medium text-foreground shadow-2xs hover:bg-muted/40 cursor-pointer'
        >
          <span className='flex items-center gap-2 min-w-0'>
            <Calendar className='size-4 shrink-0 text-primary' />
            <span className='truncate'>{periodLabel}</span>
          </span>
          <ChevronDown className='size-4 shrink-0 text-muted-foreground' />
        </Button>

        <Button
          type='button'
          variant='outline'
          onClick={() => setFilterOpen(true)}
          className={cn(
            'relative h-10 shrink-0 gap-2 rounded-xl border-primary/15 bg-primary/8 px-3.5 text-xs sm:text-sm font-semibold text-primary shadow-none hover:bg-primary/15 hover:text-primary cursor-pointer transition-colors',
            activeCount > 0 && 'border-primary/30 bg-primary/12',
          )}
        >
          <Filter className='size-4 shrink-0' />
          <span>Filter</span>
          {activeCount > 0 && (
            <span className='absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white'>
              {activeCount}
            </span>
          )}
        </Button>
      </div>

      {activeChips.length > 0 && (
        <div className='flex flex-wrap items-center gap-1.5'>
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type='button'
              onClick={() => handleRemoveChip(chip.key)}
              className='inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/15 transition-colors cursor-pointer'
            >
              <span>{chip.label}</span>
              <X className='size-3 shrink-0' />
            </button>
          ))}
          <button
            type='button'
            onClick={handleResetNonPeriod}
            className='px-1.5 py-1 text-xs font-semibold text-primary hover:underline cursor-pointer'
          >
            Reset
          </button>
        </div>
      )}

      <AnalyticsFilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        value={value}
        onApply={onChange}
        salesOptions={salesOptions}
        squadOptions={squadOptions}
        tipeOptions={tipeOptions}
      />
    </div>
  );
}
