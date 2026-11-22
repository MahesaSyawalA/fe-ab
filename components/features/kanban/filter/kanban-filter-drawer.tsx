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
  role?: 'sales' | 'manager' | 'director' | 'admin';
}

export function KanbanFilterDrawer(props: KanbanFilterDrawerProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <KanbanFilterSheet {...props} />;
  }

  return <KanbanFilterDialog {...props} />;
}
