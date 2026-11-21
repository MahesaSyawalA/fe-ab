'use client';

import * as React from 'react';
import { Banknote, Footprints, Percent, Timer } from 'lucide-react';
import { ListPageHeader } from '@/components/ui/list-page-header';
import { SurfaceCard } from '@/components/ui/surface-card';
import { CardContent } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { BarList } from '@/components/ui/bar-list';
import {
  usePerformaSalesQuery,
  useSiklusPenjualanQuery,
  useTopSpendersQuery,
} from '@/hooks/queries/use-analytics-query';
import { currentMonthRange } from '@/lib/date-utils';
import {
  formatCompactRupiah,
  formatFullRupiah,
  formatShortDate,
  toFiniteNumber,
} from '@/lib/utils';
import type { AnalyticsParams } from '@/types/analytics.types';
import { AnalyticsFilterBar } from './analytics-filter-bar';

type Variant = 'dashboard' | 'rekap';

const hari = (n: number | string | null | undefined) =>
  n == null ? '-' : `${toFiniteNumber(n).toLocaleString('id-ID')} hari`;
const persen = (n: number | string | null | undefined) =>
  n == null ? '-' : `${toFiniteNumber(n).toLocaleString('id-ID')}%`;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SurfaceCard>
      <CardContent className='flex flex-col gap-4 p-4 lg:p-5'>
        <h2 className='text-sm font-bold text-foreground'>{title}</h2>
        {children}
      </CardContent>
    </SurfaceCard>
  );
}

function Loading() {
  return <Skeleton className='h-32 w-full rounded-xl' />;
}

export function AnalyticsView({ variant }: { variant: Variant }) {
  const [params, setParams] = React.useState<AnalyticsParams>(currentMonthRange);
  const isDashboard = variant === 'dashboard';

  const performa = usePerformaSalesQuery(params);
  const siklus = useSiklusPenjualanQuery(params);
  const topSpenders = useTopSpendersQuery(params);

  const ringkasan = performa.data?.ringkasan;
  const sales = performa.data?.items ?? [];

  return (
    <div className='mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-5 pb-12'>
      <ListPageHeader
        title={isDashboard ? 'Dashboard' : 'Rekap Penjualan'}
        subtitle={
          isDashboard
            ? 'Ringkasan performa penjualan, revenue pipeline, dan aktivitas tim'
            : 'Durasi siklus penjualan dan efektivitas kunjungan per sales'
        }
        addLabel=''
      />

      <AnalyticsFilterBar value={params} onChange={setParams} />

      <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
        <StatCard
          icon={<Banknote className='size-4' />}
          label='Total revenue'
          value={formatCompactRupiah(ringkasan?.total_revenue ?? 0)}
        />
        <StatCard
          icon={<Footprints className='size-4' />}
          label='Total kunjungan'
          value={toFiniteNumber(ringkasan?.total_kunjungan)}
        />
        <StatCard
          icon={<Timer className='size-4' />}
          label='Rata-rata siklus'
          value={hari(siklus.data?.rata_rata_hari)}
        />
        {isDashboard && (
          <StatCard
            icon={<Percent className='size-4' />}
            label='ROI tim'
            value={persen(ringkasan?.roi_persen)}
          />
        )}
      </div>

      <Section title='Revenue vs Kunjungan per Sales'>
        {performa.isLoading ? (
          <Loading />
        ) : sales.length === 0 ? (
          <EmptyState title='Belum ada data' description='Tidak ada sales aktif untuk filter ini.' />
        ) : (
          <BarList
            items={sales.map((s) => ({
              id: s.id_user,
              label: s.nama,
              value: toFiniteNumber(s.revenue),
              valueLabel: formatFullRupiah(s.revenue),
              sublabel: `${s.jumlah_kunjungan} kunjungan · ${s.jumlah_tiket_won} closing · ${
                s.revenue_per_kunjungan === null
                  ? 'belum ada kunjungan di periode ini'
                  : `rata-rata ${formatCompactRupiah(s.revenue_per_kunjungan)} revenue per kunjungan`
              }`,
            }))}
          />
        )}
      </Section>

      {isDashboard ? (
        <div className='grid gap-5 lg:grid-cols-2'>
          <Section title='Top Spenders (nilai PO terbesar)'>
            {topSpenders.isLoading ? (
              <Loading />
            ) : (topSpenders.data ?? []).length === 0 ? (
              <EmptyState title='Belum ada PO' />
            ) : (
              <BarList
                items={(topSpenders.data ?? []).map((c) => ({
                  id: c.id_pelanggan,
                  label: c.nama_outlet,
                  value: toFiniteNumber(c.total_nilai_po),
                  valueLabel: formatCompactRupiah(c.total_nilai_po),
                  sublabel: `${c.tipe_outlet} · ${c.jumlah_po} PO`,
                }))}
              />
            )}
          </Section>

          <Section title='ROI per Sales (revenue vs gaji/biaya)'>
            {sales.length === 0 ? (
              <EmptyState title='Belum ada data' />
            ) : (
              <ul className='flex flex-col divide-y divide-border text-xs'>
                {sales.map((s) => (
                  <li key={s.id_user} className='flex items-center justify-between gap-3 py-2.5'>
                    <div className='min-w-0'>
                      <p className='truncate font-semibold text-foreground'>{s.nama}</p>
                      <p className='text-[11px] text-secondary-foreground'>
                        Biaya {s.biaya === null ? 'belum diisi' : formatCompactRupiah(s.biaya)}
                      </p>
                    </div>
                    <span className='shrink-0 font-bold text-primary'>{persen(s.roi_persen)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      ) : (
        <Section title='Siklus Penjualan (Quotation sampai Revenue)'>
          {siklus.isLoading ? (
            <Loading />
          ) : (siklus.data?.items ?? []).length === 0 ? (
            <EmptyState title='Belum ada closing' description='Belum ada tiket won pada periode ini.' />
          ) : (
            <>
              <p className='text-xs text-secondary-foreground'>
                Tercepat {hari(siklus.data?.tercepat_hari)} · terlama {hari(siklus.data?.terlama_hari)}
              </p>
              <ul className='flex flex-col divide-y divide-border text-xs'>
                {siklus.data?.items.map((t) => (
                  <li key={t.id_tiket} className='flex items-center justify-between gap-3 py-2.5'>
                    <div className='min-w-0'>
                      <p className='truncate font-semibold text-foreground'>{t.judul}</p>
                      <p className='truncate text-[11px] text-secondary-foreground'>
                        {t.nama_outlet} · {t.nama_sales}
                        {t.tanggal_closing && ` · closing ${formatShortDate(t.tanggal_closing)}`}
                      </p>
                    </div>
                    <span className='shrink-0 font-bold text-primary'>{hari(t.durasi_hari)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Section>
      )}
    </div>
  );
}
