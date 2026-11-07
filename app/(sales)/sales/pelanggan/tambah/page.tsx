'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PelangganFormWizard } from '@/components/features/pelanggan/pelanggan-form-wizard';

function TambahPelangganContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const stepParam = Number(searchParams.get('step'));
  const initialStep = stepParam >= 1 && stepParam <= 3 ? stepParam : 1;

  return (
    <PelangganFormWizard
      basePath='/sales/pelanggan'
      initialStep={initialStep}
      onBack={() => router.push('/sales/pelanggan')}
    />
  );
}

export default function SalesTambahPelangganPage() {
  return (
    <React.Suspense fallback={null}>
      <TambahPelangganContent />
    </React.Suspense>
  );
}
