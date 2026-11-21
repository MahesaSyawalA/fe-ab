'use client';

import * as React from 'react';
import { Tabs } from '@heroui/react';
import { ChevronRight } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { SurfaceCard } from '@/components/ui/surface-card';
import { CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCompactRupiah, formatFullRupiah, toFiniteNumber } from '@/lib/utils';
import type { TopSpenderItem } from '@/types/analytics.types';
import { TopSpendersAllDrawer } from '../modals/top-spenders-all-drawer';

type TopSpenderMode = 'pie' | 'list';

interface TopSpendersCardProps {
  items: TopSpenderItem[];
  isLoading?: boolean;
}

interface PieSliceDatum {
  id: string;
  name: string;
  value: number;
  jumlahPo: number;
  percent: number;
  color: string;
}

const DONUT_COLORS = [
  'var(--color-kanban-purple)',
  'var(--color-kanban-pink)',
  'var(--color-kanban-green)',
  'var(--color-kanban-lightblue)',
  'var(--color-kanban-orange)',
];

interface DonutTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: PieSliceDatum }>;
}

function DonutTooltip({ active, payload }: DonutTooltipProps) {
  const datum = payload?.[0]?.payload;
  if (!active || !datum) return null;

  return (
    <div className='rounded-xl border border-border bg-popover px-3 py-2 text-xs shadow-md'>
      <p className='mb-1 font-semibold text-foreground'>{datum.name}</p>
      <p className='text-[11px] font-bold text-primary'>
        {formatFullRupiah(datum.value)}
      </p>
      <p className='text-[11px] text-secondary-foreground'>
        {datum.jumlahPo} PO · {datum.percent.toFixed(1).replace('.', ',')}%
      </p>
    </div>
  );
}

export function TopSpendersCard({ items, isLoading = false }: TopSpendersCardProps) {
  const [mode, setMode] = React.useState<TopSpenderMode>('pie');
  const [allOpen, setAllOpen] = React.useState(false);

  const sortedItems = React.useMemo(
    () =>
      [...items].sort(
        (a, b) => toFiniteNumber(b.total_nilai_po) - toFiniteNumber(a.total_nilai_po),
      ),
    [items],
  );

  const totalValue = React.useMemo(
    () => sortedItems.reduce((sum, item) => sum + toFiniteNumber(item.total_nilai_po), 0),
    [sortedItems],
  );

  const totalPo = React.useMemo(
    () => sortedItems.reduce((sum, item) => sum + toFiniteNumber(item.jumlah_po), 0),
    [sortedItems],
  );

  const pieSlices: PieSliceDatum[] = React.useMemo(() => {
    const topFive = sortedItems.slice(0, 5);
    const others = sortedItems.slice(5);
    const base = topFive.map((item, idx) => {
      const val = toFiniteNumber(item.total_nilai_po);
      return {
        id: item.id_pelanggan,
        name: item.nama_outlet,
        value: val,
        jumlahPo: toFiniteNumber(item.jumlah_po),
        percent: totalValue > 0 ? (val / totalValue) * 100 : 0,
        color: DONUT_COLORS[idx % DONUT_COLORS.length],
      };
    });

    if (others.length > 0) {
      const othersValue = others.reduce(
        (sum, item) => sum + toFiniteNumber(item.total_nilai_po),
        0,
      );
      const othersPo = others.reduce(
        (sum, item) => sum + toFiniteNumber(item.jumlah_po),
        0,
      );
      if (othersValue > 0) {
        base.push({
          id: 'lainnya',
          name: 'Lainnya',
          value: othersValue,
          jumlahPo: othersPo,
          percent: totalValue > 0 ? (othersValue / totalValue) * 100 : 0,
          color: 'var(--muted-foreground)',
        });
      }
    }

    return base;
  }, [sortedItems, totalValue]);

  const topList = sortedItems.slice(0, 5);

  return (
    <SurfaceCard>
      <CardContent className='flex flex-col gap-4 p-4 lg:p-5'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex flex-col gap-0.5'>
            <h2 className='text-sm sm:text-base font-semibold text-foreground'>Top Spenders</h2>
            <p className='text-xs sm:text-sm text-secondary-foreground'>Nilai PO terbesar</p>
          </div>
          {sortedItems.length > 0 && (
            <button
              type='button'
              onClick={() => setAllOpen(true)}
              className='inline-flex items-center gap-0.5 text-xs sm:text-sm font-semibold text-primary hover:underline cursor-pointer shrink-0'
            >
              <span>Lihat Semua ({sortedItems.length})</span>
              <ChevronRight className='size-3.5' />
            </button>
          )}
        </div>

        <Tabs
          selectedKey={mode}
          onSelectionChange={(key) => setMode(String(key) as TopSpenderMode)}
          variant='secondary'
          className='w-fit'
        >
          <Tabs.List
            aria-label='Mode tampilan Top Spenders'
            className='inline-flex rounded-md bg-muted/60 p-1'
          >
            <Tabs.Tab
              id='pie'
              className='relative z-10 rounded-md px-3 py-1.5 text-xs sm:text-sm font-semibold text-muted-foreground transition-colors data-[selected=true]:text-white cursor-pointer'
            >
              Pie Chart
              <Tabs.Indicator className='absolute inset-0 -z-10 rounded-md bg-primary shadow-xs' />
            </Tabs.Tab>
            <Tabs.Tab
              id='list'
              className='relative z-10 rounded-md px-3 py-1.5 text-xs sm:text-sm font-semibold text-muted-foreground transition-colors data-[selected=true]:text-white cursor-pointer'
            >
              List
              <Tabs.Indicator className='absolute inset-0 -z-10 rounded-md bg-primary shadow-xs' />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {isLoading ? (
          <Skeleton className='h-56 w-full rounded-xl' />
        ) : sortedItems.length === 0 ? (
          <EmptyState title='Belum ada PO' />
        ) : mode === 'pie' ? (
          <div className='flex flex-col gap-4'>
            <div className='relative h-56 w-full min-w-0'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={pieSlices}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    innerRadius={54}
                    outerRadius={82}
                    paddingAngle={2}
                    stroke='none'
                  >
                    {pieSlices.map((slice) => (
                      <Cell key={slice.id} fill={slice.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<DonutTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center'>
                <span className='text-[10px] font-medium text-secondary-foreground'>
                  {totalPo} PO
                </span>
                <span className='text-xs sm:text-sm font-bold text-foreground'>
                  {formatCompactRupiah(totalValue)}
                </span>
              </div>
            </div>

            <div className='flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs'>
              {pieSlices.map((slice) => (
                <div key={slice.id} className='flex items-center gap-1.5 min-w-0'>
                  <span
                    className='size-2.5 shrink-0 rounded-full'
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className='max-w-[130px] truncate font-medium text-foreground'>
                    {slice.name}
                  </span>
                  <span className='text-[11px] text-secondary-foreground'>
                    ({slice.percent.toFixed(1).replace('.', ',')}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ul className='flex flex-col divide-y divide-border text-xs'>
            {topList.map((item, idx) => (
              <li
                key={item.id_pelanggan}
                className='flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0'
              >
                <div className='flex items-center gap-2.5 min-w-0'>
                  <span className='flex size-6 sm:size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs sm:text-sm font-bold text-primary'>
                    {idx + 1}
                  </span>
                  <div className='min-w-0'>
                    <p className='truncate text-xs sm:text-sm font-semibold text-foreground'>
                      {item.nama_outlet}
                    </p>
                    <p className='truncate text-xs sm:text-sm text-secondary-foreground'>
                      {item.tipe_outlet} · {toFiniteNumber(item.jumlah_po)} PO
                    </p>
                  </div>
                </div>
                <span className='shrink-0 font-bold text-primary text-xs sm:text-sm'>
                  {formatFullRupiah(item.total_nilai_po)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <TopSpendersAllDrawer
        open={allOpen}
        onOpenChange={setAllOpen}
        items={sortedItems}
      />
    </SurfaceCard>
  );
}
