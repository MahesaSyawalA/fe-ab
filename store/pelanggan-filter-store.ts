import { create } from 'zustand';

export interface PelangganFilterState {
  searchQuery: string;
  tipeOutlet: string;
  page: number;
  limit: number;
  setSearchQuery: (query: string) => void;
  setTipeOutlet: (tipe: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  resetFilters: () => void;
}

const initialPelangganFilterState = {
  searchQuery: '',
  tipeOutlet: 'semua',
  page: 1,
  limit: 10,
};

export const usePelangganFilterStore = create<PelangganFilterState>((set) => ({
  ...initialPelangganFilterState,
  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),
  setTipeOutlet: (tipeOutlet) => set({ tipeOutlet, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  resetFilters: () => set(initialPelangganFilterState),
}));
