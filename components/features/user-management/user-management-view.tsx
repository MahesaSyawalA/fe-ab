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
  INITIAL_DUMMY_USERS,
  type ManagedUser,
  type RoleFilterValue,
} from './types';

export function UserManagementView() {
  const [users, setUsers] = React.useState<ManagedUser[]>(INITIAL_DUMMY_USERS);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState<RoleFilterValue>('all');

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<ManagedUser | null>(null);

  const roleCounts: Record<RoleFilterValue, number> = React.useMemo(() => {
    return {
      all: users.length,
      director: users.filter((u) => u.role === 'director').length,
      sales_manager: users.filter((u) => u.role === 'sales_manager').length,
      sales: users.filter((u) => u.role === 'sales').length,
    };
  }, [users]);

  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      if (selectedRole !== 'all' && user.role !== selectedRole) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = user.nama.toLowerCase().includes(query);
        const matchEmail = user.email.toLowerCase().includes(query);
        const matchPhone = user.no_telp.toLowerCase().includes(query);
        const matchSquad = user.squad ? user.squad.toLowerCase().includes(query) : false;
        return matchName || matchEmail || matchPhone || matchSquad;
      }
      return true;
    });
  }, [users, selectedRole, searchQuery]);

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

  const handleCreateUser = (newUser: ManagedUser) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleUpdateUser = (updatedUser: ManagedUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
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
        onRoleChange={setSelectedRole}
        roleCounts={roleCounts}
        onOpenFilterModal={handleOpenFilterModal}
      />

      <UserManagementTable
        users={filteredUsers}
        onEditUser={handleEditUser}
        onResetPassword={handleResetPassword}
      />

      <CreateUserModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreateUser={handleCreateUser}
      />

      <EditUserModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        user={selectedUser}
        onUpdateUser={handleUpdateUser}
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
