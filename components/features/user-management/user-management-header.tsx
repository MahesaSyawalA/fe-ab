'use client';

import * as React from 'react';
import { ListPageHeader } from '@/components/ui/list-page-header';

interface UserManagementHeaderProps {
  onAddUser?: () => void;
}

export function UserManagementHeader({ onAddUser }: UserManagementHeaderProps) {
  return (
    <ListPageHeader
      title='Kelola Pengguna'
      subtitle='Daftar Pengguna aktif, pembagian role tim sales, dan manajemen akses akun'
      addLabel='Buat Pengguna'
      onAddClick={onAddUser}
    />
  );
}
