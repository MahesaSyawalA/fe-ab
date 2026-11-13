'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { UserModalShell } from '../modals/shared';
import { UserSelectInput, type UserSelectOption } from '../inputs';
import { normalizeRole } from '@/lib/rbac';
import {
  countActiveUserFilters,
  type UserStatusFilter,
  type UserSortOption,
} from '@/store/user-management-filter-store';

interface UserManagementFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRole: string;
  selectedStatus: UserStatusFilter;
  sortBy: UserSortOption;
  onApply: (filters: {
    role: string;
    status: UserStatusFilter;
    sortBy: UserSortOption;
  }) => void;
  onReset: () => void;
}

const STATUS_FILTER_OPTIONS: UserSelectOption[] = [
  { value: 'all', label: 'Semua Status' },
  { value: 'aktif', label: 'Aktif' },
  { value: 'nonaktif', label: 'Nonaktif' },
];

const SORT_OPTIONS: UserSelectOption[] = [
  { value: 'name_asc', label: 'Nama (A - Z)' },
  { value: 'name_desc', label: 'Nama (Z - A)' },
  { value: 'newest', label: 'Terbaru Ditambahkan' },
  { value: 'oldest', label: 'Terlama Ditambahkan' },
];

function UserManagementFilterModalContent({
  open,
  onOpenChange,
  selectedRole,
  selectedStatus,
  sortBy,
  onApply,
  onReset,
}: UserManagementFilterModalProps) {
  const { data: session } = useSession();
  const currentUserRole = normalizeRole(session?.user?.role);

  const [draftRole, setDraftRole] = React.useState(selectedRole);
  const [draftStatus, setDraftStatus] = React.useState<UserStatusFilter>(selectedStatus);
  const [draftSort, setDraftSort] = React.useState<UserSortOption>(sortBy);

  const roleFilterOptions: UserSelectOption[] = React.useMemo(() => {
    const options: UserSelectOption[] = [{ value: 'all', label: 'Semua Peran' }];

    if (currentUserRole === 'admin') {
      options.push(
        { value: 'director', label: 'Director' },
        { value: 'sales_manager', label: 'Sales Manager' },
        { value: 'sales', label: 'Sales' },
      );
    } else {
      options.push(
        { value: 'sales_manager', label: 'Sales Manager' },
        { value: 'sales', label: 'Sales' },
      );
    }

    return options;
  }, [currentUserRole]);

  const activeCount = countActiveUserFilters(draftRole, draftStatus, draftSort);

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onApply({
      role: draftRole,
      status: draftStatus,
      sortBy: draftSort,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setDraftRole('all');
    setDraftStatus('all');
    setDraftSort('name_asc');
    onReset();
    onOpenChange(false);
  };

  return (
    <UserModalShell
      open={open}
      onOpenChange={onOpenChange}
      title='Filter Pengguna'
      description={
        activeCount > 0
          ? `${activeCount} filter aktif saat ini`
          : 'Pilih kriteria untuk mempersempit daftar pengguna'
      }
      className='sm:max-w-md'
      onSubmit={handleApply}
      footer={
        <div className='grid grid-cols-2 gap-3 w-full sm:flex sm:w-auto sm:justify-end sm:items-center sm:gap-2.5'>
          <Button
            type='button'
            variant='outline'
            onClick={handleReset}
            className='h-10 sm:h-9 w-full sm:w-28 rounded-md text-xs font-semibold cursor-pointer border-border bg-card shadow-none hover:bg-muted/50'
          >
            Reset Filter
          </Button>
          <Button
            type='submit'
            onClick={handleApply}
            className='h-10 sm:h-9 w-full sm:w-auto sm:min-w-[140px] sm:px-5 rounded-md text-xs font-semibold text-white shadow-sm bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary transition-all cursor-pointer'
          >
            Terapkan Filter
          </Button>
        </div>
      }
    >
      <div className='flex flex-col gap-4 text-left py-1'>
        <UserSelectInput
          label='Peran Pengguna (Role)'
          placeholder='Pilih peran'
          options={roleFilterOptions}
          value={draftRole}
          onChange={(val) => setDraftRole(val || 'all')}
        />

        <UserSelectInput
          label='Status Akun'
          placeholder='Pilih status'
          options={STATUS_FILTER_OPTIONS}
          value={draftStatus}
          onChange={(val) => setDraftStatus((val as UserStatusFilter) || 'all')}
        />

        <UserSelectInput
          label='Urutan Tampilan'
          placeholder='Pilih urutan'
          options={SORT_OPTIONS}
          value={draftSort}
          onChange={(val) => setDraftSort((val as UserSortOption) || 'name_asc')}
        />
      </div>
    </UserModalShell>
  );
}

export function UserManagementFilterModal(props: UserManagementFilterModalProps) {
  if (!props.open) return null;
  return <UserManagementFilterModalContent {...props} />;
}
