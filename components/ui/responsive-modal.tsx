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
import { cn } from '@/lib/utils';

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/** Drawer (bottom sheet) di mobile, Dialog (modal) di desktop. */
export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
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
        <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full sm:max-w-lg max-h-[92dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
          <DrawerHeader className='shrink-0 flex flex-row items-start justify-between px-5 pt-2 pb-1 text-left border-b border-border/60 bg-card'>
            {heading}
            <DrawerClose render={closeButton}>
              <X className='size-4' />
            </DrawerClose>
          </DrawerHeader>
          <div className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-5 py-4 pb-6'>{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('max-w-md', className)}>
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

