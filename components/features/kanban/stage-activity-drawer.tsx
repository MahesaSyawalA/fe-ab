'use client';

import * as React from 'react';
import { Form } from '@heroui/react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { INITIAL_KANBAN_STAGES } from '@/constants/kanban-constants';
import { JenisTahap } from '@/types/kanban-stage.types';

// Modular Subcomponents & Types
import {
  StageActivityDrawerProps,
  StageDrawerMode,
  StageDrawerBody,
  StageDrawerFooter,
  StageDrawerHeader,
  buildCreatedTicket,
  buildMoveParams,
  useStageActivityForm,
} from './stage-drawer';

export type { StageDrawerMode, StageActivityDrawerProps };

export function StageActivityDrawer({
  open,
  onOpenChange,
  mode = 'move',
  ticket,
  fromStage,
  targetStage,
  targetIndex,
  onConfirmMove,
  onCreateTicket,
  onCancelMove,
}: StageActivityDrawerProps) {
  const form = useStageActivityForm({ open, mode, ticket, targetStage });
  const stageType: JenisTahap = targetStage?.jenis_tahap ?? 'visit';

  if (!targetStage) return null;

  const handleClose = () => {
    onCancelMove?.();
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Bukti aktivitas wajib
    if (!form.evidenceFile) {
      form.setEvidenceError(true);
      return;
    }
    form.setEvidenceError(false);

    if (mode === 'create') {
      onCreateTicket?.(
        buildCreatedTicket({
          form,
          targetStage,
          pelangganList: form.pelangganList,
        }),
      );
      onOpenChange(false);
      return;
    }

    if (!ticket) return;

    onConfirmMove?.(
      buildMoveParams({ form, ticket, fromStage, targetStage, targetIndex }),
    );
    onOpenChange(false);
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
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full sm:max-w-xl md:max-w-2xl max-h-[90dvh] flex flex-col p-0 rounded-t-2xl border-t border-border shadow-xl bg-card overflow-hidden'>
        <StageDrawerHeader
          mode={mode}
          ticket={ticket}
          targetStage={targetStage}
          fromStage={effectiveFromStage}
          isSameStage={isSameStage}
          onClose={handleClose}
        />

        <Form onSubmit={handleSubmit} className='flex flex-1 min-h-0 flex-col overflow-hidden' validationBehavior='native'>
          <StageDrawerBody mode={mode} stageType={stageType} form={form} />
          <StageDrawerFooter
            mode={mode}
            isSameStage={isSameStage}
            accentColor={targetStage.dotColor}
            onClose={handleClose}
          />
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
