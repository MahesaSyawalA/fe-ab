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
      subtitle='Daftar Pengguna'
      addLabel='Buat Pengguna'
      onAddClick={onAddUser}
    />
  );
}
