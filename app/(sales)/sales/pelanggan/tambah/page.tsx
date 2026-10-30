'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PelangganFormWizard } from '@/components/features/pelanggan/pelanggan-form-wizard';
import { usePelangganStore } from '@/lib/pelanggan-store';
import { PelangganWithDetails } from '@/types/customer.types';

function TambahPelangganContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addPelanggan = usePelangganStore((state) => state.addPelanggan);

  const stepParam = Number(searchParams.get('step'));
  const initialStep = stepParam >= 1 && stepParam <= 3 ? stepParam : 1;

  const handleSave = (newClient: PelangganWithDetails) => {
    addPelanggan(newClient);
    router.push(`/sales/pelanggan/${newClient.id_pelanggan}`);
  };

  return (
    <PelangganFormWizard
      initialStep={initialStep}
      onBack={() => router.push('/sales/pelanggan')}
      onSave={handleSave}
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

