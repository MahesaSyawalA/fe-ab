'use client';

import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { PelangganFilterDialog } from './pelanggan-filter-dialog';
import { PelangganFilterSheet } from './pelanggan-filter-sheet';

export interface PelangganFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipeOutlet: string;
  onApply: (tipe: string) => void;
  onReset: () => void;
}

/**
 * Filter Pelanggan Adaptif:
 * - Desktop (>= md): HeroUI Modal (PelangganFilterDialog)
 * - Mobile (< md): Bottom Sheet Drawer (PelangganFilterSheet)
 */
export function PelangganFilterDrawer(props: PelangganFilterDrawerProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <PelangganFilterSheet {...props} />;
  }

  return <PelangganFilterDialog {...props} />;
}
