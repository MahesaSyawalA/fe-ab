'use client';

import * as React from 'react';
import { ListPageHeader } from '@/components/ui/list-page-header';
import {
  usePerformaSalesQuery,
  useSiklusPenjualanQuery,
  useTopSpendersQuery,
} from '@/hooks/queries/use-analytics-query';
import { currentMonthRange } from '@/lib/date-utils';
import { toFiniteNumber } from '@/lib/utils';
import type { AnalyticsParams } from '@/types/analytics.types';
import { AnalyticsFilterBar, formatPeriodLabel } from './analytics-filter-bar';
import { AnalyticsHeroRevenueCard } from './cards/analytics-hero-revenue-card';
import { AnalyticsKpiGrid } from './cards/analytics-kpi-grid';
import { SalesCycleCard } from './cards/sales-cycle-card';
import { SalesRoiCard } from './cards/sales-roi-card';
import { SalesPerformanceChart } from './charts/sales-performance-chart';
import { TopSpendersCard } from './charts/top-spenders-card';

type Variant = 'dashboard' | 'rekap';

export function AnalyticsView({ variant }: { variant: Variant }) {
  const [params, setParams] = React.useState<AnalyticsParams>(currentMonthRange);
  const isDashboard = variant === 'dashboard';

  const performa = usePerformaSalesQuery(params);
  const siklus = useSiklusPenjualanQuery(params);
  const topSpenders = useTopSpendersQuery({ ...params, limit: 50 });

  const ringkasan = performa.data?.ringkasan;
  const sales = performa.data?.items ?? [];
  const totalClosing = sales.reduce(
    (sum, item) => sum + toFiniteNumber(item.jumlah_tiket_won),
    0,
  );
  const periodLabel = formatPeriodLabel(params.from, params.to);
  const handleResetFilter = () => setParams(currentMonthRange());

  return (
    <div className='mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-5 pb-12'>
      <ListPageHeader
        title={isDashboard ? 'Dashboard Eksekutif' : 'Rekap Penjualan'}
        subtitle={
          isDashboard
            ? 'Konsolidasi realtime'
            : 'Durasi siklus penjualan dan efektivitas kunjungan per sales'
        }
        addLabel=''
      />

      <AnalyticsFilterBar value={params} onChange={setParams} />

      <AnalyticsHeroRevenueCard
        totalRevenue={ringkasan?.total_revenue ?? 0}
        totalClosing={totalClosing}
        periodLabel={periodLabel}
        isLoading={performa.isLoading}
      />

      <AnalyticsKpiGrid
        variant={variant}
        totalKunjungan={ringkasan?.total_kunjungan ?? 0}
        avgCycleDays={siklus.data?.rata_rata_hari ?? null}
        roiPersen={ringkasan?.roi_persen ?? null}
        isLoading={performa.isLoading || siklus.isLoading}
      />

      <SalesPerformanceChart
        variant={variant}
        items={sales}
        isLoading={performa.isLoading}
        onResetFilter={handleResetFilter}
      />

      {isDashboard ? (
        <div className='grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2'>
          <TopSpendersCard
            items={topSpenders.data ?? []}
            isLoading={topSpenders.isLoading}
          />
          <SalesRoiCard items={sales} isLoading={performa.isLoading} />
        </div>
      ) : (
        <SalesCycleCard data={siklus.data} isLoading={siklus.isLoading} />
      )}
    </div>
  );
}
