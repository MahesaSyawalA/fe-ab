'use client';

import * as React from 'react';
import { Modal } from '@heroui/react';
import { Button } from '@/components/ui/button';
import { countActivePelangganFilters } from '@/store/pelanggan-filter-store';
import { PelangganFilterFields } from './pelanggan-filter-fields';

export interface PelangganFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipeOutlet: string;
  onApply: (tipe: string) => void;
  onReset: () => void;
}

interface PelangganFilterDialogContentProps {
  tipeOutlet: string;
  onApply: (tipe: string) => void;
  onReset: () => void;
  onClose: () => void;
}

function PelangganFilterDialogContent({
  tipeOutlet,
  onApply,
  onReset,
  onClose,
}: PelangganFilterDialogContentProps) {
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
    <Modal.Dialog className='sm:max-w-md max-h-[85vh] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl p-0'>
      <Modal.CloseTrigger className='text-secondary-foreground' />
      <Modal.Header className='shrink-0 flex flex-col gap-0.5 px-6 pt-5 pb-3 border-b border-border/70 text-left items-start'>
        <Modal.Heading className='text-base font-bold text-foreground text-left'>
          Filter Pelanggan
        </Modal.Heading>
        <p className='text-xs text-muted-foreground text-left'>
          {activeCount > 0
            ? `${activeCount} filter aktif`
            : 'Pilih filter untuk mempersempit daftar pelanggan'}
        </p>
      </Modal.Header>

      <Modal.Body className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-6 py-4'>
        <PelangganFilterFields
          draftTipe={draftTipe}
          onDraftTipeChange={setDraftTipe}
        />
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

/**
 * Filter Pelanggan Desktop (>= md) menggunakan HeroUI Modal.
 */
export function PelangganFilterDialog({
  open,
  onOpenChange,
  tipeOutlet,
  onApply,
  onReset,
}: PelangganFilterDialogProps) {
  return (
    <Modal.Backdrop isOpen={open} onOpenChange={onOpenChange} variant='blur'>
      <Modal.Container>
        <PelangganFilterDialogContent
          key={open ? 'open' : 'closed'}
          tipeOutlet={tipeOutlet}
          onApply={onApply}
          onReset={onReset}
          onClose={() => onOpenChange(false)}
        />
      </Modal.Container>
    </Modal.Backdrop>
  );
}
