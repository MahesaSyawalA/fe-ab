'use client';

import * as React from 'react';
import { Tabs } from '@heroui/react';
import { Inbox } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/surface-card';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatFullRupiah, toFiniteNumber } from '@/lib/utils';
import type { PerformaSalesItem } from '@/types/analytics.types';

type ChartMode = 'vertical' | 'horizontal';

interface SalesPerformanceChartProps {
  variant: 'dashboard' | 'rekap';
  items: PerformaSalesItem[];
  isLoading?: boolean;
  onResetFilter?: () => void;
}

interface SalesChartDatum {
  nama: string;
  shortName: string;
  revenueJt: number;
  revenueRaw: number;
  kunjungan: number;
  closing: number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: SalesChartDatum }>;
}

function SalesChartTooltip({ active, payload }: ChartTooltipProps) {
  const datum = payload?.[0]?.payload;
  if (!active || !datum) return null;

  return (
    <div className='rounded-xl border border-border bg-popover px-3 py-2 text-xs shadow-md'>
      <p className='mb-1 font-semibold text-foreground'>{datum.nama}</p>
      <div className='flex flex-col gap-0.5 text-[11px]'>
        <span className='text-secondary-foreground'>
          Revenue:{' '}
          <strong className='font-semibold text-primary'>
            {formatFullRupiah(datum.revenueRaw)}
          </strong>
        </span>
        <span className='text-secondary-foreground'>
          Kunjungan:{' '}
          <strong className='font-semibold text-foreground'>
            {datum.kunjungan.toLocaleString('id-ID')}
          </strong>
        </span>
        <span className='text-secondary-foreground'>
          Closing:{' '}
          <strong className='font-semibold text-foreground'>
            {datum.closing.toLocaleString('id-ID')}
          </strong>
        </span>
      </div>
    </div>
  );
}

export function SalesPerformanceChart({
  variant,
  items,
  isLoading = false,
  onResetFilter,
}: SalesPerformanceChartProps) {
  const [mode, setMode] = React.useState<ChartMode>('vertical');

  const chartData: SalesChartDatum[] = React.useMemo(
    () =>
      items.map((s) => {
        const rev = toFiniteNumber(s.revenue);
        const firstWord = s.nama.trim().split(/\s+/)[0] || s.nama;
        return {
          nama: s.nama,
          shortName: firstWord.length > 10 ? `${firstWord.slice(0, 9)}…` : firstWord,
          revenueJt: Math.round((rev / 1_000_000) * 10) / 10,
          revenueRaw: rev,
          kunjungan: toFiniteNumber(s.jumlah_kunjungan),
          closing: toFiniteNumber(s.jumlah_tiket_won),
        };
      }),
    [items],
  );

  const hasData = chartData.some(
    (d) => d.revenueRaw > 0 || d.kunjungan > 0 || d.closing > 0,
  );

  const title =
    variant === 'dashboard' ? 'Performa Sales' : 'Performa Sales';

  const horizontalHeight = Math.max(chartData.length * 58, 220);

  return (
    <SurfaceCard>
      <CardContent className='flex flex-col gap-4 p-4 lg:p-5'>
        <div className='flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between'>
          <h2 className='text-sm sm:text-base font-semibold text-foreground'>{title}</h2>

          <Tabs
            selectedKey={mode}
            onSelectionChange={(key) => setMode(String(key) as ChartMode)}
            variant='secondary'
            className='w-fit'
          >
            <Tabs.List
              aria-label='Mode tampilan grafik performa sales'
              className='inline-flex rounded-md bg-muted/60 p-1'
            >
              <Tabs.Tab
                id='vertical'
                className='relative z-10 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-muted-foreground transition-colors data-[selected=true]:text-white cursor-pointer'
              >
                Bar Chart
                <Tabs.Indicator className='absolute inset-0 -z-10 rounded-md bg-primary shadow-xs' />
              </Tabs.Tab>
              <Tabs.Tab
                id='horizontal'
                className='relative z-10 rounded-md px-3 py-1.5 text-xs sm:text-sm font-semibold text-muted-foreground transition-colors data-[selected=true]:text-white cursor-pointer'
              >
                Horizontal
                <Tabs.Indicator className='absolute inset-0 -z-10 rounded-lg bg-primary shadow-xs' />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </div>

        {isLoading ? (
          <Skeleton className='h-64 w-full rounded-xl' />
        ) : !hasData ? (
          <div className='flex flex-col items-center justify-center gap-3 py-10 text-center'>
            <span className='flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <Inbox className='size-6' />
            </span>
            <div className='flex flex-col gap-1'>
              <p className='text-sm font-bold text-foreground'>Belum ada data</p>
              <p className='max-w-xs text-xs text-secondary-foreground'>
                Coba ubah periode atau reset filter untuk melihat rekap penjualan.
              </p>
            </div>
            {onResetFilter && (
              <Button
                type='button'
                variant='outline'
                onClick={onResetFilter}
                className='h-9 rounded-xl border-primary/40 px-4 text-xs font-semibold text-primary hover:bg-primary/5 cursor-pointer'
              >
                Reset filter
              </Button>
            )}
          </div>
        ) : mode === 'vertical' ? (
          <div className='h-72 w-full min-w-0'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: -16, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' vertical={false} />
                <XAxis
                  dataKey='shortName'
                  tick={{ fontSize: 11, fill: 'var(--secondary-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--secondary-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<SalesChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  iconType='circle'
                  iconSize={8}
                />
                <Bar
                  dataKey='closing'
                  name='Closing'
                  stackId='sales'
                  fill='var(--accent-default)'
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey='kunjungan'
                  name='Kunjungan'
                  stackId='sales'
                  fill='var(--color-kanban-orange)'
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey='revenueJt'
                  name='Revenue (jt)'
                  stackId='sales'
                  fill='var(--primary-default)'
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className='w-full min-w-0' style={{ height: horizontalHeight }}>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={chartData}
                layout='vertical'
                margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' horizontal={false} />
                <XAxis
                  type='number'
                  tick={{ fontSize: 11, fill: 'var(--secondary-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type='category'
                  dataKey='shortName'
                  width={74}
                  tick={{ fontSize: 11, fill: 'var(--foreground)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<SalesChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  iconType='circle'
                  iconSize={8}
                />
                <Bar
                  dataKey='revenueJt'
                  name='Revenue (jt)'
                  fill='var(--primary-default)'
                  barSize={8}
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey='kunjungan'
                  name='Kunjungan'
                  fill='var(--color-kanban-orange)'
                  barSize={8}
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey='closing'
                  name='Closing'
                  fill='var(--accent-default)'
                  barSize={8}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </SurfaceCard>
  );
}
