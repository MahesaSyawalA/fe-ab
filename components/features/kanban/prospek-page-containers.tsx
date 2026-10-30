'use client';

import * as React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useKanbanStore } from '@/lib/kanban-store';
import { ProspekFormView } from './prospek-form-view';
import { ProspekDetailView } from './prospek-detail-view';

export function ProspekCreatePageContainer({ basePath }: { basePath: string }) {
  const searchParams = useSearchParams();
  const tahap = searchParams.get('tahap') || 'visit';

  return (
    <ProspekFormView
      mode='create'
      basePath={basePath}
      initialStageId={tahap}
    />
  );
}

export function ProspekDetailPageContainer({ basePath }: { basePath: string }) {
  const params = useParams<{ id: string }>();
  const { getTicketById, ticketsByStage } = useKanbanStore();

  const ticket = React.useMemo(() => {
    const found = getTicketById(params.id);
    if (found) return found;
    // Fallback to Mesin Hemodialisa 6 Unit (tkt-0132) if navigating to an arbitrary ID
    return (
      getTicketById('tkt-0132') ??
      Object.values(ticketsByStage).flat()[0]
    );
  }, [params.id, getTicketById, ticketsByStage]);

  if (!ticket) return null;

  return <ProspekDetailView ticket={ticket} basePath={basePath} />;
}

export function ProspekEditPageContainer({ basePath }: { basePath: string }) {
  const params = useParams<{ id: string }>();
  const { getTicketById, ticketsByStage } = useKanbanStore();

  const ticket = React.useMemo(() => {
    const found = getTicketById(params.id);
    if (found) return found;
    return (
      getTicketById('tkt-0142') ??
      Object.values(ticketsByStage).flat()[0]
    );
  }, [params.id, getTicketById, ticketsByStage]);

  return (
    <ProspekFormView mode='edit' basePath={basePath} ticket={ticket} />
  );
}

