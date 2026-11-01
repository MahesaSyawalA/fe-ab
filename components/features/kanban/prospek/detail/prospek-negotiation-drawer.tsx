import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { NegotiationResult } from '../types';

interface ProspekNegotiationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (result: NegotiationResult) => void;
}

export function ProspekNegotiationDrawer({
  open,
  onOpenChange,
  onSelect,
}: ProspekNegotiationDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full sm:max-w-lg max-h-[92dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
        <DrawerHeader className='shrink-0 px-5 pt-2 pb-2 text-left border-b border-border/60 bg-card'>
          <DrawerTitle className='text-base font-bold text-foreground'>
            Tentukan Hasil Negosiasi
          </DrawerTitle>
        </DrawerHeader>
        <div className='flex flex-col gap-2.5 px-5 py-3 pb-6'>
          <Button
            type='button'
            onClick={() => onSelect('negosiasi')}
            className='h-11 w-full rounded-xl bg-primary text-xs font-semibold text-primary-foreground cursor-pointer'
          >
            Pindahkan ke Tahap Negosiasi
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => onSelect('won')}
            className='h-11 w-full rounded-xl border-emerald-500/40 bg-emerald-500/10 text-xs font-semibold text-emerald-700 hover:bg-emerald-500/15 cursor-pointer'
          >
            Menang (WON) — Masuk ke Tahap Selesai
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => onSelect('lost')}
            className='h-11 w-full rounded-xl border-rose-500/40 bg-rose-500/10 text-xs font-semibold text-rose-600 hover:bg-rose-500/15 cursor-pointer'
          >
            Kalah (LOST) — Tutup Tiket
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
