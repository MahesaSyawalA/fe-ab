'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PelangganDetailView } from '@/components/features/pelanggan/pelanggan-detail-view';
import { usePelangganStore } from '@/lib/pelanggan-store';

export default function SalesDetailPelangganPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const pelangganList = usePelangganStore((state) => state.pelangganList);

  const pelanggan = React.useMemo(() => {
    return (
      pelangganList.find((p) => p.id_pelanggan === params.id) ||
      pelangganList[0]
    );
  }, [pelangganList, params.id]);

  if (!pelanggan) {
    return null;
  }

  return (
    <PelangganDetailView
      pelanggan={pelanggan}
      onBack={() => router.push('/sales/pelanggan')}
    />
  );
}

