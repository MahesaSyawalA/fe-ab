'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PelangganFormWizard } from '@/components/features/pelanggan/pelanggan-form-wizard';

function ManagerTambahPelangganContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const stepParam = Number(searchParams.get('step'));
  const initialStep = stepParam >= 1 && stepParam <= 3 ? stepParam : 1;

  return (
    <PelangganFormWizard
      basePath='/manager/pelanggan'
      initialStep={initialStep}
      onBack={() => router.push('/manager/pelanggan')}
    />
  );
}

export default function ManagerTambahPelangganPage() {
  return (
    <React.Suspense fallback={null}>
      <ManagerTambahPelangganContent />
    </React.Suspense>
  );
}

