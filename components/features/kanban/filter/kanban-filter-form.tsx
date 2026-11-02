import * as React from 'react';
import {
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@heroui/react';
import { Label } from '@/components/ui/label';
import {
  FilterSelectInput,
  FilterSelectOption,
  FilterDatePicker,
} from './inputs';
import {
  JENIS_TAHAP_OPTIONS,
  PRIORITY_CONFIG,
  PRIORITY_ORDER,
  SALES_OPTIONS,
} from '@/constants/kanban-constants';
import {
  INITIAL_KANBAN_FILTER,
  KanbanFilterState,
  countActiveFilters,
} from './filter-state';
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

interface KanbanFilterFormProps {
  value: KanbanFilterState;
  onApply: (nextFilter: KanbanFilterState) => void;
  onClose: () => void;
}

/** Dirender hanya saat drawer terbuka, sehingga draft selalu mulai dari filter aktif. */
export function KanbanFilterForm({ value, onApply, onClose }: KanbanFilterFormProps) {
  const [draft, setDraft] = React.useState<KanbanFilterState>(value);

  const toggleIn = (key: 'stages' | 'priorities') => (id: string) =>
    setDraft((prev) => ({
      ...prev,
      [key]: prev[key].includes(id)
        ? prev[key].filter((item) => item !== id)
        : [...prev[key], id],
    }));

  const setField = (key: ScalarKey | 'salesId', val: string) =>
    setDraft((prev) => ({ ...prev, [key]: val }));

  const salesOptions = React.useMemo<FilterSelectOption[]>(() => [
    { value: '', label: 'Default' },
    ...SALES_OPTIONS.map((s) => ({ value: s.id, label: s.name })),
  ], []);

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <>
      <DrawerHeader className='shrink-0 px-5 pt-2 pb-2 text-left border-b border-border/60 bg-card'>
        <DrawerTitle className='text-base font-bold text-foreground'>Filter Tiket</DrawerTitle>
        <DrawerDescription className='text-xs text-muted-foreground'>
          {countActiveFilters(draft)} filter dipilih
        </DrawerDescription>
      </DrawerHeader>

      <div className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-5 py-3 flex flex-col gap-4'>
        <PillGroup label='Tahap' options={JENIS_TAHAP_OPTIONS} selected={draft.stages} onToggle={toggleIn('stages')} />
        <PillGroup label='Prioritas' options={FILTER_PRIORITY_OPTIONS} selected={draft.priorities} onToggle={toggleIn('priorities')} />

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
                <Input
                  aria-label={label}
                  value={draft[key]}
                  onChange={(e) => setField(key, e.target.value)}
                  placeholder='Default'
                  className='h-10 rounded-xl border-border bg-card px-3 text-xs shadow-none'
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

      <DrawerFooter className='shrink-0 z-10 grid grid-cols-2 gap-3 px-5 py-3 border-t border-border/70 bg-card shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-4 sm:pb-3'>
        <Button
          type='button'
          variant='outline'
          onClick={() => setDraft(INITIAL_KANBAN_FILTER)}
          className='h-10 rounded-xl text-xs font-semibold shadow-none cursor-pointer'
        >
          Reset
        </Button>
        <Button type='button' onClick={handleApply} className='h-10 rounded-xl text-xs font-semibold cursor-pointer'>
          Terapkan Filter
        </Button>
      </DrawerFooter>
    </>
  );
}
