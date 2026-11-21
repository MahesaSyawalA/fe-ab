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
import type { FilterSelectOption } from '@/components/features/kanban/filter/inputs/filter-select-input';
import type { AnalyticsParams } from '@/types/analytics.types';
import {
  AnalyticsFilterFields,
  AnalyticsFilterFooterActions,
  useAnalyticsFilterDraft,
} from './analytics-filter-content';

export interface AnalyticsFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: AnalyticsParams;
  onApply: (nextFilter: AnalyticsParams) => void;
  salesOptions: FilterSelectOption[];
  squadOptions: FilterSelectOption[];
  tipeOptions: FilterSelectOption[];
}

function AnalyticsFilterSheetContent({
  value,
  onApply,
  onClose,
  salesOptions,
  squadOptions,
  tipeOptions,
}: Omit<AnalyticsFilterSheetProps, 'open' | 'onOpenChange'> & { onClose: () => void }) {
  const { draft, setDraft, activeCount, handleApply, handleReset } =
    useAnalyticsFilterDraft(value, onApply, onClose);

  return (
    <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full sm:max-w-lg max-h-[92dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
      <DrawerHeader className='shrink-0 px-5 pt-2 pb-2 text-left border-b border-border/60 bg-card'>
        <DrawerTitle className='text-base font-bold text-foreground'>
          Filter Analitik
        </DrawerTitle>
        <DrawerDescription className='text-xs text-secondary-foreground font-semibold'>
          {activeCount} filter dipilih
        </DrawerDescription>
      </DrawerHeader>

      <div className='no-scrollbar flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-5 py-3'>
        <AnalyticsFilterFields
          draft={draft}
          setDraft={setDraft}
          salesOptions={salesOptions}
          squadOptions={squadOptions}
          tipeOptions={tipeOptions}
        />
      </div>

      <DrawerFooter className='shrink-0 z-10 grid grid-cols-2 gap-3 px-5 py-3 border-t border-border/70 bg-card shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-4 sm:pb-3'>
        <AnalyticsFilterFooterActions onReset={handleReset} onApply={handleApply} />
      </DrawerFooter>
    </DrawerContent>
  );
}

export function AnalyticsFilterSheet({
  open,
  onOpenChange,
  value,
  onApply,
  salesOptions,
  squadOptions,
  tipeOptions,
}: AnalyticsFilterSheetProps) {
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
      <AnalyticsFilterSheetContent
        key={open ? 'open' : 'closed'}
        value={value}
        onApply={onApply}
        onClose={() => onOpenChange(false)}
        salesOptions={salesOptions}
        squadOptions={squadOptions}
        tipeOptions={tipeOptions}
      />
    </Drawer>
  );
}
