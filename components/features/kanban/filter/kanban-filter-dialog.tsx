'use client';

import * as React from 'react';
import { Modal } from '@heroui/react';
import { Button } from '@/components/ui/button';
import {
  INITIAL_KANBAN_FILTER,
  KanbanFilterState,
  countActiveFilters,
} from './filter-state';
import { KanbanFilterFields } from './kanban-filter-fields';

export interface KanbanFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: KanbanFilterState;
  onApply: (nextFilter: KanbanFilterState) => void;
}

interface KanbanFilterDialogContentProps {
  value: KanbanFilterState;
  onApply: (nextFilter: KanbanFilterState) => void;
  onClose: () => void;
}

function KanbanFilterDialogContent({
  value,
  onApply,
  onClose,
}: KanbanFilterDialogContentProps) {
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
    <Modal.Dialog className='sm:max-w-md max-h-[85vh] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl p-0'>
      <Modal.CloseTrigger className='text-secondary-foreground' />
      <Modal.Header className='shrink-0 flex flex-col gap-0.5 px-6 pt-5 pb-3 border-b border-border/70 text-left items-start'>
        <Modal.Heading className='text-base font-bold text-foreground text-left'>
          Filter Tiket
        </Modal.Heading>
        <p className='text-xs text-muted-foreground text-left'>
          {activeCount} filter dipilih
        </p>
      </Modal.Header>

      <Modal.Body className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-6 py-4'>
        <KanbanFilterFields draft={draft} setDraft={setDraft} />
      </Modal.Body>

      <Modal.Footer className='sticky bottom-0 z-10 shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-md px-6 py-3 grid grid-cols-2 gap-3'>
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
      </Modal.Footer>
    </Modal.Dialog>
  );
}

export function KanbanFilterDialog({
  open,
  onOpenChange,
  value,
  onApply,
}: KanbanFilterDialogProps) {
  return (
    <Modal.Backdrop isOpen={open} onOpenChange={onOpenChange} variant='blur'>
      <Modal.Container>
        <KanbanFilterDialogContent
          key={open ? 'open' : 'closed'}
          value={value}
          onApply={onApply}
          onClose={() => onOpenChange(false)}
        />
      </Modal.Container>
    </Modal.Backdrop>
  );
}
