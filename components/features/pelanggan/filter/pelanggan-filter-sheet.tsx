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
import { countActivePelangganFilters } from '@/store/pelanggan-filter-store';
import { PelangganFilterFields } from './pelanggan-filter-fields';

export interface PelangganFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipeOutlet: string;
  onApply: (tipe: string) => void;
  onReset: () => void;
}

interface PelangganFilterSheetContentProps {
  tipeOutlet: string;
  onApply: (tipe: string) => void;
  onReset: () => void;
  onClose: () => void;
}

function PelangganFilterSheetContent({
  tipeOutlet,
  onApply,
  onReset,
  onClose,
}: PelangganFilterSheetContentProps) {
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
    <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full sm:max-w-lg max-h-[92dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
      <DrawerHeader className='shrink-0 px-5 pt-3 pb-2 text-left border-b border-border/60 bg-card'>
        <DrawerTitle className='text-base font-bold text-foreground'>
          Filter Pelanggan
        </DrawerTitle>
        <DrawerDescription className='text-xs text-muted-foreground'>
          {activeCount > 0
            ? `${activeCount} filter aktif`
            : 'Pilih filter untuk mempersempit daftar pelanggan'}
        </DrawerDescription>
      </DrawerHeader>

      <div className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-5 py-4 flex flex-col gap-5'>
        <PelangganFilterFields
          draftTipe={draftTipe}
          onDraftTipeChange={setDraftTipe}
        />
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
    </DrawerContent>
  );
}

export function PelangganFilterSheet({
  open,
  onOpenChange,
  tipeOutlet,
  onApply,
  onReset,
}: PelangganFilterSheetProps) {
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
      <PelangganFilterSheetContent
        key={open ? 'open' : 'closed'}
        tipeOutlet={tipeOutlet}
        onApply={onApply}
        onReset={onReset}
        onClose={() => onOpenChange(false)}
      />
    </Drawer>
  );
}
