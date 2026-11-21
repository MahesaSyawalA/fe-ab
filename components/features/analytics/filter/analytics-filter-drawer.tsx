'use client';

import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { FilterSelectOption } from '@/components/features/kanban/filter/inputs/filter-select-input';
import type { AnalyticsParams } from '@/types/analytics.types';
import { AnalyticsFilterDialog } from './analytics-filter-dialog';
import { AnalyticsFilterSheet } from './analytics-filter-sheet';

export interface AnalyticsFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: AnalyticsParams;
  onApply: (nextFilter: AnalyticsParams) => void;
  salesOptions: FilterSelectOption[];
  squadOptions: FilterSelectOption[];
  tipeOptions: FilterSelectOption[];
}

export function AnalyticsFilterDrawer(props: AnalyticsFilterDrawerProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <AnalyticsFilterSheet {...props} />;
  }

  return <AnalyticsFilterDialog {...props} />;
}
