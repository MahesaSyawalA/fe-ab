'use client';

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { SurfaceCard } from '@/components/ui/surface-card';
import { CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatCompactRupiah, formatFullRupiah, toFiniteNumber } from '@/lib/utils';
import type { TopSpenderItem } from '@/types/analytics.types';
import { TopSpendersAllDrawer } from '../modals/top-spenders-all-drawer';
import { SegmentedTabs } from './segmented-tabs';

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

interface DonutLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  value?: number;
  percent?: number;
  payload?: PieSliceDatum;
}

const RADIAN = Math.PI / 180;

function createDonutOuterLabel(isMobile: boolean) {
  return function renderDonutOuterLabel({
    cx = 0,
    cy = 0,
    midAngle = 0,
    outerRadius = 0,
    payload,
  }: DonutLabelProps) {
    if (!payload || payload.percent < 3) return null;
    const radius = outerRadius + (isMobile ? 12 : 18);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const isRight = x >= cx;

    if (isMobile) {
      return (
        <text
          x={x}
          y={y}
          textAnchor={isRight ? 'start' : 'end'}
          dominantBaseline='central'
          fontSize={10}
        >
          <tspan x={x} dy={-5} fill={payload.color} fontWeight={600}>
            {formatCompactRupiah(payload.value)}
          </tspan>
          <tspan x={x} dy={11} fill='var(--foreground)' fontWeight={700}>
            {`${payload.percent.toFixed(1).replace('.', ',')}%`}
          </tspan>
        </text>
      );
    }

    return (
      <text
        x={x}
        y={y}
        textAnchor={isRight ? 'start' : 'end'}
        dominantBaseline='central'
        fontSize={11}
      >
        <tspan fill={payload.color} fontWeight={600}>
          {formatCompactRupiah(payload.value)}
        </tspan>
        <tspan fill='var(--foreground)' fontWeight={700}>
          {` ${payload.percent.toFixed(1).replace('.', ',')}%`}
        </tspan>
      </text>
    );
  };
}

function DonutTooltip({ active, payload }: DonutTooltipProps) {
  const datum = payload?.[0]?.payload;
  if (!active || !datum) return null;

  return (
    <div className='min-w-[190px] rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs shadow-lg'>
      <p className='font-bold text-foreground'>{datum.name}</p>
      <div className='my-1.5 h-px bg-border/80' />
      <div className='flex flex-col gap-1 text-[11px]'>
        <div className='flex items-center gap-2'>
          <span
            className='size-2.5 shrink-0 rounded-full'
            style={{ backgroundColor: datum.color }}
          />
          <span className='text-secondary-foreground'>Nilai PO:</span>
          <strong className='font-bold text-foreground'>
            {formatFullRupiah(datum.value)}
          </strong>
        </div>
        <div className='flex items-center gap-2'>
          <span className='size-2.5 shrink-0 rounded-full bg-muted-foreground/40' />
          <span className='text-secondary-foreground'>Transaksi:</span>
          <strong className='font-bold text-foreground'>
            {datum.jumlahPo} PO ({datum.percent.toFixed(1).replace('.', ',')}%)
          </strong>
        </div>
      </div>
    </div>
  );
}

export function TopSpendersCard({ items, isLoading = false }: TopSpendersCardProps) {
  const isMobile = useIsMobile();
  const [mode, setMode] = React.useState<TopSpenderMode>('pie');
  const [allOpen, setAllOpen] = React.useState(false);

  const sortedItems = React.useMemo(
    () =>
      [...items].sort(
        (a, b) => toFiniteNumber(b.total_nilai_po) - toFiniteNumber(a.total_nilai_po),
      ),
    [items],
  );

  const topFive = React.useMemo(() => sortedItems.slice(0, 5), [sortedItems]);
  const topTen = React.useMemo(() => sortedItems.slice(0, 10), [sortedItems]);

  const totalValue = React.useMemo(
    () => topFive.reduce((sum, item) => sum + toFiniteNumber(item.total_nilai_po), 0),
    [topFive],
  );

  const totalPo = React.useMemo(
    () => topFive.reduce((sum, item) => sum + toFiniteNumber(item.jumlah_po), 0),
    [topFive],
  );

  const pieSlices: PieSliceDatum[] = React.useMemo(
    () =>
      topFive.map((item, idx) => {
        const val = toFiniteNumber(item.total_nilai_po);
        return {
          id: item.id_pelanggan,
          name: item.nama_outlet,
          value: val,
          jumlahPo: toFiniteNumber(item.jumlah_po),
          percent: totalValue > 0 ? (val / totalValue) * 100 : 0,
          color: DONUT_COLORS[idx % DONUT_COLORS.length],
        };
      }),
    [topFive, totalValue],
  );

  const topList = topFive;

  return (
    <SurfaceCard>
      <CardContent className='flex flex-col gap-4 p-4 lg:p-5'>
        <div className='flex items-center sm:items-start justify-between gap-2'>
          <div className='flex flex-col gap-0.5'>
            <h2 className='text-sm sm:text-base font-semibold text-foreground'>Top Spenders</h2>
            <p className='hidden sm:block text-xs sm:text-sm text-secondary-foreground'>
              Nilai Purchase Order (PO) terbesar
            </p>
          </div>
          {topTen.length > 0 && (
            <button
              type='button'
              onClick={() => setAllOpen(true)}
              className='inline-flex items-center gap-0.5 text-xs sm:text-sm font-semibold text-primary hover:underline cursor-pointer shrink-0'
            >
              <span>Lihat Semua ({topTen.length})</span>
              <ChevronRight className='size-3.5' />
            </button>
          )}
        </div>

        <SegmentedTabs
          ariaLabel='Mode tampilan Top Spenders'
          options={[
            { id: 'pie', label: 'Pie Chart' },
            { id: 'list', label: 'List' },
          ]}
          value={mode}
          onChange={setMode}
        />

        {isLoading ? (
          <Skeleton className='h-64 sm:h-88 w-full rounded-xl' />
        ) : sortedItems.length === 0 ? (
          <EmptyState title='Belum ada PO' />
        ) : mode === 'pie' ? (
          <div className='flex flex-col gap-3 sm:gap-4'>
            <div className='relative h-64 sm:h-88 w-full min-w-0'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart
                  margin={
                    isMobile
                      ? { top: 8, right: 8, bottom: 8, left: 8 }
                      : { top: 20, right: 32, bottom: 20, left: 32 }
                  }
                >
                  <Pie
                    data={pieSlices}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    innerRadius={isMobile ? '34%' : '34%'}
                    outerRadius={isMobile ? '66%' : '78%'}
                    paddingAngle={2}
                    stroke='none'
                    labelLine={{ strokeWidth: 1, stroke: 'var(--border)' }}
                    label={createDonutOuterLabel(isMobile)}
                  >
                    {pieSlices.map((slice) => (
                      <Cell key={slice.id} fill={slice.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<DonutTooltip />}
                    wrapperStyle={{ zIndex: 50 }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className='pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center text-center'>
                <span className='text-[10px] sm:text-xs font-medium text-secondary-foreground'>
                  {totalPo} PO
                </span>
                <span className='text-xs sm:text-sm font-bold text-foreground px-2'>
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
                  <span className='max-w-[160px] truncate font-medium text-foreground'>
                    {slice.name}
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
        items={topTen}
      />
    </SurfaceCard>
  );
}
