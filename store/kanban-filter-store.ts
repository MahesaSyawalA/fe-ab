import { create } from 'zustand';

export interface KanbanFilterState {
  searchQuery: string;
  selectedCategory: string;
  activeSquadId: string | null;
  activeSalesId: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setActiveSquadId: (squadId: string | null) => void;
  setActiveSalesId: (salesId: string | null) => void;
  resetFilters: () => void;
}

const initialKanbanFilterState = {
  searchQuery: '',
  selectedCategory: 'all',
  activeSquadId: null,
  activeSalesId: null,
};

export const useKanbanFilterStore = create<KanbanFilterState>((set) => ({
  ...initialKanbanFilterState,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setActiveSquadId: (activeSquadId) => set({ activeSquadId }),
  setActiveSalesId: (activeSalesId) => set({ activeSalesId }),
  resetFilters: () => set(initialKanbanFilterState),
}));

