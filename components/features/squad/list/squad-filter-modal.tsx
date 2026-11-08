'use client';

import * as React from 'react';
import type { DrawerRootChangeEventDetails } from '@base-ui/react/drawer';
import { Modal } from '@heroui/react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ChipFilter } from '@/components/ui/chip-filter';
import { SQUAD_STATUS_OPTIONS } from '@/constants/squad-constants';
import { useIsMobile } from '@/hooks/use-mobile';

export interface SquadFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: string;
  onStatusChange: (status: string) => void;
}

interface SquadFilterBodyProps {
  draftStatus: string;
  onSelect: (id: string) => void;
}

function SquadFilterBody({ draftStatus, onSelect }: SquadFilterBodyProps) {
  return (
    <div className='flex flex-col gap-2'>
      <span className='text-xs font-semibold text-foreground'>Status Squad</span>
      <ChipFilter
        items={SQUAD_STATUS_OPTIONS}
        selectedId={draftStatus}
        onSelect={onSelect}
      />
    </div>
  );
}

interface SquadFilterContentProps {
  status: string;
  onApply: (status: string) => void;
  onReset: () => void;
}

function SquadFilterDrawerContent({
  status,
  onApply,
  onReset,
}: SquadFilterContentProps) {
  const [draftStatus, setDraftStatus] = React.useState(status);
  const activeCount = draftStatus !== 'semua' ? 1 : 0;

  return (
    <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full sm:max-w-lg max-h-[92dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
      <DrawerHeader className='shrink-0 px-5 pt-3 pb-2 text-left border-b border-border/60 bg-card'>
        <DrawerTitle className='text-base font-bold text-foreground'>
          Filter Squad
        </DrawerTitle>
        <DrawerDescription className='text-xs text-muted-foreground'>
          {activeCount > 0
            ? `${activeCount} filter aktif`
            : 'Pilih status untuk menyaring squad'}
        </DrawerDescription>
      </DrawerHeader>

      <div className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-5 py-4'>
        <SquadFilterBody
          draftStatus={draftStatus}
          onSelect={setDraftStatus}
        />
      </div>

      <DrawerFooter className='shrink-0 z-10 grid grid-cols-2 gap-3 px-5 py-3 border-t border-border/70 bg-card shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-4 sm:pb-3'>
        <Button
          type='button'
          variant='outline'
          onClick={onReset}
          className='h-10 rounded-xl text-xs font-semibold shadow-none cursor-pointer'
        >
          Reset
        </Button>
        <Button
          type='button'
          onClick={() => onApply(draftStatus)}
          className='h-10 rounded-xl text-xs font-semibold cursor-pointer'
        >
          Terapkan Filter
        </Button>
      </DrawerFooter>
    </DrawerContent>
  );
}

function SquadFilterDialogContent({
  status,
  onApply,
  onReset,
}: SquadFilterContentProps) {
  const [draftStatus, setDraftStatus] = React.useState(status);
  const activeCount = draftStatus !== 'semua' ? 1 : 0;

  return (
    <Modal.Dialog className='sm:max-w-md max-h-[85vh] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl p-0'>
      <Modal.CloseTrigger className='text-secondary-foreground' />
      <Modal.Header className='shrink-0 flex flex-col gap-0.5 px-6 pt-5 pb-3 border-b border-border/70 text-left items-start'>
        <Modal.Heading className='text-base font-bold text-foreground text-left'>
          Filter Squad
        </Modal.Heading>
        <p className='text-xs text-muted-foreground text-left'>
          {activeCount > 0
            ? `${activeCount} filter aktif`
            : 'Pilih status untuk menyaring squad'}
        </p>
      </Modal.Header>

      <Modal.Body className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-6 py-4'>
        <SquadFilterBody
          draftStatus={draftStatus}
          onSelect={setDraftStatus}
        />
      </Modal.Body>

      <Modal.Footer className='sticky bottom-0 z-10 shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-md px-6 py-3 grid grid-cols-2 gap-3'>
        <Button
          type='button'
          variant='outline'
          onClick={onReset}
          className='h-10 rounded-xl text-xs font-semibold shadow-none cursor-pointer'
        >
          Reset
        </Button>
        <Button
          type='button'
          onClick={() => onApply(draftStatus)}
          className='h-10 rounded-xl text-xs font-semibold cursor-pointer'
        >
          Terapkan Filter
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  );
}

/**
 * Filter Squad Adaptif:
 * - Desktop (>= md): HeroUI Modal
 * - Mobile (< md): Bottom Sheet Drawer
 */
export function SquadFilterModal({
  open,
  onOpenChange,
  status,
  onStatusChange,
}: SquadFilterModalProps) {
  const isMobile = useIsMobile();

  const handleApply = (nextStatus: string) => {
    onStatusChange(nextStatus);
    onOpenChange(false);
  };

  const handleReset = () => {
    onStatusChange('semua');
    onOpenChange(false);
  };

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

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleDrawerOpenChange} showSwipeHandle>
        <SquadFilterDrawerContent
          key={open ? 'open' : 'closed'}
          status={status}
          onApply={handleApply}
          onReset={handleReset}
        />
      </Drawer>
    );
  }

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={onOpenChange} variant='blur'>
      <Modal.Container>
        <SquadFilterDialogContent
          key={open ? 'open' : 'closed'}
          status={status}
          onApply={handleApply}
          onReset={handleReset}
        />
      </Modal.Container>
    </Modal.Backdrop>
  );
}
