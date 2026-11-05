'use client';

import { useRouter } from 'next/navigation';
import {
  PelangganCard,
  PelangganFilterBar,
  PelangganListEmpty,
  PelangganListHeader,
  usePelangganList,
} from './list';

interface PelangganViewProps {
  basePath?: string;
}

export function PelangganView({ basePath = '/sales/pelanggan' }: PelangganViewProps) {
  const router = useRouter();
  const list = usePelangganList();

  return (
    <div className='mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-5 pb-12'>
      <PelangganListHeader
        title='Pelanggan'
        subtitle='Daftar Pelanggan - Jakarta'
        onAddClick={() => router.push(`${basePath}/tambah`)}
      />

      <PelangganFilterBar
        searchQuery={list.searchQuery}
        onSearchChange={list.setSearchQuery}
        selectedCategory={list.selectedCategory}
        onCategoryChange={list.setSelectedCategory}
        filterChips={list.filterChips}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 w-full min-w-0'>
        {list.filteredList.length > 0 ? (
          list.filteredList.map((client) => (
            <PelangganCard
              key={client.id_pelanggan}
              pelanggan={client}
              onClick={() => router.push(`${basePath}/${client.id_pelanggan}`)}
              onAddContact={() => router.push(`${basePath}/tambah?step=3`)}
            />
          ))
        ) : (
          <PelangganListEmpty />
        )}
      </div>
    </div>
  );
}
