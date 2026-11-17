'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { toast } from '@heroui/react';
import { UserManagementHeader } from './user-management-header';
import { UserManagementFilters } from './user-management-filters';
import { UserManagementTable } from './table/user-management-table';
import { UserManagementFilterModal } from './filter/user-management-filter-modal';
import {
  CreateUserModal,
  EditUserModal,
  ResetPasswordModal,
} from './modals';
import {
  useUserManagementFilterStore,
  countActiveUserFilters,
  type UserStatusFilter,
  type UserSortOption,
} from '@/store/user-management-filter-store';
import { useDebounce } from '@/hooks/use-debounce';
import {
  useUserListQuery,
  useUserCountsSourceQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} from '@/hooks/queries/use-user-query';
import { AppPagination } from '@/components/ui/app-pagination';
import { normalizeRole } from '@/lib/rbac';
import { getErrorMessage } from '@/lib/axios';
import type { CreateUserApiPayload, UpdateUserApiPayload } from '@/services/user-service';
import {
  ROLE_FILTER_OPTIONS,
  type ManagedUser,
  type RoleFilterOption,
  type RoleFilterValue,
} from './types';

export function UserManagementView() {
  const { data: session } = useSession();
  const currentUserRole = normalizeRole(session?.user?.role);

  const searchQuery = useUserManagementFilterStore((state) => state.searchQuery);
  const setSearchQuery = useUserManagementFilterStore((state) => state.setSearchQuery);
  const selectedRole = useUserManagementFilterStore((state) => state.selectedRole) as RoleFilterValue;
  const setSelectedRole = useUserManagementFilterStore((state) => state.setSelectedRole);
  const selectedStatus = useUserManagementFilterStore((state) => state.selectedStatus);
  const setSelectedStatus = useUserManagementFilterStore((state) => state.setSelectedStatus);
  const sortBy = useUserManagementFilterStore((state) => state.sortBy);
  const setSortBy = useUserManagementFilterStore((state) => state.setSortBy);
  const isFilterDrawerOpen = useUserManagementFilterStore((state) => state.isFilterDrawerOpen);
  const setFilterDrawerOpen = useUserManagementFilterStore((state) => state.setFilterDrawerOpen);
  const resetFilters = useUserManagementFilterStore((state) => state.resetFilters);
  const page = useUserManagementFilterStore((state) => state.page);
  const setPage = useUserManagementFilterStore((state) => state.setPage);
  const limit = useUserManagementFilterStore((state) => state.limit);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<ManagedUser | null>(null);

  const { data: userListData, isLoading: isUserLoading } = useUserListQuery({
    page,
    limit,
    search: debouncedSearch.trim() || undefined,
    role: selectedRole === 'all' ? undefined : (selectedRole as ManagedUser['role']),
  });

  const { data: userCountsData } = useUserCountsSourceQuery(debouncedSearch);

  const mapAndFilterUsers = React.useCallback(
    (rawUsers?: typeof userListData extends undefined ? never : NonNullable<typeof userListData>['data']) => {
      if (!rawUsers) return [];
      let list: ManagedUser[] = rawUsers
        .filter((u) => {
          if (u.role === 'admin') return false;
          if (currentUserRole === 'director' && u.role === 'director') return false;
          if (currentUserRole === 'manager' && u.role !== 'sales') return false;
          return true;
        })
        .map((u) => ({
          id: u.id_user,
          nama: u.nama,
          email: u.email,
          no_telp: u.no_telp || '-',
          role: u.role,
          id_squad: u.id_squad,
          squad: u.squad?.nama_squad ?? null,
          status: (u.is_active ? 'aktif' : 'nonaktif') as ManagedUser['status'],
        }));

      if (selectedStatus !== 'all') {
        list = list.filter((u) => u.status === selectedStatus);
      }

      return list;
    },
    [currentUserRole, selectedStatus],
  );

  const users: ManagedUser[] = React.useMemo(() => {
    const list = mapAndFilterUsers(userListData?.data);

    if (sortBy === 'name_asc') {
      list.sort((a, b) => a.nama.localeCompare(b.nama));
    } else if (sortBy === 'name_desc') {
      list.sort((a, b) => b.nama.localeCompare(a.nama));
    }

    return list;
  }, [mapAndFilterUsers, userListData, sortBy]);

  const filterOptions: RoleFilterOption[] = React.useMemo(() => {
    if (currentUserRole === 'director') {
      return ROLE_FILTER_OPTIONS.filter((opt) => opt.key !== 'director');
    }
    return ROLE_FILTER_OPTIONS;
  }, [currentUserRole]);

  const roleCounts: Record<RoleFilterValue, number> = React.useMemo(() => {
    const allVisibleUsers = mapAndFilterUsers(userCountsData);
    return {
      all: allVisibleUsers.length,
      director: allVisibleUsers.filter((u) => u.role === 'director').length,
      sales_manager: allVisibleUsers.filter((u) => u.role === 'sales_manager').length,
      sales: allVisibleUsers.filter((u) => u.role === 'sales').length,
    };
  }, [mapAndFilterUsers, userCountsData]);

  const activeFilterCount = countActiveUserFilters(selectedRole, selectedStatus, sortBy);

  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();

  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  const handleEditUser = (user: ManagedUser) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleResetPassword = (user: ManagedUser) => {
    setSelectedUser(user);
    setIsResetPasswordOpen(true);
  };

  const handleCreateUser = async (payload: CreateUserApiPayload) => {
    try {
      await createMutation.mutateAsync(payload);
      toast.success('Pengguna Berhasil Dibuat', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            Akun untuk <strong>{payload.nama}</strong> telah berhasil ditambahkan.
          </span>
        ),
      });
      setIsCreateOpen(false);
    } catch (error) {
      toast.danger('Gagal Membuat Pengguna', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            {getErrorMessage(error) || 'Terjadi kesalahan pada server.'}
          </span>
        ),
      });
    }
  };

  const handleUpdateUser = async (id: string, payload: UpdateUserApiPayload) => {
    try {
      await updateMutation.mutateAsync({ id, data: payload });
      toast.success('Perubahan Berhasil Disimpan', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            Data akun telah berhasil diperbarui.
          </span>
        ),
      });
      setIsEditOpen(false);
    } catch (error) {
      toast.danger('Gagal Memperbarui Pengguna', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            {getErrorMessage(error) || 'Terjadi kesalahan pada server.'}
          </span>
        ),
      });
    }
  };

  const handleResetPasswordSuccess = () => {
    toast.success('Password Berhasil Direset', {
      description: (
        <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
          Password baru telah aktif dan siap dibagikan ke pengguna.
        </span>
      ),
    });
  };

  const handleApplyFilterModal = (filters: {
    role: string;
    status: UserStatusFilter;
    sortBy: UserSortOption;
  }) => {
    setSelectedRole(filters.role);
    setSelectedStatus(filters.status);
    setSortBy(filters.sortBy);
  };

  return (
    <div className='mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-5 pb-12'>
      <UserManagementHeader onAddUser={handleOpenCreate} />

      <UserManagementFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRole={selectedRole}
        onRoleChange={(role) => setSelectedRole(role)}
        roleCounts={roleCounts}
        onOpenFilterModal={() => setFilterDrawerOpen(true)}
        activeFilterCount={activeFilterCount}
        filterOptions={filterOptions}
      />

      <UserManagementTable
        users={users}
        isLoading={isUserLoading}
        onEditUser={handleEditUser}
        onResetPassword={handleResetPassword}
      />

      {!isUserLoading && users.length > 0 && (
        <AppPagination
          page={page}
          totalPages={userListData?.meta?.total_pages ?? 1}
          onPageChange={setPage}
          meta={userListData?.meta}
          total={userListData?.meta?.total}
          limit={limit}
        />
      )}

      <UserManagementFilterModal
        open={isFilterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        selectedRole={selectedRole}
        selectedStatus={selectedStatus}
        sortBy={sortBy}
        onApply={handleApplyFilterModal}
        onReset={resetFilters}
      />

      <CreateUserModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreateUser={handleCreateUser}
        isSubmitting={createMutation.isPending}
      />

      <EditUserModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        user={selectedUser}
        onUpdateUser={handleUpdateUser}
        isSubmitting={updateMutation.isPending}
      />

      <ResetPasswordModal
        open={isResetPasswordOpen}
        onOpenChange={setIsResetPasswordOpen}
        user={selectedUser}
        onResetSuccess={handleResetPasswordSuccess}
      />
    </div>
  );
}
