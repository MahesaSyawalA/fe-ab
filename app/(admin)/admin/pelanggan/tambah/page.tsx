'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PelangganFormWizard } from '@/components/features/pelanggan/pelanggan-form-wizard';

function AdminTambahPelangganContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const stepParam = Number(searchParams.get('step'));
  const initialStep = stepParam >= 1 && stepParam <= 3 ? stepParam : 1;

  return (
    <PelangganFormWizard
      basePath='/admin/pelanggan'
      initialStep={initialStep}
      onBack={() => router.push('/admin/pelanggan')}
    />
  );
}

export default function AdminTambahPelangganPage() {
  return (
    <React.Suspense fallback={null}>
      <AdminTambahPelangganContent />
    </React.Suspense>
  );
}
