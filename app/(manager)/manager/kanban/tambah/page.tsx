import * as React from 'react';
import { ProspekCreatePageContainer } from '@/components/features/kanban/prospek-page-containers';

export default function ManagerTambahProspekPage() {
  return (
    <React.Suspense fallback={null}>
      <ProspekCreatePageContainer basePath='/manager/kanban' />
    </React.Suspense>
  );
}

