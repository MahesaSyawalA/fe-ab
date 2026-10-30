import * as React from 'react';
import { ProspekCreatePageContainer } from '@/components/features/kanban/prospek-page-containers';

export default function SalesTambahProspekPage() {
  return (
    <React.Suspense fallback={null}>
      <ProspekCreatePageContainer basePath='/sales/kanban' />
    </React.Suspense>
  );
}

