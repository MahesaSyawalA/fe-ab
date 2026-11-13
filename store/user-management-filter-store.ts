import { create } from 'zustand';

export type UserStatusFilter = 'all' | 'aktif' | 'nonaktif';
export type UserSortOption = 'name_asc' | 'name_desc' | 'newest' | 'oldest';

export interface UserManagementFilterState {
  searchQuery: string;
  selectedRole: string;
  selectedStatus: UserStatusFilter;
  sortBy: UserSortOption;
  page: number;
  limit: number;
  isFilterDrawerOpen: boolean;
  setSearchQuery: (searchQuery: string) => void;
  setSelectedRole: (selectedRole: string) => void;
  setSelectedStatus: (selectedStatus: UserStatusFilter) => void;
  setSortBy: (sortBy: UserSortOption) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setFilterDrawerOpen: (isOpen: boolean) => void;
  resetFilters: () => void;
}

const initialUserManagementFilterState = {
  searchQuery: '',
  selectedRole: 'all',
  selectedStatus: 'all' as UserStatusFilter,
  sortBy: 'name_asc' as UserSortOption,
  page: 1,
  limit: 10,
  isFilterDrawerOpen: false,
};

export function countActiveUserFilters(
  role: string,
  status: UserStatusFilter,
  sortBy: UserSortOption
): number {
  let count = 0;
  if (role && role !== 'all') count += 1;
  if (status && status !== 'all') count += 1;
  if (sortBy && sortBy !== 'name_asc') count += 1;
  return count;
}

export const useUserManagementFilterStore = create<UserManagementFilterState>((set) => ({
  ...initialUserManagementFilterState,
  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),
  setSelectedRole: (selectedRole) => set({ selectedRole, page: 1 }),
  setSelectedStatus: (selectedStatus) => set({ selectedStatus, page: 1 }),
  setSortBy: (sortBy) => set({ sortBy, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  setFilterDrawerOpen: (isFilterDrawerOpen) => set({ isFilterDrawerOpen }),
  resetFilters: () =>
    set({
      searchQuery: '',
      selectedRole: 'all',
      selectedStatus: 'all',
      sortBy: 'name_asc',
      page: 1,
      limit: 10,
    }),
}));
