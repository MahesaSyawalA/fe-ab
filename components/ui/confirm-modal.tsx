'use client';

import * as React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Modal } from '@heroui/react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  variant?: 'danger' | 'warning';
  icon?: React.ReactNode;
}

/**
 * Modal konfirmasi aksi destruktif:
 * - Desktop (>= md): HeroUI Modal terpusat
 * - Mobile (< md): Bottom Sheet Drawer dengan swipe handle & pb-safe
 */
export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  cancelLabel = 'Batal',
  confirmLabel = 'Ya, Lanjutkan',
  onConfirm,
  isLoading = false,
  variant = 'danger',
  icon,
}: ConfirmModalProps) {
  const isMobile = useIsMobile();

  const iconContainerClass =
    variant === 'warning'
      ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
      : 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400';

  const confirmBtnClass =
    variant === 'warning'
      ? 'bg-amber-600 hover:bg-amber-600/90 text-white'
      : 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white';

  const defaultIcon = <AlertTriangle className='size-7' />;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
        <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full sm:max-w-lg flex flex-col rounded-t-[32px] bg-card border-t border-border shadow-2xl px-6 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]'>
          <div className='flex flex-col items-center gap-4 text-center mt-4'>
            {/* Icon Container (Styled like mockup) */}
            <div
              className={cn(
                'flex size-12 items-center justify-center rounded-2xl shrink-0 p-3.5 transition-transform',
                iconContainerClass,
              )}
            >
              {icon || defaultIcon}
            </div>

            {/* Title & Description */}
            <div className='flex flex-col gap-1.5'>
              <DrawerTitle className='text-lg font-bold tracking-tight text-foreground'>
                {title}
              </DrawerTitle>
              <DrawerDescription className='text-xs sm:text-sm text-secondary-foreground leading-relaxed max-w-xs mx-auto'>
                {description}
              </DrawerDescription>
            </div>

            {/* Action Buttons */}
            <div className='grid w-full grid-cols-2 gap-3.5 mt-2'>
              <Button
                type='button'
                variant='outline'
                disabled={isLoading}
                onClick={() => onOpenChange(false)}
                className='h-12 rounded-md text-xs sm:text-sm font-semibold border-border bg-card text-foreground hover:bg-muted/40 cursor-pointer shadow-none'
              >
                {cancelLabel}
              </Button>
              <Button
                type='button'
                disabled={isLoading}
                onClick={onConfirm}
                className={cn(
                  'h-12 rounded-md text-xs sm:text-sm font-semibold cursor-pointer shadow-xs',
                  confirmBtnClass,
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 size-4 animate-spin' />
                    Memproses...
                  </>
                ) : (
                  confirmLabel
                )}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={onOpenChange} variant='blur'>
      <Modal.Container>
        <Modal.Dialog className='sm:max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl overflow-hidden relative'>
          <Modal.CloseTrigger className='text-secondary-foreground absolute top-4 right-4' />
          <div className='flex flex-col items-center gap-4 text-center pt-2'>
            {/* Icon Container */}
            <div
              className={cn(
                'flex size-16 items-center justify-center rounded-2xl shrink-0 p-3.5',
                iconContainerClass,
              )}
            >
              {icon || defaultIcon}
            </div>

            {/* Title & Description */}
            <div className='flex flex-col gap-1.5'>
              <Modal.Heading className='text-lg sm:text-xl font-bold tracking-tight text-foreground'>
                {title}
              </Modal.Heading>
              <p className='text-xs sm:text-sm text-secondary-foreground leading-relaxed max-w-xs sm:max-w-sm mx-auto'>
                {description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className='grid w-full grid-cols-2 gap-3.5 mt-3'>
              <Button
                type='button'
                variant='outline'
                disabled={isLoading}
                onClick={() => onOpenChange(false)}
                className='h-11 rounded-md text-xs sm:text-sm font-semibold border-border bg-card text-foreground hover:bg-muted/40 cursor-pointer shadow-none'
              >
                {cancelLabel}
              </Button>
              <Button
                type='button'
                disabled={isLoading}
                onClick={onConfirm}
                className={cn(
                  'h-11 rounded-md text-xs sm:text-sm font-semibold cursor-pointer shadow-xs',
                  confirmBtnClass,
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 size-4 animate-spin' />
                    Memproses...
                  </>
                ) : (
                  confirmLabel
                )}
              </Button>
            </div>
          </div>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
