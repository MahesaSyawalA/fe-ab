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
        className='h-8.5 shrink-0 rounded-[8px] px-4 text-xs font-semibold cursor-pointer'
      >
        Batal
      </Button>
      <Button
        type='submit'
        disabled={isSubmitting}
        className='h-8.5 flex-1 sm:flex-none rounded-[8px] px-5 text-xs font-semibold text-white shadow-sm bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary transition-all cursor-pointer disabled:opacity-60'
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
    <DrawerFooter className='shrink-0 z-10 flex flex-row items-center justify-end gap-2 px-4 sm:px-6 py-2.5 border-t border-border/70 bg-card shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-3 sm:pb-2.5'>
      <StageDrawerFooterActions {...props} />
    </DrawerFooter>
  );
}
