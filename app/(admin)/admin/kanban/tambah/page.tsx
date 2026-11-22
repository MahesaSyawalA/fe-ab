import * as React from 'react';
import { ProspekCreatePageContainer } from '@/components/features/kanban/prospek-page-containers';

export default function AdminTambahProspekPage() {
  return (
    <React.Suspense fallback={null}>
      <ProspekCreatePageContainer basePath='/admin/kanban' />
    </React.Suspense>
  );
}
