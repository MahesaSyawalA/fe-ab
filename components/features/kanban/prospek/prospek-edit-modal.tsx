'use client';

import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProspekForm } from './form/use-prospek-form';
import { ProspekEditDialog } from './prospek-edit-dialog';
import { ProspekEditDrawer } from './prospek-edit-drawer';
import type { TiketWithDetails } from '@/types/ticket.types';

export interface ProspekEditModalProps {
  ticket: TiketWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  basePath?: string;
  onSuccess?: () => void;
}

/**
 * Komponen orkestrator Edit Prospek:
 * - Desktop (>= md): Menampilkan HeroUI Modal (ProspekEditDialog)
 * - Mobile (< md): Menampilkan Bottom Sheet (ProspekEditDrawer)
 */
export function ProspekEditModal(props: ProspekEditModalProps) {
  const isMobile = useIsMobile();
  const formState = useProspekForm({
    mode: 'edit',
    basePath: props.basePath || '/sales/kanban',
    ticket: props.ticket,
    onSuccess: () => {
      props.onSuccess?.();
      props.onOpenChange(false);
    },
  });

  if (isMobile) {
    return (
      <ProspekEditDrawer
        open={props.open}
        onOpenChange={props.onOpenChange}
        formState={formState}
        ticket={props.ticket}
      />
    );
  }

  return (
    <ProspekEditDialog
      open={props.open}
      onOpenChange={props.onOpenChange}
      formState={formState}
      ticket={props.ticket}
    />
  );
}

