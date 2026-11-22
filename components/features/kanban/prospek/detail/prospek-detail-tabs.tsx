'use client';

import * as React from 'react';
import { Tabs } from '@heroui/react';
import { DetailTab } from '../types';

interface ProspekDetailTabsProps {
  active: DetailTab;
  onChange: (tab: DetailTab) => void;
  penawaranCount: number;
  riwayatCount: number;
  aktivitasCount: number;
}

export function ProspekDetailTabs({
  active,
  onChange,
  penawaranCount,
  riwayatCount,
  aktivitasCount,
}: ProspekDetailTabsProps) {
  const tabs: { id: DetailTab; label: string }[] = [
    { id: 'info', label: 'Info' },
    { id: 'penawaran', label: `Penawaran (${penawaranCount})` },
    { id: 'riwayat', label: `Riwayat (${riwayatCount})` },
    { id: 'aktivitas', label: `Aktivitas (${aktivitasCount})` },
  ];

  return (
    <Tabs
      selectedKey={active}
      onSelectionChange={(key) => onChange(key as DetailTab)}
      variant='secondary'
      className='w-full'
    >
      <Tabs.List
        aria-label='Detail Prospek Tabs'
        className='grid w-full grid-cols-4 border-b border-border/70 bg-muted/20 p-0 rounded-none h-12'
      >
        {tabs.map((tab) => (
          <Tabs.Tab
            key={tab.id}
            id={tab.id}
            className='relative flex items-center justify-center h-full rounded-none px-1 sm:px-2 py-0 whitespace-nowrap text-[11px] sm:text-sm font-semibold transition-colors text-muted-foreground hover:bg-muted/40 hover:text-foreground data-[selected=true]:text-primary cursor-pointer'
          >
            {tab.label}
            <Tabs.Indicator className='absolute top-auto -bottom-[1px] w-full h-0.5 flex justify-center bg-transparent shadow-none pointer-events-none z-10'>
              <span className='h-0.5 w-[calc(100%-1rem)] sm:w-[calc(100%-3rem)] rounded-full bg-primary' />
            </Tabs.Indicator>
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
