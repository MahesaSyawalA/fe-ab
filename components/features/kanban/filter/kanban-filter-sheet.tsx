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
import {
  INITIAL_KANBAN_FILTER,
  KanbanFilterState,
  countActiveFilters,
} from './filter-state';
import { KanbanFilterFields } from './kanban-filter-fields';

export interface KanbanFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: KanbanFilterState;
  onApply: (nextFilter: KanbanFilterState) => void;
}

interface KanbanFilterSheetContentProps {
  value: KanbanFilterState;
  onApply: (nextFilter: KanbanFilterState) => void;
  onClose: () => void;
}

function KanbanFilterSheetContent({
  value,
  onApply,
  onClose,
}: KanbanFilterSheetContentProps) {
  const [draft, setDraft] = React.useState<KanbanFilterState>(value);

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleReset = () => {
    setDraft(INITIAL_KANBAN_FILTER);
  };

  const activeCount = countActiveFilters(draft);

  return (
    <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full sm:max-w-lg max-h-[92dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
      <DrawerHeader className='shrink-0 px-5 pt-2 pb-2 text-left border-b border-border/60 bg-card'>
        <DrawerTitle className='text-base font-bold text-foreground'>
          Filter Tiket
        </DrawerTitle>
        <DrawerDescription className='text-xs text-secondary-foreground font-semibold'>
          {activeCount} filter dipilih
        </DrawerDescription>
      </DrawerHeader>

      <div className='no-scrollbar flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-5 py-3'>
        <KanbanFilterFields draft={draft} setDraft={setDraft} />
      </div>

      <DrawerFooter className='shrink-0 z-10 grid grid-cols-2 gap-3 px-5 py-3 border-t border-border/70 bg-card shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-4 sm:pb-3'>
        <Button
          type='button'
          variant='outline'
          onClick={handleReset}
          className='h-10 sm:h-9 w-full rounded-md text-xs font-semibold cursor-pointer border-border bg-card shadow-none hover:bg-muted/50'
        >
          Reset
        </Button>
        <Button
          type='button'
          onClick={handleApply}
          className='h-10 sm:h-9 w-full rounded-md text-xs font-semibold text-white shadow-sm bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary transition-all cursor-pointer'
        >
          Terapkan Filter
        </Button>
      </DrawerFooter>
    </DrawerContent>
  );
}

export function KanbanFilterSheet({
  open,
  onOpenChange,
  value,
  onApply,
}: KanbanFilterSheetProps) {
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
      <KanbanFilterSheetContent
        key={open ? 'open' : 'closed'}
        value={value}
        onApply={onApply}
        onClose={() => onOpenChange(false)}
      />
    </Drawer>
  );
}
