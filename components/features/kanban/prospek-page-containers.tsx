'use client';

import * as React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useKanbanTicketDetailQuery } from '@/hooks/queries/use-kanban-query';
import { Skeleton } from '@/components/ui/skeleton';
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

  return <ProspekDetailView ticketId={params.id} basePath={basePath} />;
}

export function ProspekEditPageContainer({ basePath }: { basePath: string }) {
  const params = useParams<{ id: string }>();
  const { data: ticketResponse, isLoading } = useKanbanTicketDetailQuery(
    params.id,
  );
  const ticket = ticketResponse?.data;

  if (isLoading && !ticket) {
    return (
      <div className='mx-auto flex min-h-dvh md:min-h-0 w-full max-w-lg md:max-w-4xl min-w-0 flex-col p-6 gap-6'>
        <Skeleton className='h-12 w-64 rounded-xl' />
        <Skeleton className='h-96 w-full rounded-2xl' />
      </div>
    );
  }

  return (
    <ProspekFormView mode='edit' basePath={basePath} ticket={ticket} />
  );
}

