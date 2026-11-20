'use client';

import * as React from 'react';
import { SurfaceCard } from '@/components/ui/surface-card';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { NativeSelect } from '@/components/ui/native-select';
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

/** Filter periode, sales, squad, dan tipe pelanggan. Reset mengembalikan periode ke bulan berjalan. */
export function AnalyticsFilterBar({ value, onChange }: AnalyticsFilterBarProps) {
  const { data: users } = useUserListQuery({ role: 'sales', limit: 100 });
  const { data: squads } = useSquadListQuery({ limit: 100 });
  const set = (patch: AnalyticsParams) => onChange({ ...value, ...patch });
  const pick = (v: string) => v || undefined;

  return (
    <SurfaceCard>
      <CardContent className='grid grid-cols-1 gap-3 p-3.5 sm:grid-cols-2 sm:p-4 lg:grid-cols-6'>
        <Field label='Dari tanggal'>
          <Input
            type='date'
            value={value.from ?? ''}
            max={value.to}
            onChange={(e) => set({ from: pick(e.target.value) })}
          />
        </Field>
        <Field label='Sampai tanggal'>
          <Input
            type='date'
            value={value.to ?? ''}
            min={value.from}
            onChange={(e) => set({ to: pick(e.target.value) })}
          />
        </Field>
        <Field label='Sales'>
          <NativeSelect value={value.id_user ?? ''} onChange={(e) => set({ id_user: pick(e.target.value) })}>
            <option value=''>Semua sales</option>
            {users?.data?.map((u) => (
              <option key={u.id_user} value={u.id_user}>
                {u.nama}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label='Squad'>
          <NativeSelect value={value.id_squad ?? ''} onChange={(e) => set({ id_squad: pick(e.target.value) })}>
            <option value=''>Semua squad</option>
            {squads?.data?.map((s) => (
              <option key={s.id_squad} value={s.id_squad}>
                {s.nama_squad}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label='Tipe pelanggan'>
          <NativeSelect
            value={value.tipe_outlet ?? ''}
            onChange={(e) => set({ tipe_outlet: pick(e.target.value) })}
          >
            <option value=''>Semua tipe</option>
            {PELANGGAN_CATEGORY_CHIPS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <div className='flex items-end'>
          <Button variant='outline' className='h-10 w-full' onClick={() => onChange(currentMonthRange())}>
            Reset
          </Button>
        </div>
      </CardContent>
    </SurfaceCard>
  );
}
