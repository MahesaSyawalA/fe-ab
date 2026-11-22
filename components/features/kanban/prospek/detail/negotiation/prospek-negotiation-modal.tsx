'use client';

import * as React from 'react';
import { Modal } from '@heroui/react';
import { guardPopupDismiss } from '@/lib/utils';
import {
  NegotiationBodyContent,
  ProspekNegotiationDrawerProps,
  useNegotiationDrawerState,
} from './negotiation-content';

export function ProspekNegotiationModal(props: ProspekNegotiationDrawerProps) {
  const state = useNegotiationDrawerState(props);

  return (
    <Modal.Backdrop
      isOpen={props.open}
      onOpenChange={guardPopupDismiss(state.handleOpenChange)}
      variant='blur'
    >
      <Modal.Container>
        <Modal.Dialog className='sm:max-w-md flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl p-0'>
          <Modal.CloseTrigger className='text-secondary-foreground' />
          <Modal.Header className='shrink-0 flex flex-col gap-1 px-6 pt-5 pb-3 text-left items-start'>
            <Modal.Heading className='text-sm sm:text-base font-bold text-foreground text-left'>
              {state.headerTitle}
            </Modal.Heading>
            {state.headerSubtitle && (
              <p className='text-xs sm:text-sm text-secondary-foreground text-left'>
                {state.headerSubtitle}
              </p>
            )}
          </Modal.Header>
          <Modal.Body className='px-6 pb-6 pt-1'>
            <NegotiationBodyContent
              ticket={props.ticket}
              currentStatus={props.currentStatus}
              isSubmitting={props.isSubmitting}
              state={state}
            />
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
