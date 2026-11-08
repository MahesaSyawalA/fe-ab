import * as React from 'react';
import { ChipFilterItem } from '@/components/ui/chip-filter';
import { PELANGGAN_CATEGORY_CHIPS } from '@/constants/pelanggan-constants';
import { usePelangganListQuery } from '@/hooks/queries';
import { useDebounce } from '@/hooks/use-debounce';
import {
  usePelangganFilterStore,
  countActivePelangganFilters,
} from '@/store/pelanggan-filter-store';
import type { PelangganWithDetails } from '@/types/customer.types';

const normalizeStr = (str: string) =>
  str
    .toLowerCase()
    .replace(/[_\s-]+/g, ' ')
    .trim();

export const matchesCategory = (
  tipeOutlet?: string | null,
  category?: string | null,
) => {
  if (!category || category === 'semua') return true;
  if (!tipeOutlet) return false;
  const t = normalizeStr(tipeOutlet);
  const c = normalizeStr(category);
  return t === c || t.includes(c) || c.includes(t);
};

export function usePelangganList() {
  const {
    searchQuery,
    tipeOutlet: selectedCategory,
    setSearchQuery,
    setTipeOutlet: setSelectedCategory,
    isFilterDrawerOpen,
    setFilterDrawerOpen,
    resetFilters,
  } = usePelangganFilterStore();

  const activeFilterCount = countActivePelangganFilters(selectedCategory);
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const queryParams = React.useMemo(
    () => ({
      search: debouncedSearchQuery.trim() || undefined,
      tipe_outlet: selectedCategory === 'semua' ? undefined : selectedCategory,
    }),
    [debouncedSearchQuery, selectedCategory],
  );

  const query = usePelangganListQuery(queryParams);

  const rawList = query.data?.data;
  const pelangganList: PelangganWithDetails[] = React.useMemo(() => {
    if (Array.isArray(rawList)) return rawList;
    if (Array.isArray(query.data)) return query.data as unknown as PelangganWithDetails[];
    return [];
  }, [rawList, query.data]);

  // Client-side filtering fallback: memastikan hasil filter & search selalu akurat di UI
  // meskipun backend endpoint mengembalikan seluruh dataset tanpa filter DB.
  const filteredList = React.useMemo(() => {
    const queryStr = debouncedSearchQuery.trim().toLowerCase();

    return pelangganList.filter((item) => {
      // 1. Filter Tipe Outlet
      if (
        selectedCategory &&
        selectedCategory !== 'semua' &&
        !matchesCategory(item.tipe_outlet, selectedCategory)
      ) {
        return false;
      }

      // 2. Filter Search Query (nama outlet, alamat, nama kontak)
      if (queryStr) {
        const matchNama = item.nama_outlet?.toLowerCase().includes(queryStr);
        const matchAlamat = item.alamat?.toLowerCase().includes(queryStr);
        const matchKontak = Boolean(
          item.kontak_list?.some((k) =>
            k.nama?.toLowerCase().includes(queryStr),
          ),
        );

        if (!matchNama && !matchAlamat && !matchKontak) {
          return false;
        }
      }

      return true;
    });
  }, [pelangganList, selectedCategory, debouncedSearchQuery]);

  // Hitung ulang badge counter pada filter chips secara dinamis berdasarkan seluruh data riil
  const filterChips: ChipFilterItem[] = React.useMemo(
    () => [
      {
        id: 'semua',
        label: 'Semua',
        count: pelangganList.length,
        dotColor: 'bg-kanban-purple',
      },
      ...PELANGGAN_CATEGORY_CHIPS.map((chip) => ({
        ...chip,
        count: pelangganList.filter((p) =>
          matchesCategory(p.tipe_outlet, chip.id),
        ).length,
      })),
    ],
    [pelangganList],
  );

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filterChips,
    filteredList,
    pelangganList,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFilterDrawerOpen,
    setFilterDrawerOpen,
    activeFilterCount,
    resetFilters,
  };
}
