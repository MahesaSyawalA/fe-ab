'use client';

import * as React from 'react';
import { Banknote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCompactRupiah } from '@/lib/utils';

interface AnalyticsHeroRevenueCardProps {
  totalRevenue: number | string | null | undefined;
  totalClosing: number;
  periodLabel: string;
  isLoading?: boolean;
}

export function AnalyticsHeroRevenueCard({
  totalRevenue,
  totalClosing,
  periodLabel,
  isLoading = false,
}: AnalyticsHeroRevenueCardProps) {
  return (
    <Card className='rounded-2xl border-0 bg-linear-to-r from-[#1D4ED8] via-[#2563EB] to-[#3B82F6] py-0 text-white shadow-sm ring-0'>
      <CardContent className='flex flex-col gap-3 p-4 sm:p-5'>
        <div className='flex items-center gap-2.5'>
          <span className='flex size-8 sm:size-10 items-center justify-center rounded-xl bg-white/15 shrink-0'>
            <Banknote className='size-4 sm:size-5 text-white' />
          </span>
          <span className='text-sm sm:text-base font-medium text-white/90'>
            Total Revenue
          </span>
        </div>

        {isLoading ? (
          <Skeleton className='h-8 sm:h-9 w-40 rounded-lg bg-white/20' />
        ) : (
          <span className='text-2xl sm:text-3xl font-bold tracking-tight text-white'>
            {formatCompactRupiah(totalRevenue)}
          </span>
        )}

        <span className='text-xs sm:text-sm text-white/85'>
          {totalClosing > 0
            ? `dari ${totalClosing.toLocaleString('id-ID')} closing · ${periodLabel}`
            : 'Belum ada closing di periode ini'}
        </span>
      </CardContent>
    </Card>
  );
}
