'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Info } from 'lucide-react';
import { normalizeRole } from '@/lib/rbac';
import { Tooltip } from '@heroui/react';
import { SurfaceCard } from '@/components/ui/surface-card';
import { CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatCompactRupiah, toFiniteNumber } from '@/lib/utils';
import type { PerformaSalesItem } from '@/types/analytics.types';

interface SalesRoiCardProps {
  items: PerformaSalesItem[];
  isLoading?: boolean;
}

export function SalesRoiCard({ items, isLoading = false }: SalesRoiCardProps) {
  const { data: session } = useSession();
  const activeRole = normalizeRole(session?.user?.role);
  const manageUsersHref =
    activeRole === 'admin'
      ? '/admin/kelola-pengguna'
      : '/director/kelola-pengguna';
  const filledItems = items.filter((s) => toFiniteNumber(s.biaya) > 0);
  const unfilledCount = items.length - filledItems.length;

  const maxValue = Math.max(
    ...filledItems.flatMap((s) => [
      toFiniteNumber(s.revenue),
      toFiniteNumber(s.biaya),
    ]),
    1,
  );

  return (
    <SurfaceCard>
      <CardContent className='flex flex-col gap-4 p-4 lg:p-5'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex flex-col gap-0.5'>
            <h2 className='text-sm sm:text-base font-semibold text-foreground'>ROI per Sales</h2>
            <p className='text-xs sm:text-sm text-secondary-foreground'>
              Perbandingan Return on Investment (ROI) per sales
            </p>
          </div>
          <Tooltip delay={150}>
            <Tooltip.Trigger
              aria-label='Informasi rumus ROI per Sales'
              className='inline-flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors cursor-pointer'
            >
              <Info className='size-4' />
            </Tooltip.Trigger>
            <Tooltip.Content className='max-w-xs rounded-lg border border-border bg-popover px-3 py-2 text-xs leading-relaxed text-popover-foreground shadow-md'>
              Rasio dihitung dari total revenue dibagi gaji atau biaya bulanan sales pada periode terpilih.
            </Tooltip.Content>
          </Tooltip>
        </div>

        {isLoading ? (
          <div className='flex flex-col gap-3'>
            <Skeleton className='h-14 w-full rounded-xl' />
            <Skeleton className='h-14 w-full rounded-xl' />
          </div>
        ) : filledItems.length === 0 ? (
          <EmptyState
            title='Belum ada biaya sales terisi'
            description='Isi gaji/biaya bulanan sales untuk melihat perbandingan ROI.'
          />
        ) : (
          <ul className='flex flex-col divide-y divide-border'>
            {filledItems.map((s) => {
              const revenue = toFiniteNumber(s.revenue);
              const biaya = toFiniteNumber(s.biaya);
              const ratio = biaya > 0 ? revenue / biaya : 0;
              const revenueWidth = Math.max((revenue / maxValue) * 100, revenue > 0 ? 3 : 0);
              const biayaWidth = Math.max((biaya / maxValue) * 100, biaya > 0 ? 3 : 0);
              const badgeClass =
                ratio >= 1.5
                  ? 'bg-emerald-50 text-success'
                  : ratio >= 1
                    ? 'bg-amber-50 text-warning'
                    : 'bg-rose-50 text-destructive';

              return (
                <li key={s.id_user} className='flex flex-col gap-2 py-3 first:pt-0 last:pb-0'>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='truncate text-xs sm:text-sm font-semibold text-foreground'>
                      {s.nama}
                    </span>
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2.5 py-0.5 text-xs sm:text-sm font-bold',
                        badgeClass,
                      )}
                    >
                      {`${ratio.toFixed(1).replace('.', ',')}x`}
                    </span>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <div className='h-2 w-full overflow-hidden rounded-full bg-secondary'>
                      <div
                        className='h-full rounded-full bg-primary transition-all'
                        style={{ width: `${revenueWidth}%` }}
                      />
                    </div>
                    <div className='h-2 w-full overflow-hidden rounded-full bg-secondary'>
                      <div
                        className='h-full rounded-full bg-muted-foreground/35 transition-all'
                        style={{ width: `${biayaWidth}%` }}
                      />
                    </div>
                  </div>

                  <div className='flex items-center justify-between gap-2 text-[11px]'>
                    <span className='text-secondary-foreground text-xs sm:text-sm'>
                      Revenue:{' '}
                      <strong className='font-semibold text-primary'>
                        {formatCompactRupiah(revenue)}
                      </strong>
                    </span>
                    <span className='text-secondary-foreground text-xs sm:text-sm'>
                      Biaya:{' '}
                      <strong className='font-semibold text-destructive'>
                        {formatCompactRupiah(biaya)}
                      </strong>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {unfilledCount > 0 && (
          <div className='flex items-center justify-between gap-2 border-t border-border/70 pt-3 text-xs'>
            <span className='text-secondary-foreground text-xs sm:text-sm'>
              Belum diisi ({unfilledCount})
            </span>
            <Link
              href={manageUsersHref}
              className='font-semibold text-primary hover:underline text-xs sm:text-sm'
            >
              Isi Sekarang
            </Link>
          </div>
        )}
      </CardContent>
    </SurfaceCard>
  );
}
