'use client';

import * as React from 'react';
import { toast } from '@heroui/react';
import { UserManagementHeader } from './user-management-header';
import { UserManagementFilters } from './user-management-filters';
import { UserManagementTable } from './table/user-management-table';
import {
  CreateUserModal,
  EditUserModal,
  ResetPasswordModal,
} from './modals';
import {
  useUserManagementFilterStore,
} from '@/store/user-management-filter-store';
import { useDebounce } from '@/hooks/use-debounce';
import {
  useUserListQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} from '@/hooks/queries/use-user-query';
import { useSquadListQuery } from '@/hooks/queries/use-squad-query';
import { AppPagination } from '@/components/ui/app-pagination';
import { getErrorMessage } from '@/lib/axios';
import type { CreateUserApiPayload, UpdateUserApiPayload } from '@/services/user-service';
import type { ManagedUser, RoleFilterValue } from './types';

export function UserManagementView() {
  const searchQuery = useUserManagementFilterStore((state) => state.searchQuery);
  const setSearchQuery = useUserManagementFilterStore((state) => state.setSearchQuery);
  const selectedRole = useUserManagementFilterStore((state) => state.selectedRole) as RoleFilterValue;
  const setSelectedRole = useUserManagementFilterStore((state) => state.setSelectedRole);
  const squadFilter = useUserManagementFilterStore((state) => state.squadFilter);
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
    id_squad: squadFilter || undefined,
  });

  const { data: squadData } = useSquadListQuery({ limit: 100 });
  const squadMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    squadData?.data?.forEach((s) => {
      map[s.id_squad] = s.nama_squad;
    });
    return map;
  }, [squadData]);

  const users: ManagedUser[] = React.useMemo(() => {
    if (!userListData?.data) return [];
    return userListData.data.map((u) => ({
      id: u.id_user,
      nama: u.nama,
      email: u.email,
      no_telp: u.no_telp || '-',
      role: u.role,
      id_squad: u.id_squad,
      squad: u.id_squad ? squadMap[u.id_squad] || null : null,
      status: 'aktif',
    }));
  }, [userListData, squadMap]);

  const roleCounts: Record<RoleFilterValue, number> = React.useMemo(() => {
    return {
      all: userListData?.meta?.total ?? users.length,
      director: users.filter((u) => u.role === 'director').length,
      sales_manager: users.filter((u) => u.role === 'sales_manager').length,
      sales: users.filter((u) => u.role === 'sales').length,
    };
  }, [users, userListData?.meta?.total]);

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

  const handleOpenFilterModal = () => {
    toast.info('Filter Pengguna', {
      description: (
        <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
          Penyaringan cepat dapat dilakukan langsung melalui role filter chip di atas.
        </span>
      ),
    });
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
        onOpenFilterModal={handleOpenFilterModal}
      />

      <UserManagementTable
        users={users}
        isLoading={isUserLoading}
        squadMap={squadMap}
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
