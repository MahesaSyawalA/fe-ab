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
    resetFilters: storeResetFilters,
  } = usePelangganFilterStore();

  const [page, setPage] = React.useState(1);
  const activeFilterCount = countActivePelangganFilters(selectedCategory);
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const [prevSearch, setPrevSearch] = React.useState(debouncedSearchQuery);
  const [prevCategory, setPrevCategory] = React.useState(selectedCategory);

  if (prevSearch !== debouncedSearchQuery || prevCategory !== selectedCategory) {
    setPrevSearch(debouncedSearchQuery);
    setPrevCategory(selectedCategory);
    setPage(1);
  }

  const resetFilters = React.useCallback(() => {
    storeResetFilters();
    setPage(1);
  }, [storeResetFilters]);

  const queryParams = React.useMemo(
    () => ({
      page,
      limit: 10,
      order: 'desc' as const,
      search: debouncedSearchQuery.trim() || undefined,
      tipe_outlet: selectedCategory === 'semua' ? undefined : selectedCategory,
    }),
    [page, debouncedSearchQuery, selectedCategory],
  );

  const query = usePelangganListQuery(queryParams);

  const rawList = query.data?.data;
  const pelangganList: PelangganWithDetails[] = React.useMemo(() => {
    if (Array.isArray(rawList)) return rawList;
    if (Array.isArray(query.data)) return query.data as unknown as PelangganWithDetails[];
    return [];
  }, [rawList, query.data]);

  const filteredList = React.useMemo(() => {
    const queryStr = debouncedSearchQuery.trim().toLowerCase();

    return pelangganList.filter((item) => {
      if (
        selectedCategory &&
        selectedCategory !== 'semua' &&
        !matchesCategory(item.tipe_outlet, selectedCategory)
      ) {
        return false;
      }

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
    page,
    setPage,
    paginationMeta: query.data?.meta,
    totalPages: query.data?.meta?.total_pages ?? 1,
    total: query.data?.meta?.total ?? filteredList.length,
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
