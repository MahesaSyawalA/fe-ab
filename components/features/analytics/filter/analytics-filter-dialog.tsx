'use client';

import * as React from 'react';
import { Modal } from '@heroui/react';
import type { FilterSelectOption } from '@/components/features/kanban/filter/inputs/filter-select-input';
import { guardPopupDismiss } from '@/lib/utils';
import type { AnalyticsParams } from '@/types/analytics.types';
import {
  AnalyticsFilterFields,
  AnalyticsFilterFooterActions,
  useAnalyticsFilterDraft,
} from './analytics-filter-content';

export interface AnalyticsFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: AnalyticsParams;
  onApply: (nextFilter: AnalyticsParams) => void;
  salesOptions: FilterSelectOption[];
  squadOptions: FilterSelectOption[];
  tipeOptions: FilterSelectOption[];
}

function AnalyticsFilterDialogContent({
  value,
  onApply,
  onClose,
  salesOptions,
  squadOptions,
  tipeOptions,
}: Omit<AnalyticsFilterDialogProps, 'open' | 'onOpenChange'> & { onClose: () => void }) {
  const { draft, setDraft, activeCount, handleApply, handleReset } =
    useAnalyticsFilterDraft(value, onApply, onClose);

  return (
    <Modal.Dialog className='sm:max-w-md max-h-[85vh] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl p-0'>
      <Modal.CloseTrigger className='text-secondary-foreground' />
      <Modal.Header className='shrink-0 flex flex-col gap-0.5 px-6 pt-5 pb-3 border-b border-border/70 text-left items-start'>
        <Modal.Heading className='text-base font-bold text-foreground text-left'>
          Filter Analitik
        </Modal.Heading>
        <p className='text-xs text-muted-foreground text-left'>
          {activeCount} filter dipilih
        </p>
      </Modal.Header>

      <Modal.Body className='no-scrollbar flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-6 py-4'>
        <AnalyticsFilterFields
          draft={draft}
          setDraft={setDraft}
          salesOptions={salesOptions}
          squadOptions={squadOptions}
          tipeOptions={tipeOptions}
        />
      </Modal.Body>

      <Modal.Footer className='sticky bottom-0 z-10 shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-md px-6 py-3 grid grid-cols-2 gap-3'>
        <AnalyticsFilterFooterActions onReset={handleReset} onApply={handleApply} />
      </Modal.Footer>
    </Modal.Dialog>
  );
}

export function AnalyticsFilterDialog({
  open,
  onOpenChange,
  value,
  onApply,
  salesOptions,
  squadOptions,
  tipeOptions,
}: AnalyticsFilterDialogProps) {
  return (
    <Modal.Backdrop isOpen={open} onOpenChange={guardPopupDismiss(onOpenChange)} variant='blur'>
      <Modal.Container>
        <AnalyticsFilterDialogContent
          key={open ? 'open' : 'closed'}
          value={value}
          onApply={onApply}
          onClose={() => onOpenChange(false)}
          salesOptions={salesOptions}
          squadOptions={squadOptions}
          tipeOptions={tipeOptions}
        />
      </Modal.Container>
    </Modal.Backdrop>
  );
}
