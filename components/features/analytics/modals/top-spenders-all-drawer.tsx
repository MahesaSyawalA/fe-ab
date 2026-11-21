'use client';

import * as React from 'react';
import { Modal } from '@heroui/react';
import type { DrawerRootChangeEventDetails } from '@base-ui/react/drawer';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatFullRupiah, guardPopupDismiss, toFiniteNumber } from '@/lib/utils';
import type { TopSpenderItem } from '@/types/analytics.types';

interface TopSpendersAllDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: TopSpenderItem[];
}

function TopSpendersAllList({ items }: { items: TopSpenderItem[] }) {
  return (
    <ul className='flex flex-col divide-y divide-border'>
      {items.map((item, idx) => (
        <li
          key={item.id_pelanggan}
          className='flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0'
        >
          <div className='flex items-center gap-2.5 min-w-0'>
            <span className='flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary'>
              {idx + 1}
            </span>
            <div className='min-w-0'>
              <p className='truncate text-xs sm:text-sm font-semibold text-foreground'>
                {item.nama_outlet}
              </p>
              <p className='truncate text-[11px] text-secondary-foreground'>
                {item.tipe_outlet} · {toFiniteNumber(item.jumlah_po)} PO
              </p>
            </div>
          </div>
          <span className='shrink-0 text-xs sm:text-sm font-bold text-primary'>
            {formatFullRupiah(item.total_nilai_po)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function TopSpendersAllDrawer({
  open,
  onOpenChange,
  items,
}: TopSpendersAllDrawerProps) {
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
        <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full sm:max-w-lg max-h-[85dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
          <DrawerHeader className='shrink-0 px-5 pt-2 pb-2 text-left border-b border-border/60 bg-card'>
            <DrawerTitle className='text-base font-bold text-foreground'>
              Semua Top Spenders
            </DrawerTitle>
            <DrawerDescription className='text-xs sm:text-sm text-secondary-foreground'>
              {items.length} pelanggan dengan transaksi PO
            </DrawerDescription>
          </DrawerHeader>
          <div className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-5 py-4'>
            <TopSpendersAllList items={items} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={guardPopupDismiss(onOpenChange)} variant='blur'>
      <Modal.Container>
        <Modal.Dialog className='sm:max-w-lg max-h-[85vh] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl p-0'>
          <Modal.CloseTrigger className='text-secondary-foreground' />
          <Modal.Header className='shrink-0 flex flex-col gap-0.5 px-6 pt-5 pb-3 border-b border-border/70 text-left items-start'>
            <Modal.Heading className='text-base font-bold text-foreground text-left'>
              Semua Top Spenders
            </Modal.Heading>
            <p className='text-xs text-muted-foreground text-left'>
              {items.length} pelanggan dengan transaksi PO
            </p>
          </Modal.Header>
          <Modal.Body className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-6 py-4'>
            <TopSpendersAllList items={items} />
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
