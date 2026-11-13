'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
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
import type { CreateUserApiPayload } from '@/services/user-service';
import type { ManagedUserRole } from '../types';

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateUser: (payload: CreateUserApiPayload) => Promise<void> | void;
  isSubmitting?: boolean;
}

interface CreateUserModalContentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateUser: (payload: CreateUserApiPayload) => Promise<void> | void;
  isSubmitting?: boolean;
}

function CreateUserModalContent({
  open,
  onOpenChange,
  onCreateUser,
  isSubmitting = false,
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
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const effectivePassword = passwordMode === 'auto' ? generatedPassword : manualPassword;

    const validation = createUserSchema.safeParse({
      nama,
      email,
      no_telp: noTelp || undefined,
      role,
      id_squad: null,
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

    const cleanedPhone = noTelp ? noTelp.replace(/[^0-9+]/g, '') : '';

    const apiPayload: CreateUserApiPayload = {
      nama: validation.data.nama,
      email: validation.data.email,
      no_telp: cleanedPhone,
      role: validation.data.role as 'sales' | 'sales_manager' | 'director',
      id_squad: null,
      password: effectivePassword,
    };

    await onCreateUser(apiPayload);
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
          isSubmitting={isSubmitting}
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
  isSubmitting,
}: CreateUserModalProps) {
  if (!open) return null;

  return (
    <CreateUserModalContent
      open={open}
      onOpenChange={onOpenChange}
      onCreateUser={onCreateUser}
      isSubmitting={isSubmitting}
    />
  );
}
