'use client';

import { Modal } from '@heroui/react';
import {
  ChangePasswordFields,
  ChangePasswordFooterActions,
  type ChangePasswordFormState,
} from './change-password-form';

interface ChangePasswordDialogProps {
  open: boolean;
  formState: ChangePasswordFormState;
}

export function ChangePasswordDialog({ open, formState }: ChangePasswordDialogProps) {
  return (
    <Modal.Backdrop isOpen={open} onOpenChange={formState.handleOpenChange} variant='blur'>
      <Modal.Container>
        <Modal.Dialog className='sm:max-w-md max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl p-0'>
          <Modal.CloseTrigger className='text-secondary-foreground' />
          <Modal.Header className='shrink-0 flex flex-col gap-0.5 px-6 pt-5 pb-3 border-b border-border/70 text-left items-start'>
            <Modal.Heading className='text-base sm:text-lg font-bold text-foreground'>
              Ubah Password
            </Modal.Heading>
            <p className='text-xs sm:text-sm text-secondary-foreground'>
              Masukkan password saat ini dan buat password baru minimal 8 karakter.
            </p>
          </Modal.Header>

          <form
            onSubmit={formState.onSubmit}
            className='flex flex-col flex-1 min-h-0 overflow-hidden'
          >
            <Modal.Body className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-6 py-4'>
              <ChangePasswordFields formState={formState} />
            </Modal.Body>

            <Modal.Footer className='sticky bottom-0 z-10 shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-md px-6 py-3 flex items-center justify-end gap-3'>
              <ChangePasswordFooterActions
                onCancel={() => formState.handleOpenChange(false)}
                isPending={formState.isPending}
              />
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
