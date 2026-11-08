'use client';

import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { KanbanFilterState } from './filter-state';
import { KanbanFilterDialog } from './kanban-filter-dialog';
import { KanbanFilterSheet } from './kanban-filter-sheet';

export interface KanbanFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: KanbanFilterState;
  onApply: (nextFilter: KanbanFilterState) => void;
}

/**
 * Filter Kanban Adaptif:
 * - Desktop (>= md): HeroUI Modal (KanbanFilterDialog)
 * - Mobile (< md): Bottom Sheet Drawer (KanbanFilterSheet)
 */
export function KanbanFilterDrawer(props: KanbanFilterDrawerProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <KanbanFilterSheet {...props} />;
  }

  return <KanbanFilterDialog {...props} />;
}
