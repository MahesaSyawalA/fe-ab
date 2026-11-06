import { create } from 'zustand';

export interface PelangganFilterState {
  searchQuery: string;
  tipeFaskes: string;
  page: number;
  limit: number;
  setSearchQuery: (query: string) => void;
  setTipeFaskes: (tipe: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  resetFilters: () => void;
}

const initialPelangganFilterState = {
  searchQuery: '',
  tipeFaskes: 'semua',
  page: 1,
  limit: 10,
};

export const usePelangganFilterStore = create<PelangganFilterState>((set) => ({
  ...initialPelangganFilterState,
  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),
  setTipeFaskes: (tipeFaskes) => set({ tipeFaskes, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  resetFilters: () => set(initialPelangganFilterState),
}));

