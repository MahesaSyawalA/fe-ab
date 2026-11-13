'use client';

import * as React from 'react';
import { toast } from '@heroui/react';
import { UserManagementHeader } from './user-management-header';
import { UserManagementFilters } from './user-management-filters';
import { UserManagementTable } from './table/user-management-table';
import {
  INITIAL_DUMMY_USERS,
  type ManagedUser,
  type RoleFilterValue,
} from './types';

export function UserManagementView() {
  const [users] = React.useState<ManagedUser[]>(INITIAL_DUMMY_USERS);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState<RoleFilterValue>('all');

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<ManagedUser | null>(null);

  void isCreateOpen;
  void isEditOpen;
  void isResetPasswordOpen;
  void selectedUser;

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
    toast.info('Form Buat Pengguna', {
      description: (
        <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
          Modal pembuatan akun baru siap diintegrasikan pada Tahap 2.
        </span>
      ),
    });
  };

  const handleEditUser = (user: ManagedUser) => {
    setSelectedUser(user);
    setIsEditOpen(true);
    toast.info(`Edit Pengguna: ${user.nama}`, {
      description: (
        <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
          Modal edit data pengguna siap diintegrasikan pada Tahap 2.
        </span>
      ),
    });
  };

  const handleResetPassword = (user: ManagedUser) => {
    setSelectedUser(user);
    setIsResetPasswordOpen(true);
    toast.info(`Reset Password: ${user.nama}`, {
      description: (
        <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
          Modal reset password siap diintegrasikan pada Tahap 2.
        </span>
      ),
    });
  };

  const handleOpenFilterModal = () => {
    toast.info('Filter Pengguna', {
      description: (
        <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
          Filter lanjutan status & squad siap diintegrasikan pada Tahap 2.
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
    </div>
  );
}
