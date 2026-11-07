'use client';

import * as React from 'react';
import type { DrawerRootChangeEventDetails } from '@base-ui/react/drawer';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { countActivePelangganFilters } from '@/store/pelanggan-filter-store';

export const OUTLET_FILTER_OPTIONS = [
  { id: 'semua', label: 'Semua Tipe', dotColor: 'bg-kanban-purple' },
  { id: 'Rumah Sakit', label: 'Rumah Sakit', dotColor: 'bg-kanban-pink' },
  { id: 'Klinik', label: 'Klinik', dotColor: 'bg-kanban-orange' },
  { id: 'Apotek', label: 'Apotek / Laboratorium', dotColor: 'bg-kanban-green' },
  { id: 'Individu', label: 'Individu', dotColor: 'bg-kanban-lightblue' },
];

interface PelangganFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipeOutlet: string;
  onApply: (tipe: string) => void;
  onReset: () => void;
}

interface PelangganFilterContentProps {
  tipeOutlet: string;
  onApply: (tipe: string) => void;
  onReset: () => void;
  onClose: () => void;
}

function PelangganFilterContent({
  tipeOutlet,
  onApply,
  onReset,
  onClose,
}: PelangganFilterContentProps) {
  const [draftTipe, setDraftTipe] = React.useState(tipeOutlet);

  const handleApply = () => {
    onApply(draftTipe);
    onClose();
  };

  const handleReset = () => {
    setDraftTipe('semua');
    onReset();
    onClose();
  };

  const activeCount = countActivePelangganFilters(draftTipe);

  return (
    <>
      <DrawerHeader className='shrink-0 px-5 pt-3 pb-2 text-left border-b border-border/60 bg-card'>
        <DrawerTitle className='text-base font-bold text-foreground'>Filter Pelanggan</DrawerTitle>
        <DrawerDescription className='text-xs text-muted-foreground'>
          {activeCount > 0
            ? `${activeCount} filter aktif`
            : 'Pilih filter untuk mempersempit daftar pelanggan'}
        </DrawerDescription>
      </DrawerHeader>

      <div className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-5 py-4 flex flex-col gap-5'>
        <div className='flex flex-col gap-2.5'>
          <Label className='text-xs font-bold text-foreground'>Tipe Outlet</Label>
          <div className='flex flex-wrap gap-2'>
            {OUTLET_FILTER_OPTIONS.map((opt) => {
              const isSelected = draftTipe === opt.id;
              return (
                <Button
                  key={opt.id}
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => setDraftTipe(opt.id)}
                  className={cn(
                    'h-9 rounded-full px-4 text-xs font-medium shadow-none transition-all cursor-pointer gap-2',
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary font-semibold hover:bg-primary/15 hover:text-primary'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted/40 hover:text-foreground',
                  )}
                >
                  <span className={cn('size-2 rounded-full shrink-0', opt.dotColor)} />
                  {opt.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <DrawerFooter className='shrink-0 z-10 grid grid-cols-2 gap-3 px-5 py-3 border-t border-border/70 bg-card shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-4 sm:pb-3'>
        <Button
          type='button'
          variant='outline'
          onClick={handleReset}
          className='h-10 rounded-xl text-xs font-semibold shadow-none cursor-pointer'
        >
          Reset
        </Button>
        <Button
          type='button'
          onClick={handleApply}
          className='h-10 rounded-xl text-xs font-semibold cursor-pointer'
        >
          Terapkan Filter
        </Button>
      </DrawerFooter>
    </>
  );
}

export function PelangganFilterDrawer({
  open,
  onOpenChange,
  tipeOutlet,
  onApply,
  onReset,
}: PelangganFilterDrawerProps) {
  const handleDrawerOpenChange = React.useCallback(
    (nextOpen: boolean, eventDetails?: DrawerRootChangeEventDetails) => {
      if (!nextOpen && eventDetails?.reason === 'outside-press') {
        const target = eventDetails.event.target;
        const isBackdropPress =
          target instanceof Element &&
          target.closest('[data-slot="drawer-overlay"], [data-slot="drawer-viewport"]') !== null &&
          target.closest('[data-slot="drawer-popup"]') === null;

        if (!isBackdropPress) {
          eventDetails.cancel();
          return;
        }
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  return (
    <Drawer open={open} onOpenChange={handleDrawerOpenChange} showSwipeHandle>
      <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full sm:max-w-lg max-h-[92dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
        <PelangganFilterContent
          key={open ? 'open' : 'closed'}
          tipeOutlet={tipeOutlet}
          onApply={onApply}
          onReset={onReset}
          onClose={() => onOpenChange(false)}
        />
      </DrawerContent>
    </Drawer>
  );
}
