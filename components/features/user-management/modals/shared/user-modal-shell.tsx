'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Modal } from '@heroui/react';
import type { DrawerRootChangeEventDetails } from '@base-ui/react/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
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
import { cn, guardPopupDismiss } from '@/lib/utils';

export interface UserModalShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export function UserModalShell({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  onSubmit,
  className,
}: UserModalShellProps) {
  const isMobile = useIsMobile();

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
        <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full max-h-[92dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
          {title ? (
            <DrawerHeader className='shrink-0 flex flex-row items-start justify-between px-5 pt-3 pb-2 text-left border-b border-border/60 bg-card'>
              <div className='flex flex-col gap-0.5'>
                <DrawerTitle className='text-base font-bold text-foreground text-left'>
                  {title}
                </DrawerTitle>
                {description && (
                  <DrawerDescription className='text-xs sm:text-sm text-secondary-foreground text-left'>
                    {description}
                  </DrawerDescription>
                )}
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
          ) : (
            <div className='flex justify-end px-5 pt-3 shrink-0'>
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
            </div>
          )}

          {onSubmit ? (
            <form onSubmit={onSubmit} className='flex flex-col flex-1 min-h-0 overflow-hidden'>
              <div className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-5 py-4 pb-4'>
                {children}
              </div>
              {footer && (
                <DrawerFooter className='sticky bottom-0 z-20 shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-md px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]'>
                  {footer}
                </DrawerFooter>
              )}
            </form>
          ) : (
            <div className='flex flex-col flex-1 min-h-0 overflow-hidden'>
              <div className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-5 py-4 pb-4'>
                {children}
              </div>
              {footer && (
                <DrawerFooter className='sticky bottom-0 z-20 shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-md px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]'>
                  {footer}
                </DrawerFooter>
              )}
            </div>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={guardPopupDismiss(onOpenChange)} variant='blur'>
      <Modal.Container>
        <Modal.Dialog
          className={cn(
            'sm:max-w-xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl p-0',
            className,
          )}
        >
          <Modal.CloseTrigger className='text-secondary-foreground' />
          {title && (
            <Modal.Header className='shrink-0 flex flex-col gap-0.5 px-6 pt-5 pb-3 border-b border-border/70 text-left items-start'>
              <Modal.Heading className='text-base sm:text-lg font-bold text-foreground text-left'>
                {title}
              </Modal.Heading>
              {description && (
                <p className='text-xs sm:text-sm text-secondary-foreground text-left'>
                  {description}
                </p>
              )}
            </Modal.Header>
          )}

          {onSubmit ? (
            <form onSubmit={onSubmit} className='flex flex-col flex-1 min-h-0 overflow-hidden'>
              <Modal.Body className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-6 py-4'>
                {children}
              </Modal.Body>
              {footer && (
                <Modal.Footer className='sticky bottom-0 z-10 shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-md px-6 py-3 flex items-center justify-end gap-3'>
                  {footer}
                </Modal.Footer>
              )}
            </form>
          ) : (
            <div className='flex flex-col flex-1 min-h-0 overflow-hidden'>
              <Modal.Body className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-6 py-4'>
                {children}
              </Modal.Body>
              {footer && (
                <Modal.Footer className='sticky bottom-0 z-10 shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-md px-6 py-3 flex items-center justify-end gap-3'>
                  {footer}
                </Modal.Footer>
              )}
            </div>
          )}
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
