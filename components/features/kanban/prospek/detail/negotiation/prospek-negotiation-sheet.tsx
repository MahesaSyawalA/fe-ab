'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { guardPopupDismiss } from '@/lib/utils';
import {
  NegotiationBodyContent,
  ProspekNegotiationDrawerProps,
  useNegotiationDrawerState,
} from './negotiation-content';

export function ProspekNegotiationSheet(props: ProspekNegotiationDrawerProps) {
  const state = useNegotiationDrawerState(props);

  return (
    <Drawer
      open={props.open}
      onOpenChange={guardPopupDismiss(state.handleOpenChange)}
      showSwipeHandle
    >
      <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full sm:max-w-lg max-h-[92dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
        <DrawerHeader className='shrink-0 px-5 pt-2 pb-3 text-left bg-card'>
          <div className='flex items-start justify-between gap-3'>
            <div className='flex flex-col gap-1'>
              <DrawerTitle className='text-sm sm:text-base font-bold text-foreground text-left'>
                {state.headerTitle}
              </DrawerTitle>
              {state.headerSubtitle && (
                <DrawerDescription className='text-xs sm:text-sm text-secondary-foreground'>
                  {state.headerSubtitle}
                </DrawerDescription>
              )}
            </div>
            <button
              type='button'
              onClick={state.handleClose}
              aria-label='Tutup'
              className='flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary/70 text-secondary-foreground hover:bg-secondary cursor-pointer'
            >
              <X className='size-4' />
            </button>
          </div>
        </DrawerHeader>
        <div className='overflow-y-auto px-5 pb-6'>
          <NegotiationBodyContent
            ticket={props.ticket}
            currentStatus={props.currentStatus}
            isSubmitting={props.isSubmitting}
            state={state}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
