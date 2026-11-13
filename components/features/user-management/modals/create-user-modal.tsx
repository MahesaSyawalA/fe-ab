'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { toast } from '@heroui/react';
import {
  UserTextFieldInput,
  UserPhoneInput,
  UserSelectInput,
  type UserSelectOption,
} from '../inputs';
import {
  PasswordGeneratorCard,
  UserModalShell,
  UserModalFooterActions,
} from './shared';
import { generateSecurePassword } from '@/lib/password-generator';
import { normalizeRole } from '@/lib/rbac';
import { createUserSchema } from '@/schemas/user-management.schema';
import type { ManagedUser, ManagedUserRole } from '../types';

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateUser: (user: ManagedUser) => void;
}

const SQUAD_OPTIONS: UserSelectOption[] = [
  { value: 'Squad Jakarta 1', label: 'Squad Jakarta 1' },
  { value: 'Squad Surabaya', label: 'Squad Surabaya' },
  { value: 'Squad Bandung', label: 'Squad Bandung' },
];

interface CreateUserModalContentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateUser: (user: ManagedUser) => void;
}

function CreateUserModalContent({
  open,
  onOpenChange,
  onCreateUser,
}: CreateUserModalContentProps) {
  const { data: session } = useSession();
  const currentUserRole = normalizeRole(session?.user?.role);

  const roleOptions: UserSelectOption[] = React.useMemo(() => {
    if (currentUserRole === 'director') {
      return [
        { value: 'sales', label: 'Sales' },
        { value: 'sales_manager', label: 'Sales Manager' },
      ];
    }
    if (currentUserRole === 'admin') {
      return [
        { value: 'sales', label: 'Sales' },
        { value: 'sales_manager', label: 'Sales Manager' },
        { value: 'director', label: 'Director' },
      ];
    }
    return [
      { value: 'sales', label: 'Sales' },
      { value: 'sales_manager', label: 'Sales Manager' },
    ];
  }, [currentUserRole]);

  const [nama, setNama] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [noTelp, setNoTelp] = React.useState('');
  const [role, setRole] = React.useState<ManagedUserRole>('sales');
  const [squad, setSquad] = React.useState<string | null>('Squad Jakarta 1');

  const [passwordMode, setPasswordMode] = React.useState<'auto' | 'manual'>('auto');
  const [generatedPassword, setGeneratedPassword] = React.useState(() => generateSecurePassword(10));
  const [manualPassword, setManualPassword] = React.useState('');
  const [mustChangePassword, setMustChangePassword] = React.useState(true);
  const [sendEmail, setSendEmail] = React.useState(true);

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleRegeneratePassword = React.useCallback(() => {
    setGeneratedPassword(generateSecurePassword(10));
  }, []);

  const handleRoleChange = (newRole: string) => {
    const parsedRole = newRole as ManagedUserRole;
    setRole(parsedRole);
    if (parsedRole === 'director' || parsedRole === 'admin') {
      setSquad(null);
    } else if (!squad) {
      setSquad('Squad Jakarta 1');
    }
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: '' }));
    }
  };

  const isSquadDisabled = role === 'director' || role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const effectivePassword = passwordMode === 'auto' ? generatedPassword : manualPassword;

    const validation = createUserSchema.safeParse({
      nama,
      email,
      no_telp: noTelp || undefined,
      role,
      id_squad: isSquadDisabled ? null : squad,
      password_mode: passwordMode,
      password: effectivePassword,
      must_change_password: mustChangePassword,
      send_email: sendEmail,
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

    const newUser: ManagedUser = {
      id: `usr-${Date.now().toString(36)}`,
      nama: validation.data.nama,
      email: validation.data.email,
      no_telp: validation.data.no_telp || '-',
      role: validation.data.role,
      squad: isSquadDisabled ? null : squad,
      status: 'aktif',
    };

    onCreateUser(newUser);

    toast.success('Pengguna Berhasil Dibuat', {
      description: (
        <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
          Akun untuk <strong>{newUser.nama}</strong> telah berhasil ditambahkan.
        </span>
      ),
    });

    onOpenChange(false);
  };

  return (
    <UserModalShell
      open={open}
      onOpenChange={onOpenChange}
      title='Buat Pengguna Baru'
      description='Tambahkan akun baru dan atur akses perannya.'
      className='sm:max-w-xl'
      onSubmit={handleSubmit}
      footer={
        <UserModalFooterActions
          onCancel={() => onOpenChange(false)}
          submitLabel='Buat Pengguna'
        />
      }
    >
      <div className='flex flex-col gap-4 text-left'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
          <UserTextFieldInput
            label='Nama Lengkap *'
            placeholder='Contoh: Rina Putri'
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

        <UserSelectInput
          label='Squad'
          placeholder={isSquadDisabled ? 'Tidak terikat squad' : 'Pilih squad'}
          options={SQUAD_OPTIONS}
          value={squad}
          onChange={(val) => setSquad(val)}
          isDisabled={isSquadDisabled}
          hint={isSquadDisabled ? 'Role Director dan Admin tidak terikat pada squad tertentu' : undefined}
          errorMessage={errors.id_squad}
        />

        <PasswordGeneratorCard
          title='Password awal'
          passwordMode={passwordMode}
          onPasswordModeChange={setPasswordMode}
          generatedPassword={generatedPassword}
          onRegenerate={handleRegeneratePassword}
          manualPassword={manualPassword}
          onManualPasswordChange={(val) => {
            setManualPassword(val);
            if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
          }}
          manualPasswordError={errors.password}
          mustChangePassword={mustChangePassword}
          onMustChangePasswordChange={setMustChangePassword}
          sendEmail={sendEmail}
          onSendEmailChange={setSendEmail}
        />
      </div>
    </UserModalShell>
  );
}

export function CreateUserModal({
  open,
  onOpenChange,
  onCreateUser,
}: CreateUserModalProps) {
  if (!open) return null;

  return (
    <CreateUserModalContent
      open={open}
      onOpenChange={onOpenChange}
      onCreateUser={onCreateUser}
    />
  );
}
