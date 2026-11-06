'use client';

import { useParams } from 'next/navigation';
import { useSquadDetailQuery } from '@/hooks/queries';
import { EmptyState } from '@/components/ui/empty-state';
import { SquadFormView } from './squad-form-view';

export function SquadEditPageContainer({ basePath }: { basePath: string }) {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useSquadDetailQuery(id);

  if (isLoading) return null;
  if (isError || !data?.data) {
    return <EmptyState title='Squad tidak ditemukan' description='Squad mungkin sudah dihapus.' />;
  }

  return <SquadFormView basePath={basePath} squad={data.data} />;
}
