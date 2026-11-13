'use client';

import * as React from 'react';
import { Table } from '@heroui/react';
import { Pencil, KeyRound, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserInitials } from '@/lib/auth-helpers';
import { cn } from '@/lib/utils';
import { UserManagementTableSkeleton } from './user-management-table-skeleton';
import type { ManagedUser, ManagedUserRole } from '../types';

interface UserManagementTableProps {
  users: ManagedUser[];
  isLoading?: boolean;
  onEditUser: (user: ManagedUser) => void;
  onResetPassword: (user: ManagedUser) => void;
}

function getRoleBadge(role: ManagedUserRole) {
  switch (role) {
    case 'director':
      return {
        label: 'Director',
        className: 'bg-kanban-pink text-white',
      };
    case 'sales_manager':
      return {
        label: 'Sales Manager',
        className: 'bg-kanban-orange text-white',
      };
    case 'sales':
      return {
        label: 'Sales',
        className: 'bg-kanban-green text-white',
      };
    case 'admin':
      return {
        label: 'Admin',
        className: 'bg-kanban-lightblue text-white',
      };
    default:
      return {
        label: role,
        className: 'bg-slate-500 text-white',
      };
  }
}

export function UserManagementTable({
  users,
  isLoading,
  onEditUser,
  onResetPassword,
}: UserManagementTableProps) {
  if (isLoading) {
    return <UserManagementTableSkeleton />;
  }

  if (users.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center rounded-2xl border border-border/70 bg-card p-12 text-center shadow-xs gap-3'>
        <div className='flex size-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground'>
          <Users className='size-6' />
        </div>
        <div className='flex flex-col gap-1'>
          <h3 className='text-sm font-semibold text-foreground'>
            Tidak Ada Pengguna Ditemukan
          </h3>
          <p className='text-xs text-muted-foreground max-w-sm'>
            Tidak ada data yang cocok dengan kriteria pencarian atau filter yang dipilih.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Table aria-label='Tabel Kelola Pengguna' className='border border-border/70 shadow-xs'>
      <Table.ScrollContainer>
        <Table.Content
          aria-label='Daftar Pengguna Sistem'
          className='min-w-[700px]'
        >
          <Table.Header>
            <Table.Column isRowHeader id='pengguna' className='text-foreground font-semibold text-xs sm:text-sm py-3 px-4'>
              Pengguna
            </Table.Column>
            <Table.Column id='no_telp' className='text-foreground font-semibold text-xs sm:text-sm py-3 px-4'>
              No. Telepon
            </Table.Column>
            <Table.Column id='role' className='text-foreground font-semibold text-xs sm:text-sm py-3 px-4'>
              Role
            </Table.Column>
            <Table.Column id='status' className='text-foreground font-semibold text-xs sm:text-sm py-3 px-4'>
              Status
            </Table.Column>
            <Table.Column id='aksi' className='text-foreground font-semibold text-xs sm:text-sm py-3 px-4 text-start'>
              Aksi
            </Table.Column>
          </Table.Header>

          <Table.Body>
            {users.map((user) => {
              const roleBadge = getRoleBadge(user.role);
              const initials = getUserInitials(user.nama);
              const isAktif = user.status === 'aktif';
              const displayPhone = user.no_telp && user.no_telp !== '-' ? user.no_telp : '—';

              return (
                <Table.Row key={user.id} id={user.id}>
                  <Table.Cell className='py-3.5 px-4'>
                    <div className='flex items-center gap-3 min-w-0'>
                      <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs select-none'>
                        {initials}
                      </div>
                      <div className='flex flex-col min-w-0'>
                        <span
                          className='font-semibold text-foreground text-xs sm:text-sm truncate'
                          title={user.nama}
                        >
                          {user.nama}
                        </span>
                        <span
                          className='text-xs text-secondary-foreground truncate'
                          title={user.email}
                        >
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </Table.Cell>

                  <Table.Cell className='py-3.5 px-4'>
                    <span className='font-medium text-foreground text-xs sm:text-sm'>
                      {displayPhone}
                    </span>
                  </Table.Cell>

                  <Table.Cell className='py-3.5 px-4'>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-2xs',
                        roleBadge.className
                      )}
                    >
                      {roleBadge.label}
                    </span>
                  </Table.Cell>

                  <Table.Cell className='py-3.5 px-4'>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-2xs',
                        isAktif ? 'bg-kanban-green' : 'bg-slate-400'
                      )}
                    >
                      {isAktif ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </Table.Cell>

                  <Table.Cell className='py-3.5 px-4'>
                    <div className='flex items-center justify-start gap-1.5'>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => onResetPassword(user)}
                        className='h-8 rounded-lg border-border/80 bg-background text-[11px] sm:text-xs font-medium text-foreground hover:bg-muted hover:text-foreground cursor-pointer shadow-none gap-1.5 px-2.5 transition-all'
                        title='Reset Password Akun'
                      >
                        <KeyRound className='size-3 text-muted-foreground shrink-0' />
                        <span className='hidden sm:inline'>Reset Password</span>
                      </Button>

                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => onEditUser(user)}
                        className='size-8 rounded-lg border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer shadow-none transition-all'
                        title='Edit Pengguna'
                        aria-label={`Edit ${user.nama}`}
                      >
                        <Pencil className='size-3.5' />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
