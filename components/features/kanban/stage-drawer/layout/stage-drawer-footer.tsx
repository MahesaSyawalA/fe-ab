import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { StageDrawerMode } from '../types';

export interface StageDrawerFooterProps {
  mode: StageDrawerMode;
  isSameStage: boolean;
  accentColor?: string;
  isSubmitting?: boolean;
  onClose: () => void;
}

export function StageDrawerFooterActions({
  mode,
  isSameStage,
  isSubmitting,
  onClose,
}: StageDrawerFooterProps) {
  return (
    <>
      <Button
        type='button'
        variant='outline'
        onClick={onClose}
        disabled={isSubmitting}
        className='h-10 sm:h-9 w-full sm:w-28 rounded-md text-xs font-semibold cursor-pointer border-border bg-card shadow-none hover:bg-muted/50'
      >
        Batal
      </Button>
      <Button
        type='submit'
        disabled={isSubmitting}
        className='h-10 sm:h-9 w-full sm:w-auto sm:min-w-[130px] sm:px-5 rounded-md text-xs font-semibold text-white shadow-sm bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary transition-all cursor-pointer disabled:opacity-60'
      >
        {isSubmitting ? (
          <span className='flex items-center gap-1.5'>
            <Loader2 className='size-3.5 animate-spin' />
            <span>Menyimpan...</span>
          </span>
        ) : (
          <span className='truncate'>
            {mode === 'create'
              ? 'Simpan'
              : isSameStage
                ? 'Simpan'
                : 'Simpan & Pindahkan'}
          </span>
        )}
      </Button>
    </>
  );
}

export function StageDrawerFooter(props: StageDrawerFooterProps) {
  return (
    <DrawerFooter className='shrink-0 z-10 grid grid-cols-2 gap-3 w-full px-4 sm:px-6 py-3 border-t border-border/70 bg-card shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-4 sm:pb-3 sm:flex sm:w-auto sm:justify-end sm:items-center sm:gap-2.5'>
      <StageDrawerFooterActions {...props} />
    </DrawerFooter>
  );
}
