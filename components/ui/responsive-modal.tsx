'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

/** Drawer (bottom sheet) di mobile, Dialog (modal) di desktop. */
export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  children,
}: ResponsiveModalProps) {
  const isMobile = useIsMobile();

  const heading = (
    <div className='flex flex-col gap-0.5'>
      {isMobile ? (
        <>
          <DrawerTitle className='text-base font-bold text-foreground'>{title}</DrawerTitle>
          {description && (
            <DrawerDescription className='text-xs text-muted-foreground'>{description}</DrawerDescription>
          )}
        </>
      ) : (
        <>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </>
      )}
    </div>
  );

  const closeButton = (
    <Button
      type='button'
      variant='ghost'
      size='icon-sm'
      className='size-8 rounded-full text-muted-foreground hover:bg-muted cursor-pointer'
    />
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
        <DrawerContent className='mx-auto max-w-lg rounded-t-3xl bg-card'>
          <DrawerHeader className='flex flex-row items-start justify-between px-5 pt-2 pb-1 text-left'>
            {heading}
            <DrawerClose render={closeButton}>
              <X className='size-4' />
            </DrawerClose>
          </DrawerHeader>
          <div className='max-h-[80vh] overflow-y-auto px-5 pb-6'>{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader className='flex-row items-start justify-between'>
          {heading}
          <DialogClose render={closeButton}>
            <X className='size-4' />
          </DialogClose>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

