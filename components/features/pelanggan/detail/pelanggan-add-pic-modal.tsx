'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Modal } from '@heroui/react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import {
  usePelangganAddPicForm,
  PelangganAddPicFields,
  PelangganAddPicFooterActions,
  type PelangganAddPicFormState,
} from './pelanggan-add-pic-form';

export interface PelangganAddPicModalProps {
  idPelanggan: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function PelangganAddPicDialog({
  open,
  formState,
}: {
  open: boolean;
  formState: PelangganAddPicFormState;
}) {
  const { onSubmit, handleOpenChange, isPending } = formState;

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={handleOpenChange} variant='blur'>
      <Modal.Container>
        <Modal.Dialog className='sm:max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl p-0'>
          <Modal.CloseTrigger className='text-secondary-foreground' />
          <Modal.Header className='shrink-0 flex flex-col gap-0.5 px-6 pt-5 pb-3 border-b border-border/70 text-left items-start'>
            <Modal.Heading className='text-base sm:text-lg font-bold text-foreground'>
              Tambah Kontak PIC
            </Modal.Heading>
            <p className='text-xs sm:text-sm text-secondary-foreground'>
              Tambahkan kontak person-in-charge baru untuk outlet pelanggan ini.
            </p>
          </Modal.Header>

          <form
            onSubmit={onSubmit}
            className='flex flex-col flex-1 min-h-0 overflow-hidden'
          >
            <Modal.Body className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-6 py-4'>
              <PelangganAddPicFields formState={formState} />
            </Modal.Body>

            <Modal.Footer className='sticky bottom-0 z-10 shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-md px-6 py-3 flex items-center justify-end gap-3'>
              <PelangganAddPicFooterActions
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

function PelangganAddPicDrawer({
  open,
  formState,
}: {
  open: boolean;
  formState: PelangganAddPicFormState;
}) {
  const { onSubmit, handleOpenChange, isPending } = formState;

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} showSwipeHandle>
      <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full max-h-[92dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
        <DrawerHeader className='shrink-0 flex flex-row items-start justify-between px-5 pt-3 pb-2 text-left border-b border-border/60 bg-card'>
          <div className='flex flex-col gap-0.5'>
            <DrawerTitle className='text-base font-bold text-foreground text-left'>
              Tambah Kontak PIC
            </DrawerTitle>
            <DrawerDescription className='text-xs sm:text-sm text-secondary-foreground text-left'>
              Tambahkan kontak person-in-charge baru untuk outlet pelanggan ini.
            </DrawerDescription>
          </div>
          <DrawerClose
            render={
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='size-8 rounded-md text-muted-foreground hover:bg-muted cursor-pointer'
              >
                <X className='size-4' />
              </Button>
            }
          />
        </DrawerHeader>

        <form
          onSubmit={onSubmit}
          className='flex flex-col flex-1 min-h-0 overflow-hidden'
        >
          <div className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-5 py-4 pb-6'>
            <PelangganAddPicFields formState={formState} />
          </div>

          <DrawerFooter className='sticky bottom-0 z-20 shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-md px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]'>
            <PelangganAddPicFooterActions
              onCancel={() => handleOpenChange(false)}
              isPending={isPending}
            />
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

export function PelangganAddPicModal(props: PelangganAddPicModalProps) {
  const isMobile = useIsMobile();
  const formState = usePelangganAddPicForm(props);

  if (isMobile) {
    return <PelangganAddPicDrawer open={props.open} formState={formState} />;
  }

  return <PelangganAddPicDialog open={props.open} formState={formState} />;
}
