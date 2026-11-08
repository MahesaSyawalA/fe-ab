import { create } from 'zustand';

export interface KanbanFilterValues {
  stages: string[];
  priorities: string[];
  closingFrom: string;
  closingTo: string;
  minEstimate: string;
  maxEstimate: string;
  salesId: string;
  squadId?: string;
}

export const INITIAL_KANBAN_FILTER_VALUES: KanbanFilterValues = {
  stages: [],
  priorities: [],
  closingFrom: '',
  closingTo: '',
  minEstimate: '',
  maxEstimate: '',
  salesId: '',
  squadId: '',
};

export interface KanbanFilterStoreState {
  searchQuery: string;
  selectedStageId: string;
  isFilterDrawerOpen: boolean;
  isTambahKolomOpen: boolean;
  filterState: KanbanFilterValues;

  setSearchQuery: (query: string) => void;
  setSelectedStageId: (stageId: string) => void;
  setFilterDrawerOpen: (isOpen: boolean) => void;
  setIsFilterDrawerOpen: (isOpen: boolean) => void;
  setTambahKolomOpen: (isOpen: boolean) => void;
  setIsTambahKolomOpen: (isOpen: boolean) => void;
  setFilterState: (
    filterState:
      | KanbanFilterValues
      | ((prev: KanbanFilterValues) => KanbanFilterValues),
  ) => void;
  resetFilters: () => void;
}

export const countActiveFilters = (filter: KanbanFilterValues): number => {
  const { stages, priorities, ...scalars } = filter;
  return (
    stages.length +
    priorities.length +
    Object.values(scalars).filter(Boolean).length
  );
};

export const useKanbanFilterStore = create<KanbanFilterStoreState>((set) => ({
  searchQuery: '',
  selectedStageId: 'visit',
  isFilterDrawerOpen: false,
  isTambahKolomOpen: false,
  filterState: INITIAL_KANBAN_FILTER_VALUES,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedStageId: (selectedStageId) => set({ selectedStageId }),
  setFilterDrawerOpen: (isFilterDrawerOpen) => set({ isFilterDrawerOpen }),
  setIsFilterDrawerOpen: (isFilterDrawerOpen) => set({ isFilterDrawerOpen }),
  setTambahKolomOpen: (isTambahKolomOpen) => set({ isTambahKolomOpen }),
  setIsTambahKolomOpen: (isTambahKolomOpen) => set({ isTambahKolomOpen }),
  setFilterState: (next) =>
    set((state) => ({
      filterState: typeof next === 'function' ? next(state.filterState) : next,
    })),
  resetFilters: () =>
    set({
      searchQuery: '',
      selectedStageId: 'visit',
      isFilterDrawerOpen: false,
      isTambahKolomOpen: false,
      filterState: INITIAL_KANBAN_FILTER_VALUES,
    }),
}));
