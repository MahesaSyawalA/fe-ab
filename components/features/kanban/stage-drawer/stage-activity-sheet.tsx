'use client';

import * as React from 'react';
import type { DrawerRootChangeEventDetails } from '@base-ui/react/drawer';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { INITIAL_KANBAN_STAGES } from '@/constants/kanban-constants';
import { JenisTahap } from '@/types/kanban-stage.types';
import {
  StageActivityDrawerProps,
  StageDrawerBody,
  StageDrawerFooter,
  StageDrawerHeader,
  buildCreatedTicketParams,
  buildMoveParams,
  useStageActivityForm,
} from './index';

/**
 * Bottom Sheet Drawer Mobile untuk Aktivitas & Perpindahan Stage Kanban.
 * Menggunakan @/components/ui/drawer dengan gesture swipe down dan sticky footer.
 */
export function StageActivitySheet({
  open,
  onOpenChange,
  mode = 'move',
  ticket,
  fromStage,
  targetStage,
  targetIndex,
  isSubmitting,
  onConfirmMove,
  onCreateTicket,
  onCancelMove,
}: StageActivityDrawerProps) {
  // Backdrop press safety check against Base UI / React Aria event bubbling
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

  const form = useStageActivityForm({ open, mode, ticket, targetStage });
  const stageType: JenisTahap = targetStage?.jenis_tahap ?? 'visit';

  if (!targetStage) return null;

  const handleClose = () => {
    onCancelMove?.();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bukti aktivitas wajib
    if (!form.evidenceFile) {
      form.setEvidenceError(true);
      return;
    }
    form.setEvidenceError(false);

    if (mode === 'create') {
      await onCreateTicket?.(
        buildCreatedTicketParams({
          form,
          targetStage,
          pelangganList: form.pelangganList,
        }),
      );
      return;
    }

    if (!ticket) return;

    await onConfirmMove?.(
      buildMoveParams({ form, ticket, fromStage, targetStage, targetIndex }),
    );
  };

  const effectiveFromStage =
    fromStage ||
    (ticket
      ? INITIAL_KANBAN_STAGES.find((s) => s.id_tahap === ticket.id_tahap) || null
      : null);

  const isSameStage =
    mode === 'move' &&
    Boolean(
      effectiveFromStage && effectiveFromStage.id_tahap === targetStage.id_tahap,
    );

  return (
    <Drawer
      open={open}
      onOpenChange={handleDrawerOpenChange}
      showSwipeHandle
    >
      <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full max-h-[92dvh] flex flex-col p-0 rounded-t-2xl border-t border-border shadow-xl bg-card overflow-hidden'>
        <StageDrawerHeader
          mode={mode}
          ticket={ticket}
          targetStage={targetStage}
          fromStage={effectiveFromStage}
          isSameStage={isSameStage}
          onClose={handleClose}
        />

        <form onSubmit={handleSubmit} className='flex flex-1 min-h-0 flex-col overflow-hidden'>
          <StageDrawerBody mode={mode} stageType={stageType} form={form} />
          <StageDrawerFooter
            mode={mode}
            isSameStage={isSameStage}
            accentColor={targetStage.dotColor}
            isSubmitting={isSubmitting}
            onClose={handleClose}
          />
        </form>
      </DrawerContent>
    </Drawer>
  );
}

