'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import {
  UserTextFieldInput,
  UserPhoneInput,
  UserSelectInput,
  type UserSelectOption,
} from '../inputs';
import { UserModalShell, UserModalFooterActions } from './shared';
import { normalizeRole } from '@/lib/rbac';
import { useSquadListQuery } from '@/hooks/queries/use-squad-query';
import { editUserSchema } from '@/schemas/user-management.schema';
import type { UpdateUserApiPayload } from '@/services/user-service';
import type { ManagedUser, ManagedUserRole, UserStatus } from '../types';

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ManagedUser | null;
  onUpdateUser: (id: string, payload: UpdateUserApiPayload) => Promise<void> | void;
  isSubmitting?: boolean;
}

const STATUS_OPTIONS: UserSelectOption[] = [
  { value: 'aktif', label: 'Aktif' },
  { value: 'nonaktif', label: 'Nonaktif' },
];

interface EditUserModalContentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ManagedUser;
  onUpdateUser: (id: string, payload: UpdateUserApiPayload) => Promise<void> | void;
  isSubmitting?: boolean;
}

function EditUserModalContent({
  open,
  onOpenChange,
  user,
  onUpdateUser,
  isSubmitting = false,
}: EditUserModalContentProps) {
  const { data: session } = useSession();
  const currentUserRole = normalizeRole(session?.user?.role);

  const { data: squadData } = useSquadListQuery({ limit: 100 });
  const squadOptions: UserSelectOption[] = React.useMemo(() => {
    if (!squadData?.data) return [];
    return squadData.data.map((s) => ({
      value: s.id_squad,
      label: s.nama_squad,
    }));
  }, [squadData]);

  const roleOptions: UserSelectOption[] = React.useMemo(() => {
    const baseOptions: UserSelectOption[] = [];
    if (currentUserRole === 'director') {
      baseOptions.push(
        { value: 'sales', label: 'Sales' },
        { value: 'sales_manager', label: 'Sales Manager' },
      );
    } else if (currentUserRole === 'admin') {
      baseOptions.push(
        { value: 'sales', label: 'Sales' },
        { value: 'sales_manager', label: 'Sales Manager' },
        { value: 'director', label: 'Director' },
      );
    } else {
      baseOptions.push(
        { value: 'sales', label: 'Sales' },
        { value: 'sales_manager', label: 'Sales Manager' },
      );
    }

    if (user.role && !baseOptions.some((opt) => opt.value === user.role)) {
      const labelMap: Record<ManagedUserRole, string> = {
        sales: 'Sales',
        sales_manager: 'Sales Manager',
        director: 'Director',
        admin: 'Admin',
      };
      baseOptions.unshift({
        value: user.role,
        label: labelMap[user.role] ?? user.role,
      });
    }

    return baseOptions;
  }, [currentUserRole, user.role]);

  const initialSquadValue = React.useMemo(() => {
    if (user.id_squad) return user.id_squad;
    if (user.squad && squadData?.data) {
      const found = squadData.data.find((s) => s.nama_squad === user.squad || s.id_squad === user.squad);
      if (found) return found.id_squad;
    }
    return user.squad || null;
  }, [user.id_squad, user.squad, squadData]);

  const [nama, setNama] = React.useState(user.nama);
  const [email, setEmail] = React.useState(user.email);
  const [noTelp, setNoTelp] = React.useState(user.no_telp === '-' ? '' : user.no_telp);
  const [role, setRole] = React.useState<ManagedUserRole>(user.role);
  const [squad, setSquad] = React.useState<string | null>(initialSquadValue);
  const [status, setStatus] = React.useState<UserStatus>(user.status);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleRoleChange = (newRole: string) => {
    const parsedRole = newRole as ManagedUserRole;
    setRole(parsedRole);
    if (parsedRole === 'director' || parsedRole === 'admin') {
      setSquad(null);
    }
  };

  const isSquadDisabled = role === 'director' || role === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = editUserSchema.safeParse({
      nama,
      email,
      no_telp: noTelp || undefined,
      role,
      id_squad: isSquadDisabled ? null : squad,
      status,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[0]);
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const cleanedPhone = noTelp ? noTelp.replace(/[^0-9+]/g, '') : '';
    const targetSquadId = isSquadDisabled ? null : squad || null;

    const updatePayload: UpdateUserApiPayload = {
      nama: validation.data.nama,
      email: validation.data.email,
      no_telp: cleanedPhone,
      role: validation.data.role as 'sales' | 'sales_manager' | 'director',
      id_squad: targetSquadId,
    };

    await onUpdateUser(user.id, updatePayload);
  };

  return (
    <UserModalShell
      open={open}
      onOpenChange={onOpenChange}
      title='Edit Pengguna'
      description='Perbarui profil dan wewenang akun pengguna.'
      className='sm:max-w-xl'
      onSubmit={handleSubmit}
      footer={
        <UserModalFooterActions
          onCancel={() => onOpenChange(false)}
          submitLabel='Simpan Perubahan'
          isSubmitting={isSubmitting}
        />
      }
    >
      <div className='flex flex-col gap-4 text-left'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
          <UserTextFieldInput
            label='Nama Lengkap *'
            placeholder='Nama lengkap'
            value={nama}
            onChange={(val) => {
              setNama(val);
              if (errors.nama) setErrors((prev) => ({ ...prev, nama: '' }));
            }}
            errorMessage={errors.nama}
            autoFocus
          />

          <UserTextFieldInput
            label='Email *'
            type='email'
            placeholder='nama@abmedical.id'
            value={email}
            onChange={(val) => {
              setEmail(val);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            errorMessage={errors.email}
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
          <UserPhoneInput
            label='No. Telepon'
            placeholder='+62 8xx-xxxx-xxxx'
            value={noTelp}
            onChange={(val) => {
              setNoTelp(val);
              if (errors.no_telp) setErrors((prev) => ({ ...prev, no_telp: '' }));
            }}
            errorMessage={errors.no_telp}
          />

          <UserSelectInput
            label='Role *'
            placeholder='Pilih role'
            options={roleOptions}
            value={role}
            onChange={handleRoleChange}
            errorMessage={errors.role}
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
          <UserSelectInput
            label='Squad'
            placeholder={isSquadDisabled ? 'Tidak terikat squad' : 'Pilih squad'}
            options={squadOptions}
            value={squad}
            onChange={(val) => setSquad(val)}
            isDisabled={isSquadDisabled}
            hint={isSquadDisabled ? 'Role Director/Admin tidak terikat squad' : undefined}
            errorMessage={errors.id_squad}
          />

          <UserSelectInput
            label='Status Akun'
            placeholder='Pilih status'
            options={STATUS_OPTIONS}
            value={status}
            onChange={(val) => setStatus(val as UserStatus)}
            errorMessage={errors.status}
          />
        </div>
      </div>
    </UserModalShell>
  );
}

export function EditUserModal({
  open,
  onOpenChange,
  user,
  onUpdateUser,
  isSubmitting,
}: EditUserModalProps) {
  if (!open || !user) return null;

  return (
    <EditUserModalContent
      key={user.id}
      open={open}
      onOpenChange={onOpenChange}
      user={user}
      onUpdateUser={onUpdateUser}
      isSubmitting={isSubmitting}
    />
  );
}
