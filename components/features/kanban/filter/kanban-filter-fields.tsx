'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import {
  FilterSelectInput,
  FilterSelectOption,
  FilterDatePicker,
  FilterCurrencyInput,
} from './inputs';
import {
  JENIS_TAHAP_OPTIONS,
  PRIORITY_CONFIG,
  PRIORITY_ORDER,
  SALES_OPTIONS,
} from '@/constants/kanban-constants';
import { KanbanFilterState } from './filter-state';
import { PillGroup } from './pill-group';

const FILTER_PRIORITY_OPTIONS = PRIORITY_ORDER.slice()
  .reverse()
  .map((id) => ({ id, label: PRIORITY_CONFIG[id].formLabel }));

type ScalarKey = 'closingFrom' | 'closingTo' | 'minEstimate' | 'maxEstimate';

const DATE_FIELDS: { key: ScalarKey; label: string }[] = [
  { key: 'closingFrom', label: 'Dari' },
  { key: 'closingTo', label: 'Sampai' },
];

const ESTIMATE_FIELDS: { key: ScalarKey; label: string }[] = [
  { key: 'minEstimate', label: 'Minimum (Rp)' },
  { key: 'maxEstimate', label: 'Maksimum (Rp)' },
];

export interface KanbanFilterFieldsProps {
  draft: KanbanFilterState;
  setDraft: React.Dispatch<React.SetStateAction<KanbanFilterState>>;
}

export function KanbanFilterFields({ draft, setDraft }: KanbanFilterFieldsProps) {
  const toggleIn = (key: 'stages' | 'priorities') => (id: string) =>
    setDraft((prev) => ({
      ...prev,
      [key]: prev[key].includes(id)
        ? prev[key].filter((item) => item !== id)
        : [...prev[key], id],
    }));

  const setField = (key: ScalarKey | 'salesId', val: string) =>
    setDraft((prev) => ({ ...prev, [key]: val }));

  const salesOptions = React.useMemo<FilterSelectOption[]>(
    () => [
      { value: '', label: 'Default' },
      ...SALES_OPTIONS.map((s) => ({ value: s.id, label: s.name })),
    ],
    [],
  );

  return (
    <div className='flex flex-col gap-4'>
      <PillGroup
        label='Tahap'
        options={JENIS_TAHAP_OPTIONS}
        selected={draft.stages}
        onToggle={toggleIn('stages')}
      />
      <PillGroup
        label='Prioritas'
        options={FILTER_PRIORITY_OPTIONS}
        selected={draft.priorities}
        onToggle={toggleIn('priorities')}
      />

      <div className='flex flex-col gap-2'>
        <Label className='text-xs font-bold text-foreground'>Target Closing</Label>
        <div className='grid grid-cols-2 gap-3'>
          {DATE_FIELDS.map(({ key, label }) => (
            <div key={key} className='flex flex-col gap-1'>
              <span className='text-[11px] text-muted-foreground'>{label}</span>
              <FilterDatePicker
                aria-label={label}
                value={draft[key]}
                onChange={(val) => setField(key, val)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <Label className='text-xs font-bold text-foreground'>Estimasi Nilai</Label>
        <div className='grid grid-cols-2 gap-3'>
          {ESTIMATE_FIELDS.map(({ key, label }) => (
            <div key={key} className='flex flex-col gap-1'>
              <span className='text-[11px] text-muted-foreground'>{label}</span>
              <FilterCurrencyInput
                aria-label={label}
                value={draft[key]}
                onChange={(val) => setField(key, val)}
                placeholder='Default'
              />
            </div>
          ))}
        </div>
      </div>

      <FilterSelectInput
        label='Sales'
        hint='Pilih sales'
        value={draft.salesId}
        onChange={(val) => setField('salesId', val)}
        options={salesOptions}
      />
    </div>
  );
}

