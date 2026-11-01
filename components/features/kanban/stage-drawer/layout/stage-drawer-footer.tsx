import { CheckCircle2 } from 'lucide-react';
import { DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { StageDrawerMode } from '../types';

interface StageDrawerFooterProps {
  mode: StageDrawerMode;
  isSameStage: boolean;
  accentColor: string;
  onClose: () => void;
}

export function StageDrawerFooter({
  mode,
  isSameStage,
  accentColor,
  onClose,
}: StageDrawerFooterProps) {
  return (
    <DrawerFooter className='shrink-0 z-10 flex flex-row items-center justify-end gap-2 px-4 sm:px-6 py-2.5 border-t border-border/70 bg-card shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-3 sm:pb-2.5'>
      <Button
        type='button'
        variant='outline'
        onClick={onClose}
        className='h-8.5 shrink-0 rounded-xl px-3.5 text-xs font-semibold cursor-pointer'
      >
        Batal
      </Button>
      <Button
        type='submit'
        className='h-8.5 flex-1 sm:flex-none gap-2 rounded-xl px-4 sm:px-5 text-xs font-semibold text-white shadow-sm cursor-pointer'
        style={{ backgroundColor: accentColor }}
      >
        <CheckCircle2 className='size-3.5 shrink-0' />
        <span className='truncate'>
          {mode === 'create'
            ? 'Tambah Card'
            : isSameStage
              ? 'Simpan Aktivitas'
              : 'Simpan & Pindahkan'}
        </span>
      </Button>
    </DrawerFooter>
  );
}
