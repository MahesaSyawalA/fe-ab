'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/ui/empty-state';
import { ListPageHeader } from '@/components/ui/list-page-header';
import { SearchFilterBar } from '@/components/ui/search-filter-bar';
import {
  SquadCard,
  SquadCardSkeleton,
  SquadFilterModal,
  useSquadList,
} from './list';

export function SquadView({ basePath }: { basePath: string }) {
  const router = useRouter();
  const list = useSquadList();
  const [filterOpen, setFilterOpen] = React.useState(false);

  return (
    <div className='mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-5 pb-12'>
      <ListPageHeader
        title='Squad'
        subtitle='Daftar Squad'
        addLabel='Tambah Squad'
        onAddClick={() => router.push(`${basePath}/tambah`)}
      />

      <SearchFilterBar
        searchQuery={list.searchQuery}
        onSearchChange={list.setSearchQuery}
        onOpenFilterModal={() => setFilterOpen(true)}
        activeFilterCount={list.status === 'semua' ? 0 : 1}
      />

      <div className='grid w-full min-w-0 grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {list.isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <SquadCardSkeleton key={idx} />
          ))
        ) : list.filteredList.length > 0 ? (
          list.filteredList.map((squad) => (
            <SquadCard
              key={squad.id_squad}
              squad={squad}
              onEdit={() => router.push(`${basePath}/${squad.id_squad}/edit`)}
            />
          ))
        ) : (
          <EmptyState
            title='Tidak ada squad ditemukan'
            description={
              list.isError
                ? 'Gagal memuat data squad. Coba muat ulang halaman.'
                : 'Coba ubah kata kunci pencarian atau filter status.'
            }
          />
        )}
      </div>

      <SquadFilterModal
        open={filterOpen}
        onOpenChange={setFilterOpen}
        status={list.status}
        onStatusChange={list.setStatus}
      />
    </div>
  );
}
