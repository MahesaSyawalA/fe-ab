'use client';

import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  StageActivityDrawerProps,
  CreateTicketDrawerParams,
  StageDrawerMode,
  StageActivityDialog,
  StageActivitySheet,
} from './stage-drawer';

export type { StageDrawerMode, StageActivityDrawerProps, CreateTicketDrawerParams };

/**
 * Komponen orkestrator Stage Activity:
 * - Desktop (>= md): Menampilkan HeroUI Modal (StageActivityDialog)
 * - Mobile (< md): Menampilkan Bottom Sheet (StageActivitySheet)
 */
export function StageActivityDrawer(props: StageActivityDrawerProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <StageActivitySheet {...props} />;
  }

  return <StageActivityDialog {...props} />;
}
