'use client';

import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { KanbanFilterForm } from './kanban-filter-form';
import { KanbanFilterState } from './filter-state';

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
  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full sm:max-w-lg max-h-[92dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
        <KanbanFilterForm
          value={value}
          onApply={onApply}
          onClose={() => onOpenChange(false)}
        />
      </DrawerContent>
    </Drawer>
  );
}
