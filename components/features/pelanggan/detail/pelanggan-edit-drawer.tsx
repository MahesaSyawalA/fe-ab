'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { PelangganEditFormFields, PelangganEditFooterActions } from './pelanggan-edit-form-fields';
import type { PelangganEditFormState } from './use-pelanggan-edit-form';

interface PelangganEditDrawerProps {
  open: boolean;
  formState: PelangganEditFormState;
}

/** Drawer Mobile / Bottom Sheet untuk Edit Pelanggan. */
export function PelangganEditDrawer({
  open,
  formState,
}: PelangganEditDrawerProps) {
  const { onSubmit, handleOpenChange, isPending } = formState;

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} showSwipeHandle>
      <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full max-h-[92dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
        <DrawerHeader className='shrink-0 flex flex-row items-start justify-between px-5 pt-3 pb-2 text-left border-b border-border/60 bg-card'>
          <div className='flex flex-col gap-0.5'>
            <DrawerTitle className='text-base font-bold text-foreground text-left'>
              Edit Pelanggan
            </DrawerTitle>
            <DrawerDescription className='text-xs sm:text-sm text-secondary-foreground text-left'>
              Perbarui profil outlet dan titik koordinat GPS
            </DrawerDescription>
          </div>
          <DrawerClose
            render={
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='size-8 rounded-full text-muted-foreground hover:bg-muted cursor-pointer'
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
            <PelangganEditFormFields formState={formState} />
          </div>

          <DrawerFooter className='sticky bottom-0 z-20 shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-md px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]'>
            <PelangganEditFooterActions
              onCancel={() => handleOpenChange(false)}
              isPending={isPending}
            />
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

