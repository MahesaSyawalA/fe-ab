'use client';

import * as React from 'react';
import { Modal } from '@heroui/react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { guardPopupDismiss } from '@/lib/utils';
import type { TiketStatus } from '@/types/ticket.types';
import { NegotiationResult } from '../types';

interface ProspekNegotiationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus?: TiketStatus;
  onSelect: (result: NegotiationResult) => void;
}

function NegotiationOptionsContent({
  currentStatus,
  onSelect,
  onCancel,
}: {
  currentStatus?: TiketStatus;
  onSelect: (result: NegotiationResult) => void;
  onCancel: () => void;
}) {
  return (
    <div className='flex flex-col gap-2.5'>
      <Button
        type='button'
        onClick={() => onSelect('negosiasi')}
        className='h-11 w-full rounded-xl bg-primary text-xs font-semibold text-primary-foreground cursor-pointer'
      >
        {currentStatus === 'won' || currentStatus === 'lost'
          ? 'Buka Kembali ke Tahap Negosiasi (Open)'
          : 'Pindahkan ke Tahap Negosiasi'}
      </Button>
      <Button
        type='button'
        variant='outline'
        disabled={currentStatus === 'won'}
        onClick={() => onSelect('won')}
        className='h-11 w-full rounded-xl border-emerald-500/40 bg-emerald-500/10 text-xs font-semibold text-emerald-700 hover:bg-emerald-500/15 disabled:opacity-60 cursor-pointer'
      >
        Menang (WON) — Masuk ke Tahap Selesai
        {currentStatus === 'won' ? ' (Saat Ini)' : ''}
      </Button>
      <Button
        type='button'
        variant='outline'
        disabled={currentStatus === 'lost'}
        onClick={() => onSelect('lost')}
        className='h-11 w-full rounded-xl border-rose-500/40 bg-rose-500/10 text-xs font-semibold text-rose-600 hover:bg-rose-500/15 disabled:opacity-60 cursor-pointer'
      >
        Kalah (LOST) — Tutup Tiket
        {currentStatus === 'lost' ? ' (Saat Ini)' : ''}
      </Button>
      <Button
        type='button'
        variant='outline'
        onClick={onCancel}
        className='mt-1 h-10 w-full rounded-xl border-border bg-card text-xs font-semibold text-secondary-foreground shadow-none hover:bg-muted/50 cursor-pointer'
      >
        Batal
      </Button>
    </div>
  );
}

export function ProspekNegotiationDrawer({
  open,
  onOpenChange,
  currentStatus,
  onSelect,
}: ProspekNegotiationDrawerProps) {
  const isMobile = useIsMobile();
  const handleClose = () => onOpenChange(false);

  const isDecided = currentStatus === 'won' || currentStatus === 'lost';
  const titleText = isDecided
    ? 'Ubah Hasil Negosiasi'
    : 'Tentukan Hasil Negosiasi';
  const descriptionText = isDecided
    ? `Status prospek saat ini: ${currentStatus === 'won' ? 'Menang (WON)' : 'Kalah (LOST)'}. Pilih status baru jika ingin memperbarui.`
    : 'Pilih tindak lanjut tahap atau hasil akhir prospek ini.';

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
        <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full sm:max-w-lg max-h-[92dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
          <DrawerHeader className='shrink-0 px-5 pt-2 pb-2 text-left border-b border-border/60 bg-card'>
            <DrawerTitle className='text-base font-bold text-foreground'>
              {titleText}
            </DrawerTitle>
            <DrawerDescription className='text-xs text-muted-foreground'>
              {descriptionText}
            </DrawerDescription>
          </DrawerHeader>
          <div className='px-5 py-3 pb-6'>
            <NegotiationOptionsContent
              currentStatus={currentStatus}
              onSelect={onSelect}
              onCancel={handleClose}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={guardPopupDismiss(onOpenChange)} variant='blur'>
      <Modal.Container>
        <Modal.Dialog className='sm:max-w-md flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl p-0'>
          <Modal.CloseTrigger className='text-secondary-foreground' />
          <Modal.Header className='shrink-0 flex flex-col gap-0.5 px-6 pt-5 pb-3 border-b border-border/70 text-left items-start'>
            <Modal.Heading className='text-base font-bold text-foreground text-left'>
              {titleText}
            </Modal.Heading>
            <p className='text-xs text-muted-foreground text-left'>
              {descriptionText}
            </p>
          </Modal.Header>
          <Modal.Body className='px-6 py-4'>
            <NegotiationOptionsContent
              currentStatus={currentStatus}
              onSelect={onSelect}
              onCancel={handleClose}
            />
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
