'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { usePelangganDetailQuery } from '@/hooks/queries/use-pelanggan-query';
import { PelangganDetailView } from './pelanggan-detail-view';
import { PelangganDetailSkeleton } from './detail';

interface PelangganDetailPageContainerProps {
  basePath: string;
  canEdit?: boolean;
}

export function PelangganDetailPageContainer({
  basePath,
  canEdit,
}: PelangganDetailPageContainerProps) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id || '';

  const { data, isLoading, isError, refetch } = usePelangganDetailQuery(id);

  if (isLoading) {
    return <PelangganDetailSkeleton />;
  }

  if (isError || !data?.data) {
    return (
      <div className='mx-auto flex w-full max-w-xl md:max-w-2xl min-w-0 flex-col items-center justify-center gap-4 py-20 px-4 text-center'>
        <div className='rounded-2xl border border-border bg-card p-8 flex flex-col items-center gap-3 w-full shadow-2xs'>
          <h3 className='text-base sm:text-lg font-bold text-foreground'>
            Pelanggan Tidak Ditemukan
          </h3>
          <p className='text-xs sm:text-sm text-muted-foreground max-w-sm'>
            Data outlet dengan ID tersebut tidak dapat dimuat atau mungkin telah dihapus.
          </p>
          <div className='flex items-center gap-3 pt-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => router.push(basePath)}
              className='text-xs font-semibold rounded-xl cursor-pointer'
            >
              Kembali ke Daftar
            </Button>
            <Button
              size='sm'
              onClick={() => refetch()}
              className='text-xs font-semibold rounded-xl cursor-pointer bg-primary text-primary-foreground'
            >
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PelangganDetailView
      pelanggan={data.data}
      onBack={() => router.push(basePath)}
      basePath={basePath}
      canEdit={canEdit}
    />
  );
}
