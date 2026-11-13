'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  UserMiniProfileCard,
  PasswordGeneratorCard,
  ResetPasswordSuccess,
  UserModalShell,
  UserModalFooterActions,
} from './shared';
import { generateSecurePassword } from '@/lib/password-generator';
import { resetPasswordSchema } from '@/schemas/user-management.schema';
import type { ManagedUser } from '../types';

interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ManagedUser | null;
  onResetSuccess?: (userId: string, newPassword: string) => void;
}

interface ResetPasswordModalContentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ManagedUser;
  onResetSuccess?: (userId: string, newPassword: string) => void;
}

function ResetPasswordModalContent({
  open,
  onOpenChange,
  user,
  onResetSuccess,
}: ResetPasswordModalContentProps) {
  const [step, setStep] = React.useState<'form' | 'success'>('form');
  const [activePassword, setActivePassword] = React.useState('');

  const [passwordMode, setPasswordMode] = React.useState<'auto' | 'manual'>('auto');
  const [generatedPassword, setGeneratedPassword] = React.useState(() => generateSecurePassword(10));
  const [manualPassword, setManualPassword] = React.useState('');
  const [mustChangePassword, setMustChangePassword] = React.useState(true);
  const [sendEmail, setSendEmail] = React.useState(true);
  const [manualPasswordError, setManualPasswordError] = React.useState('');

  const handleRegenerate = React.useCallback(() => {
    setGeneratedPassword(generateSecurePassword(10));
  }, []);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const effectivePassword = passwordMode === 'auto' ? generatedPassword : manualPassword;

    const validation = resetPasswordSchema.safeParse({
      password_mode: passwordMode,
      password: effectivePassword,
      must_change_password: mustChangePassword,
      send_email: sendEmail,
    });

    if (!validation.success) {
      const issue = validation.error.issues[0];
      setManualPasswordError(issue?.message || 'Password tidak valid');
      return;
    }

    setActivePassword(effectivePassword);
    onResetSuccess?.(user.id, effectivePassword);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <UserModalShell
        open={open}
        onOpenChange={onOpenChange}
        className='sm:max-w-md'
        footer={
          <Button
            type='button'
            onClick={handleClose}
            className='w-full h-10 sm:h-9 rounded-lg font-semibold text-xs text-white shadow-sm bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary transition-all cursor-pointer'
          >
            Selesai
          </Button>
        }
      >
        <ResetPasswordSuccess
          userName={user.nama}
          temporaryPassword={activePassword}
        />
      </UserModalShell>
    );
  }

  return (
    <UserModalShell
      open={open}
      onOpenChange={onOpenChange}
      title='Reset Password'
      description='Buat password sementara baru untuk pengguna ini.'
      className='sm:max-w-md'
      onSubmit={handleSubmit}
      footer={
        <UserModalFooterActions
          onCancel={handleClose}
          submitLabel='Reset Password'
        />
      }
    >
      <div className='flex flex-col gap-4 text-left'>
        <UserMiniProfileCard user={user} />

        <PasswordGeneratorCard
          title='Password sementara'
          passwordMode={passwordMode}
          onPasswordModeChange={setPasswordMode}
          generatedPassword={generatedPassword}
          onRegenerate={handleRegenerate}
          manualPassword={manualPassword}
          onManualPasswordChange={(val) => {
            setManualPassword(val);
            setManualPasswordError('');
          }}
          manualPasswordError={manualPasswordError}
          mustChangePassword={mustChangePassword}
          onMustChangePasswordChange={setMustChangePassword}
          sendEmail={sendEmail}
          onSendEmailChange={setSendEmail}
        />

        <div className='rounded-xl border border-amber-200/80 bg-amber-50/70 dark:bg-amber-950/20 dark:border-amber-900/40 p-3 sm:p-3.5 text-xs text-amber-800 dark:text-amber-300 leading-relaxed text-left'>
          Pengguna akan otomatis keluar dari semua perangkat setelah password direset.
        </div>
      </div>
    </UserModalShell>
  );
}

export function ResetPasswordModal({
  open,
  onOpenChange,
  user,
  onResetSuccess,
}: ResetPasswordModalProps) {
  if (!open || !user) return null;

  return (
    <ResetPasswordModalContent
      key={user.id}
      open={open}
      onOpenChange={onOpenChange}
      user={user}
      onResetSuccess={onResetSuccess}
    />
  );
}
