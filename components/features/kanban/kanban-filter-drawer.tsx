'use client';

import * as React from 'react';
import { Calendar } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { NativeSelect } from '@/components/ui/native-select';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { PRIORITY_CONFIG, PRIORITY_ORDER, SALES_OPTIONS } from '@/constants/kanban-constants';
import { cn } from '@/lib/utils';

export interface KanbanFilterState {
  stages: string[];
  priorities: string[];
  closingFrom: string;
  closingTo: string;
  minEstimate: string;
  maxEstimate: string;
  salesId: string;
}

export const INITIAL_KANBAN_FILTER: KanbanFilterState = {
  stages: [],
  priorities: [],
  closingFrom: '',
  closingTo: '',
  minEstimate: '',
  maxEstimate: '',
  salesId: '',
};

export function countActiveFilters(filter: KanbanFilterState): number {
  const { stages, priorities, ...scalars } = filter;
  return (
    stages.length + priorities.length + Object.values(scalars).filter(Boolean).length
  );
}

const FILTER_STAGE_OPTIONS = [
  { id: 'prospek', label: 'Prospek' },
  { id: 'kunjungan', label: 'Kunjungan' },
  { id: 'penawaran', label: 'Penawaran' },
  { id: 'negosiasi', label: 'Negosiasi' },
  { id: 'won', label: 'Won' },
  { id: 'lost', label: 'Lost' },
];

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

interface PillGroupProps {
  label: string;
  options: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}

function PillGroup({ label, options, selected, onToggle }: PillGroupProps) {
  return (
    <div className='flex flex-col gap-2'>
      <Label className='text-xs font-bold text-foreground'>{label}</Label>
      <div className='flex flex-wrap gap-2'>
        {options.map((option) => (
          <Button
            key={option.id}
            type='button'
            variant='outline'
            size='sm'
            onClick={() => onToggle(option.id)}
            className={cn(
              'h-8 rounded-full px-3.5 text-xs font-medium shadow-none transition-all cursor-pointer',
              selected.includes(option.id)
                ? 'border-[#F97316] bg-[#FFF7ED] font-semibold text-[#EA580C] hover:bg-[#FFEDD5] hover:text-[#EA580C]'
                : 'border-border bg-card text-muted-foreground hover:bg-muted/40 hover:text-foreground',
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

interface KanbanFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: KanbanFilterState;
  onApply: (nextFilter: KanbanFilterState) => void;
}

export function KanbanFilterDrawer({
  open,
  onOpenChange,
  value,
  onApply,
}: KanbanFilterDrawerProps) {
  const [draft, setDraft] = React.useState<KanbanFilterState>(value);

  React.useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const toggleIn = (key: 'stages' | 'priorities') => (id: string) =>
    setDraft((prev) => ({
      ...prev,
      [key]: prev[key].includes(id)
        ? prev[key].filter((item) => item !== id)
        : [...prev[key], id],
    }));

  const setField = (key: ScalarKey | 'salesId', val: string) =>
    setDraft((prev) => ({ ...prev, [key]: val }));

  const handleApply = () => {
    onApply(draft);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent className='mx-auto max-w-lg rounded-t-3xl bg-card'>
        <DrawerHeader className='px-5 pt-2 pb-2 text-left'>
          <DrawerTitle className='text-base font-bold text-foreground'>Filter Tiket</DrawerTitle>
          <DrawerDescription className='text-xs text-muted-foreground'>
            {countActiveFilters(draft)} filter dipilih
          </DrawerDescription>
        </DrawerHeader>

        <div className='flex flex-col gap-4 overflow-y-auto px-5 py-3'>
          <PillGroup label='Tahap' options={FILTER_STAGE_OPTIONS} selected={draft.stages} onToggle={toggleIn('stages')} />
          <PillGroup label='Prioritas' options={FILTER_PRIORITY_OPTIONS} selected={draft.priorities} onToggle={toggleIn('priorities')} />

          <div className='flex flex-col gap-2'>
            <Label className='text-xs font-bold text-foreground'>Target Closing</Label>
            <div className='grid grid-cols-2 gap-3'>
              {DATE_FIELDS.map(({ key, label }) => (
                <div key={key} className='flex flex-col gap-1'>
                  <span className='text-[11px] text-muted-foreground'>{label}</span>
                  <InputGroup className='h-10 rounded-xl border-border bg-card shadow-none'>
                    <InputGroupAddon align='inline-start' className='gap-2 pl-3 pr-1 text-muted-foreground'>
                      <Calendar className='size-3.5' />
                      <Separator orientation='vertical' className='h-4' />
                    </InputGroupAddon>
                    <InputGroupInput
                      value={draft[key]}
                      onChange={(e) => setField(key, e.target.value)}
                      placeholder='Default'
                      className='text-xs'
                    />
                  </InputGroup>
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
                    value={draft[key]}
                    onChange={(e) => setField(key, e.target.value)}
                    placeholder='Default'
                    className='h-10 rounded-xl border-border bg-card px-3 text-xs shadow-none'
                  />
                </div>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs font-bold text-foreground'>Sales</Label>
            <span className='text-[11px] text-muted-foreground'>Pilih sales</span>
            <NativeSelect
              value={draft.salesId}
              onChange={(e) => setField('salesId', e.target.value)}
              className='border-border'
            >
              <option value=''>Default</option>
              {SALES_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </NativeSelect>
          </div>
        </div>

        <DrawerFooter className='grid grid-cols-2 gap-3 px-5 pt-2 pb-6'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setDraft(INITIAL_KANBAN_FILTER)}
            className='h-11 rounded-xl text-xs font-semibold shadow-none cursor-pointer'
          >
            Reset
          </Button>
          <Button type='button' onClick={handleApply} className='h-11 rounded-xl text-xs font-semibold cursor-pointer'>
            Terapkan Filter
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
