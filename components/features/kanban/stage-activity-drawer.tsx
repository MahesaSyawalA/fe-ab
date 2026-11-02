'use client';

import * as React from 'react';
import type { DrawerRootChangeEventDetails } from '@base-ui/react/drawer';
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
  useDrawerOverlayGuard,
  StageDrawerOverlayGuardProvider,
} from './stage-drawer';

export type { StageDrawerMode, StageActivityDrawerProps };

const formatTarget = (target: EventTarget | null) => {
  const el = target as HTMLElement | null;
  if (!el || !el.tagName) return 'unknown';
  const tagName = el.tagName.toLowerCase();
  const rawClass =
    typeof el.className === 'string'
      ? el.className
      : typeof el.className === 'object' && el.className && 'baseVal' in el.className
        ? String((el.className as { baseVal: string }).baseVal)
        : '';
  const firstTwoClasses = rawClass
    ? rawClass.trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.')
    : '';
  return firstTwoClasses ? `${tagName}.${firstTwoClasses}` : tagName;
};

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
  const { reportSelectOpenChange, isSelectOpenRef, lastClosedAtRef, cooldownMs } =
    useDrawerOverlayGuard();

  const handleDrawerOpenChange = React.useCallback(
    (nextOpen: boolean, eventDetails?: DrawerRootChangeEventDetails) => {
      const now = Math.round(performance.now());
      const msSinceSelectClosed =
        lastClosedAtRef.current > 0 ? Date.now() - lastClosedAtRef.current : -1;
      const isRecentlyClosed =
        lastClosedAtRef.current > 0 && msSinceSelectClosed < cooldownMs;
      const isGuarded = isSelectOpenRef.current || isRecentlyClosed;

      const targetEl = eventDetails?.event?.target as HTMLElement | null;
      const targetDesc = eventDetails?.event
        ? formatTarget(eventDetails.event.target)
        : 'none';
      const isInsidePopup = Boolean(
        targetEl &&
          typeof targetEl.closest === 'function' &&
          targetEl.closest('[data-slot="drawer-popup"]'),
      );

      let canceled = false;

      if (!nextOpen && eventDetails) {
        // Aturan 1: outside-press tetapi target klik sebenarnya berada DI DALAM popup drawer
        const isClickInsidePopup =
          eventDetails.reason === 'outside-press' && isInsidePopup;

        // Aturan 2: Select sedang terbuka atau baru saja menutup (cooldown)
        const isSelectGuarded =
          isGuarded &&
          (eventDetails.reason === 'outside-press' ||
            eventDetails.reason === 'escape-key');

        if (isClickInsidePopup || isSelectGuarded) {
          eventDetails.cancel();
          canceled = true;
        }
      }

      // TEMP-DIAGNOSTIC: hapus setelah debugging
      console.log(
        `[guard] ${now}ms handleDrawerOpenChange: nextOpen=${nextOpen}, reason=${eventDetails?.reason ?? 'none'}, selectOpen=${isSelectOpenRef.current}, msSinceClosed=${msSinceSelectClosed}, target=${targetDesc}, insidePopup=${isInsidePopup}, canceled=${canceled}`,
      );

      if (!canceled) {
        onOpenChange(nextOpen);
      }
    },
    [onOpenChange, isSelectOpenRef, lastClosedAtRef, cooldownMs],
  );

  // TEMP-DIAGNOSTIC: hapus setelah debugging
  React.useEffect(() => {
    console.log('[guard] instrumentation v1 loaded');

    const handlePointerOrClick = (e: Event) => {
      const now = Math.round(performance.now());
      const targetDesc = formatTarget(e.target);
      const hasPopoverInDom = Boolean(document.querySelector('[role="listbox"]'));

      // TEMP-DIAGNOSTIC: hapus setelah debugging
      console.log(
        `[guard] ${now}ms document.${e.type} (capture): target=${targetDesc}, hasPopoverInDom=${hasPopoverInDom}`,
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const now = Math.round(performance.now());
        const targetDesc = formatTarget(e.target);
        const hasPopoverInDom = Boolean(document.querySelector('[role="listbox"]'));

        // TEMP-DIAGNOSTIC: hapus setelah debugging
        console.log(
          `[guard] ${now}ms document.keydown(Escape) (capture): target=${targetDesc}, hasPopoverInDom=${hasPopoverInDom}`,
        );
      }
    };

    document.addEventListener('pointerdown', handlePointerOrClick, true);
    document.addEventListener('pointerup', handlePointerOrClick, true);
    document.addEventListener('click', handlePointerOrClick, true);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('pointerdown', handlePointerOrClick, true);
      document.removeEventListener('pointerup', handlePointerOrClick, true);
      document.removeEventListener('click', handlePointerOrClick, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

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
    <StageDrawerOverlayGuardProvider
      reportSelectOpenChange={reportSelectOpenChange}
    >
      <Drawer
        open={open}
        onOpenChange={handleDrawerOpenChange}
        showSwipeHandle
      >
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
    </StageDrawerOverlayGuardProvider>
  );
}
