'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { usePelangganStore } from '@/lib/pelanggan-store';
import { PelangganListHeader } from './pelanggan-list-header';
import { PelangganFilterBar } from './pelanggan-filter-bar';
import { PelangganCard } from './pelanggan-card';
import { ChipFilterItem } from '@/components/ui/chip-filter';
import { Card, CardContent } from '@/components/ui/card';

interface PelangganViewProps {
  basePath?: string;
}

export function PelangganView({ basePath = '/sales/pelanggan' }: PelangganViewProps) {
  const router = useRouter();
  const pelangganList = usePelangganStore((state) => state.pelangganList);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('semua');

  const filterChips: ChipFilterItem[] = React.useMemo(() => {
    const total = pelangganList.length;
    const rsCount = pelangganList.filter((p) =>
      p.tipe_faskes.toLowerCase().includes('rumah sakit')
    ).length;
    const klinikCount = pelangganList.filter((p) =>
      p.tipe_faskes.toLowerCase().includes('klinik')
    ).length;
    const apotekCount = pelangganList.filter((p) =>
      p.tipe_faskes.toLowerCase().includes('apotek')
    ).length;

    return [
      { id: 'semua', label: 'Semua', count: total, dotColor: 'bg-kanban-purple' },
      {
        id: 'Rumah Sakit',
        label: 'Rumah Sakit',
        count: rsCount,
        dotColor: 'bg-kanban-pink',
      },
      {
        id: 'Klinik',
        label: 'Klinik',
        count: klinikCount,
        dotColor: 'bg-kanban-orange',
      },
      {
        id: 'Apotek',
        label: 'Apotek',
        count: apotekCount,
        dotColor: 'bg-kanban-green',
      },
    ];
  }, [pelangganList]);

  const filteredList = React.useMemo(() => {
    return pelangganList.filter((item) => {
      if (selectedCategory !== 'semua') {
        if (
          !item.tipe_faskes.toLowerCase().includes(selectedCategory.toLowerCase())
        ) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.nama_faskes.toLowerCase().includes(query);
        const matchesAddress = item.alamat.toLowerCase().includes(query);
        const matchesPic = item.kontak_list?.some((k) =>
          k.nama.toLowerCase().includes(query)
        );
        return matchesName || matchesAddress || matchesPic;
      }

      return true;
    });
  }, [pelangganList, selectedCategory, searchQuery]);

  return (
    <div className='mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-5 pb-12'>
      <PelangganListHeader
        title='Pelanggan'
        subtitle='Daftar Pelanggan - Jakarta'
        onAddClick={() => router.push(`${basePath}/tambah`)}
      />

      <PelangganFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        filterChips={filterChips}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 w-full min-w-0'>
        {filteredList.length > 0 ? (
          filteredList.map((client) => (
            <PelangganCard
              key={client.id_pelanggan}
              pelanggan={client}
              onClick={() => router.push(`${basePath}/${client.id_pelanggan}`)}
              onAddContact={() => router.push(`${basePath}/tambah?step=3`)}
            />
          ))
        ) : (
          <Card
            size='sm'
            className='col-span-full rounded-2xl border border-border ring-0 py-12 text-center shadow-none'
          >
            <CardContent className='items-center justify-center gap-1.5'>
              <p className='text-sm font-semibold text-foreground'>
                Tidak ada pelanggan ditemukan
              </p>
              <p className='text-xs text-muted-foreground'>
                Coba ubah kata kunci pencarian atau filter tipe outlet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
