import { create } from 'zustand';

export interface UserManagementFilterState {
  searchQuery: string;
  selectedRole: string;
  squadFilter: string;
  page: number;
  limit: number;
  isFilterDrawerOpen: boolean;
  setSearchQuery: (searchQuery: string) => void;
  setSelectedRole: (selectedRole: string) => void;
  setSquadFilter: (squadFilter: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setFilterDrawerOpen: (isOpen: boolean) => void;
  resetFilters: () => void;
}

const initialUserManagementFilterState = {
  searchQuery: '',
  selectedRole: 'all',
  squadFilter: '',
  page: 1,
  limit: 10,
  isFilterDrawerOpen: false,
};

export function countActiveUserFilters(squadFilter: string): number {
  let count = 0;
  if (squadFilter && squadFilter !== '' && squadFilter !== 'semua') {
    count += 1;
  }
  return count;
}

export const useUserManagementFilterStore = create<UserManagementFilterState>((set) => ({
  ...initialUserManagementFilterState,
  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),
  setSelectedRole: (selectedRole) => set({ selectedRole, page: 1 }),
  setSquadFilter: (squadFilter) => set({ squadFilter, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  setFilterDrawerOpen: (isFilterDrawerOpen) => set({ isFilterDrawerOpen }),
  resetFilters: () =>
    set({
      searchQuery: '',
      selectedRole: 'all',
      squadFilter: '',
      page: 1,
      limit: 10,
    }),
}));

