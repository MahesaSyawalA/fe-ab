'use client';

import * as React from 'react';
import { SurfaceCard } from '@/components/ui/surface-card';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatShortDate, toFiniteNumber } from '@/lib/utils';
import type { SiklusPenjualan } from '@/types/analytics.types';

interface SalesCycleCardProps {
  data?: SiklusPenjualan;
  isLoading?: boolean;
}

export function SalesCycleCard({ data, isLoading = false }: SalesCycleCardProps) {
  const items = data?.items ?? [];

  return (
    <SurfaceCard>
      <CardContent className='flex flex-col gap-4 p-4 lg:p-5'>
        <div className='flex flex-col gap-0.5'>
          <h2 className='text-sm sm:text-base font-semibold text-foreground'>Siklus Penjualan</h2>
          <p className='text-xs sm:text-sm text-secondary-foreground'>
            Quotation sampai Revenue
          </p>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div className='flex flex-col gap-1 rounded-xl bg-primary/6 p-3'>
            <span className='text-xs sm:text-sm text-secondary-foreground'>Tercepat</span>
            {isLoading ? (
              <Skeleton className='h-5 w-16 rounded-md' />
            ) : (
              <span className='text-sm sm:text-base font-bold text-primary'>
                {data?.tercepat_hari == null
                  ? '-'
                  : `${toFiniteNumber(data.tercepat_hari).toLocaleString('id-ID')} HARI`}
              </span>
            )}
          </div>

          <div className='flex flex-col gap-1 rounded-xl bg-amber-500/10 p-3'>
            <span className='text-xs sm:text-sm text-secondary-foreground'>Terlama</span>
            {isLoading ? (
              <Skeleton className='h-5 w-16 rounded-md' />
            ) : (
              <span className='text-sm sm:text-base font-bold text-accent'>
                {data?.terlama_hari == null
                  ? '-'
                  : `${toFiniteNumber(data.terlama_hari).toLocaleString('id-ID')} HARI`}
              </span>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className='flex flex-col gap-2.5'>
            <Skeleton className='h-12 w-full rounded-xl' />
            <Skeleton className='h-12 w-full rounded-xl' />
          </div>
        ) : items.length === 0 ? (
          <p className='text-xs text-secondary-foreground'>
            Belum ada deal yang selesai di periode ini.
          </p>
        ) : (
          <ul className='flex flex-col divide-y divide-border text-xs'>
            {items.map((t) => (
              <li
                key={t.id_tiket}
                className='flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0'
              >
                <div className='min-w-0'>
                  <p className='text-xs sm:text-sm truncate font-semibold text-foreground'>{t.judul}</p>
                  <p className='text-xs sm:text-sm truncate text-secondary-foreground'>
                    {t.nama_outlet} · {t.nama_sales}
                    {t.tanggal_closing && ` · closing ${formatShortDate(t.tanggal_closing)}`}
                  </p>
                </div>
                <span className='shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary'>
                  {toFiniteNumber(t.durasi_hari).toLocaleString('id-ID')} hari
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </SurfaceCard>
  );
}
