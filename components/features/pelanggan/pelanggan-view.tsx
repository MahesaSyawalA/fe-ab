'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  PelangganCard,
  PelangganCardSkeleton,
  PelangganFilterBar,
  PelangganListEmpty,
  PelangganListHeader,
  usePelangganList,
} from './list';
import { PelangganFilterDrawer } from './filter';

interface PelangganViewProps {
  basePath?: string;
  canAdd?: boolean;
}

export function PelangganView({
  basePath = '/sales/pelanggan',
  canAdd,
}: PelangganViewProps) {
  const router = useRouter();
  const list = usePelangganList();
  const { data: session } = useSession();

  // Role Sales & Manager berhak menambah pelanggan, Director hanya memantau (view-only)
  const isAllowedToAdd = canAdd ?? (session?.user?.role !== 'director');

  return (
    <div className='mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-5 pb-12'>
      <PelangganListHeader
        title='Pelanggan'
        subtitle='Daftar Pelanggan terdaftar dalam sistem pelacakan penjualan'
        onAddClick={isAllowedToAdd ? () => router.push(`${basePath}/tambah`) : undefined}
      />

      <PelangganFilterBar
        searchQuery={list.searchQuery}
        onSearchChange={list.setSearchQuery}
        selectedCategory={list.selectedCategory}
        onCategoryChange={list.setSelectedCategory}
        filterChips={list.filterChips}
        onOpenFilterModal={() => list.setFilterDrawerOpen(true)}
        activeFilterCount={list.activeFilterCount}
      />

      <PelangganFilterDrawer
        open={list.isFilterDrawerOpen}
        onOpenChange={list.setFilterDrawerOpen}
        tipeOutlet={list.selectedCategory}
        onApply={list.setSelectedCategory}
        onReset={list.resetFilters}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 w-full min-w-0'>
        {list.isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <PelangganCardSkeleton key={idx} />
          ))
        ) : list.isError ? (
          <div className='col-span-full flex flex-col items-center justify-center gap-3 py-12 text-center bg-card rounded-2xl border border-border p-6'>
            <p className='text-sm font-medium text-destructive'>
              Gagal memuat data pelanggan. Pastikan server aktif dan koneksi terhubung.
            </p>
            <Button
              variant='outline'
              size='sm'
              onClick={() => list.refetch()}
              className='text-xs font-semibold cursor-pointer'
            >
              Coba Lagi
            </Button>
          </div>
        ) : list.filteredList.length > 0 ? (
          list.filteredList.map((client) => (
            <PelangganCard
              key={client.id_pelanggan}
              pelanggan={client}
              onClick={() => router.push(`${basePath}/${client.id_pelanggan}`)}
              onAddContact={
                isAllowedToAdd
                  ? () => router.push(`${basePath}/tambah?step=3`)
                  : undefined
              }
            />
          ))
        ) : (
          <div className='col-span-full'>
            <PelangganListEmpty />
          </div>
        )}
      </div>
    </div>
  );
}
