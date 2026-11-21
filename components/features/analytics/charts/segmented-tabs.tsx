'use client';

import * as React from 'react';
import { Tabs } from '@heroui/react';
import { cn } from '@/lib/utils';

export interface SegmentedTabOption<T extends string> {
  id: T;
  label: string;
}

interface SegmentedTabsProps<T extends string> {
  ariaLabel: string;
  options: [SegmentedTabOption<T>, SegmentedTabOption<T>];
  value: T;
  onChange: (next: T) => void;
}

const TABS_LIST_CLASS = [
  'relative z-10 grid w-full min-w-0 grid-cols-2 items-center bg-transparent p-0',
  '**:data-[slot=tabs-tab]:relative',
  '**:data-[slot=tabs-tab]:z-10',
  '**:data-[slot=tabs-tab]:h-8',
  '**:data-[slot=tabs-tab]:w-full',
  '**:data-[slot=tabs-tab]:shrink-0',
  '**:data-[slot=tabs-tab]:whitespace-nowrap',
  '**:data-[slot=tabs-tab]:rounded-md',
  '**:data-[slot=tabs-tab]:px-3',
  '**:data-[slot=tabs-tab]:text-xs',
  '**:data-[slot=tabs-tab]:sm:text-sm',
  '**:data-[slot=tabs-tab]:font-semibold',
  '**:data-[slot=tabs-tab]:text-muted-foreground',
  '**:data-[slot=tabs-tab]:opacity-100',
  '**:data-[slot=tabs-tab]:transition-colors',
  '**:data-[slot=tabs-tab]:data-[hovered=true]:not-data-[selected=true]:text-foreground',
  '**:data-[slot=tabs-tab]:data-[selected=true]:text-white',
].join(' ');

export function SegmentedTabs<T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
}: SegmentedTabsProps<T>) {
  const isSecondSelected = value === options[1].id;

  return (
    <div className='relative isolate inline-block w-fit shrink-0 rounded-md border border-border/60 bg-muted/60 p-1'>
      <span
        aria-hidden='true'
        className={cn(
          'pointer-events-none absolute top-1 bottom-1 left-1 z-0 w-[calc(50%-4px)] rounded-md bg-primary shadow-xs transition-transform duration-200 ease-out',
          isSecondSelected ? 'translate-x-full' : 'translate-x-0',
        )}
      />
      <Tabs
        selectedKey={value}
        onSelectionChange={(key) => onChange(String(key) as T)}
        className='w-full gap-0'
      >
        <Tabs.List aria-label={ariaLabel} className={TABS_LIST_CLASS}>
          {options.map((opt) => (
            <Tabs.Tab key={opt.id} id={opt.id}>
              {opt.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    </div>
  );
}
