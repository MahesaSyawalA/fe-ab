'use client';

import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ProspekNegotiationDrawerProps } from './negotiation/negotiation-content';
import { ProspekNegotiationModal } from './negotiation/prospek-negotiation-modal';
import { ProspekNegotiationSheet } from './negotiation/prospek-negotiation-sheet';

export type { ProspekNegotiationDrawerProps };

export function ProspekNegotiationDrawer(props: ProspekNegotiationDrawerProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <ProspekNegotiationSheet {...props} />;
  }

  return <ProspekNegotiationModal {...props} />;
}
