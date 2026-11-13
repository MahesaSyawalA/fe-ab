'use client';

import * as React from 'react';
import { Modal } from '@heroui/react';
import { PelangganEditFormFields, PelangganEditFooterActions } from './pelanggan-edit-form-fields';
import type { PelangganEditFormState } from './use-pelanggan-edit-form';

interface PelangganEditDialogProps {
  open: boolean;
  formState: PelangganEditFormState;
}

export function PelangganEditDialog({
  open,
  formState,
}: PelangganEditDialogProps) {
  const { onSubmit, handleOpenChange, isPending } = formState;

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={handleOpenChange} variant='blur' >
      <Modal.Container>
        <Modal.Dialog className='sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl p-0'>
          <Modal.CloseTrigger className='text-secondary-foreground' />
          <Modal.Header className='shrink-0 flex flex-col gap-0.5 px-6 pt-5 pb-3 border-b border-border/70 text-left items-start'>
            <Modal.Heading className='text-base sm:text-lg font-bold text-foreground'>
              Edit Pelanggan
            </Modal.Heading>
            <p className='text-xs sm:text-sm text-secondary-foreground'>
              Perbarui profil outlet dan titik koordinat GPS
            </p>
          </Modal.Header>

          <form
            onSubmit={onSubmit}
            className='flex flex-col flex-1 min-h-0 overflow-hidden'
          >
            <Modal.Body className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-6 py-4'>
              <PelangganEditFormFields formState={formState} />
            </Modal.Body>

            <Modal.Footer className='sticky bottom-0 z-10 shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-md px-6 py-3 flex items-center justify-end gap-3'>
              <PelangganEditFooterActions
                onCancel={() => handleOpenChange(false)}
                isPending={isPending}
              />
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
