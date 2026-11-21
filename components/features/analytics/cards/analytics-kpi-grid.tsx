'use client';

import * as React from 'react';
import { Footprints, Percent, Timer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, toFiniteNumber } from '@/lib/utils';

interface AnalyticsKpiGridProps {
  variant: 'dashboard' | 'rekap';
  totalKunjungan: number | string | null | undefined;
  avgCycleDays: number | string | null | undefined;
  roiPersen?: number | string | null | undefined;
  isLoading?: boolean;
}

interface KpiItem {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBgClass: string;
}

export function AnalyticsKpiGrid({
  variant,
  totalKunjungan,
  avgCycleDays,
  roiPersen,
  isLoading = false,
}: AnalyticsKpiGridProps) {
  const items: KpiItem[] = [
    {
      label: 'Total Kunjungan',
      value: toFiniteNumber(totalKunjungan).toLocaleString('id-ID'),
      icon: <Footprints className='size-4 text-amber-600' />,
      iconBgClass: 'bg-amber-50',
    },
    {
      label: 'Rata-rata siklus',
      value:
        avgCycleDays == null
          ? '-'
          : `${toFiniteNumber(avgCycleDays).toLocaleString('id-ID')} hari`,
      icon: <Timer className='size-4 text-orange-500' />,
      iconBgClass: 'bg-orange-50',
    },
  ];

  if (variant === 'dashboard') {
    items.push({
      label: 'ROI tim',
      value:
        roiPersen == null
          ? '-'
          : `${toFiniteNumber(roiPersen).toLocaleString('id-ID')}%`,
      icon: <Percent className='size-4 text-amber-600' />,
      iconBgClass: 'bg-amber-50',
    });
  }

  return (
    <div
      className={cn(
        'grid gap-3 sm:gap-4',
        variant === 'rekap' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3',
      )}
    >
      {items.map((item) => (
        <Card
          key={item.label}
          className='rounded-2xl border border-border bg-card py-0 shadow-2xs ring-0'
        >
          <CardContent className='flex flex-col gap-2 p-3.5 sm:p-4'>
            <span
              className={cn(
                'flex size-8 items-center justify-center rounded-lg',
                item.iconBgClass,
              )}
            >
              {item.icon}
            </span>
            {isLoading ? (
              <Skeleton className='h-6 w-20 rounded-md' />
            ) : (
              <span className='text-lg sm:text-xl font-bold tracking-tight text-foreground truncate'>
                {item.value}
              </span>
            )}
            <span className='text-xs sm:text-sm text-secondary-foreground truncate'>
              {item.label}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
