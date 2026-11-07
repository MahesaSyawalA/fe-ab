import { create } from 'zustand';

export interface PelangganFilterState {
  searchQuery: string;
  tipeOutlet: string;
  page: number;
  limit: number;
  isFilterDrawerOpen: boolean;
  setSearchQuery: (query: string) => void;
  setTipeOutlet: (tipe: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setFilterDrawerOpen: (open: boolean) => void;
  resetFilters: () => void;
}

const initialPelangganFilterState = {
  searchQuery: '',
  tipeOutlet: 'semua',
  page: 1,
  limit: 10,
  isFilterDrawerOpen: false,
};

export function countActivePelangganFilters(tipeOutlet: string): number {
  let count = 0;
  if (tipeOutlet && tipeOutlet !== 'semua') {
    count += 1;
  }
  return count;
}

export const usePelangganFilterStore = create<PelangganFilterState>((set) => ({
  ...initialPelangganFilterState,
  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),
  setTipeOutlet: (tipeOutlet) => set({ tipeOutlet, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  setFilterDrawerOpen: (isFilterDrawerOpen) => set({ isFilterDrawerOpen }),
  resetFilters: () =>
    set({
      searchQuery: '',
      tipeOutlet: 'semua',
      page: 1,
      limit: 10,
    }),
}));
