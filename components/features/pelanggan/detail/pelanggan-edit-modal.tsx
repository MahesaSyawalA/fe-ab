'use client';

import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePelangganEditForm } from './use-pelanggan-edit-form';
import { PelangganEditDialog } from './pelanggan-edit-dialog';
import { PelangganEditDrawer } from './pelanggan-edit-drawer';
import type { PelangganWithDetails } from '@/types/customer.types';

export interface PelangganEditModalProps {
  pelanggan: PelangganWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Komponen orkestrator Edit Pelanggan:
 * - Desktop (>= md): Menampilkan HeroUI Modal (PelangganEditDialog)
 * - Mobile (< md): Menampilkan Bottom Sheet (PelangganEditDrawer)
 */
export function PelangganEditModal(props: PelangganEditModalProps) {
  const isMobile = useIsMobile();
  const formState = usePelangganEditForm(props);

  if (isMobile) {
    return <PelangganEditDrawer open={props.open} formState={formState} />;
  }

  return <PelangganEditDialog open={props.open} formState={formState} />;
}
