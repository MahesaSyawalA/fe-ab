'use client';

import * as React from 'react';
import { Modal } from '@heroui/react';
import { ArrowRight, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { INITIAL_KANBAN_STAGES, PRIORITY_CONFIG } from '@/constants/kanban-constants';
import { JenisTahap } from '@/types/kanban-stage.types';
import { cn } from '@/lib/utils';
import {
  StageActivityDrawerProps,
  StageDrawerBody,
  StageDrawerFooterActions,
  buildCreatedTicketParams,
  buildMoveParams,
  useStageActivityForm,
} from './index';

/**
 * Modal Desktop untuk Aktivitas & Perpindahan Stage Kanban.
 * Menggunakan @heroui/react Modal komponen (Backdrop, Container, Dialog, CloseTrigger, Header, Body, Footer).
 */
export function StageActivityDialog({
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
  const form = useStageActivityForm({ open, mode, ticket, targetStage });
  const stageType: JenisTahap = targetStage?.jenis_tahap ?? 'visit';

  if (!targetStage) return null;

  const handleClose = () => {
    onCancelMove?.();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    <Modal.Backdrop isOpen={open} onOpenChange={onOpenChange} variant='blur'>
      <Modal.Container>
        <Modal.Dialog className='sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl p-0'>
          <Modal.CloseTrigger className='text-secondary-foreground' onClick={handleClose} />
          <Modal.Header className='shrink-0 flex flex-col gap-1 px-6 pt-5 pb-3 border-b border-border/70 text-left items-start'>
            <div className='flex items-center gap-1.5 min-w-0 flex-wrap'>
              {mode === 'move' ? (
                <>
                  {!isSameStage && effectiveFromStage && (
                    <>
                      <Badge
                        variant='outline'
                        className='h-5 gap-1 rounded-full border-border bg-muted/40 px-2 text-[10px] font-medium text-muted-foreground'
                      >
                        <span
                          className='size-1.5 rounded-full'
                          style={{ backgroundColor: effectiveFromStage.dotColor }}
                        />
                        {effectiveFromStage.nama_tahap}
                      </Badge>
                      <ArrowRight className='size-3 text-muted-foreground shrink-0' />
                    </>
                  )}
                  <Badge
                    className='h-5 gap-1 rounded-full px-2 text-[10px] font-semibold text-white shadow-xs'
                    style={{ backgroundColor: targetStage.dotColor }}
                  >
                    <span className='size-1.5 rounded-full bg-white/80' />
                    {isSameStage ? `Aktivitas: ${targetStage.nama_tahap}` : targetStage.nama_tahap}
                  </Badge>
                </>
              ) : (
                <Badge
                  className='h-5 gap-1 rounded-full px-2 text-[10px] font-semibold text-white shadow-xs'
                  style={{ backgroundColor: targetStage.dotColor }}
                >
                  <Plus className='size-3' />
                  Tambah Card: {targetStage.nama_tahap}
                </Badge>
              )}
            </div>

            <Modal.Heading className='text-base sm:text-lg font-bold text-foreground text-left w-full mt-1'>
              {mode === 'move' && ticket ? (
                <span className='flex items-center gap-1.5 truncate'>
                  <span className='text-foreground'>{ticket.kode_tiket}</span>
                  <span className='text-muted-foreground font-normal'>—</span>
                  <span className='truncate font-semibold'>{ticket.judul}</span>
                </span>
              ) : (
                `Tambah Card ke Tahap ${targetStage.nama_tahap}`
              )}
            </Modal.Heading>

            <div className='text-xs text-muted-foreground flex items-center gap-1.5 text-left w-full'>
              {mode === 'move' && ticket ? (
                <span className='flex flex-wrap items-center gap-1.5 text-[11px] text-left'>
                  <span className='text-primary font-medium'>{ticket.nama_outlet}</span>
                  <span>·</span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[10px] font-medium',
                      PRIORITY_CONFIG[ticket.prioritas]?.badgeClass || 'bg-muted text-muted-foreground',
                    )}
                  >
                    {PRIORITY_CONFIG[ticket.prioritas]?.label || ticket.prioritas}
                  </span>
                  <span>·</span>
                  <span>{ticket.nama_pic || 'PIC Outlet'}</span>
                </span>
              ) : (
                <span className='text-[11px] text-muted-foreground'>
                  Lengkapi data prospek baru dan unggah bukti pendukung awal
                </span>
              )}
            </div>
          </Modal.Header>

          <form onSubmit={handleSubmit} className='flex flex-col flex-1 min-h-0 overflow-hidden'>
            <Modal.Body className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-6 py-4'>
              <StageDrawerBody mode={mode} stageType={stageType} form={form} />
            </Modal.Body>

            <Modal.Footer className='sticky bottom-0 z-10 shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-md px-6 py-3 flex items-center justify-end gap-3'>
              <StageDrawerFooterActions
                mode={mode}
                isSameStage={isSameStage}
                accentColor={targetStage.dotColor}
                isSubmitting={isSubmitting}
                onClose={handleClose}
              />
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

