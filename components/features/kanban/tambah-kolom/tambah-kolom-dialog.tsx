'use client';

import * as React from 'react';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { TambahKolomForm } from './tambah-kolom-form';

interface TambahKolomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TambahKolomDialog({ open, onOpenChange }: TambahKolomDialogProps) {
  const handleModalOpenChange = React.useCallback(
    (nextOpen: boolean, eventDetails?: { reason?: string; event?: Event; cancel?: () => void }) => {
      if (!nextOpen && eventDetails?.reason === 'outside-press') {
        const target = eventDetails.event?.target;
        const isBackdropPress =
          target instanceof Element &&
          (target.closest('[data-slot="drawer-overlay"], [data-slot="drawer-viewport"], [data-slot="dialog-backdrop"]') !== null ||
            (target.classList.contains('fixed') && target.closest('[data-slot="dialog-content"]') === null)) &&
          target.closest('[data-slot="drawer-popup"], [data-slot="dialog-content"]') === null;

        if (!isBackdropPress) {
          eventDetails.cancel?.();
          return;
        }
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalOpenChange}
      title='Tambah Kolom Board Baru'
      description='Atur nama kolom dan tipe tahap kanban sesuai alur CRM'
    >
      <TambahKolomForm onClose={() => onOpenChange(false)} />
    </ResponsiveModal>
  );
}
