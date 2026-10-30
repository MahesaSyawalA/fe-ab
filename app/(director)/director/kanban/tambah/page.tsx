import * as React from 'react';
import { ProspekCreatePageContainer } from '@/components/features/kanban/prospek-page-containers';

export default function DirectorTambahProspekPage() {
  return (
    <React.Suspense fallback={null}>
      <ProspekCreatePageContainer basePath='/director/kanban' />
    </React.Suspense>
  );
}

