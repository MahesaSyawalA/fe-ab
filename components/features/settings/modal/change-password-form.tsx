'use client';

import * as React from 'react';
import { isAxiosError } from 'axios';
import { Controller, useForm, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { TriangleExclamation } from '@gravity-ui/icons';
import { toast } from '@heroui/react';
import { useChangePasswordMutation } from '@/hooks/queries/use-user-query';
import { getErrorMessage } from '@/lib/axios';
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '@/schemas/profile.schema';
import { Button } from '@/components/ui/button';
import { SettingsTextFieldInput } from '../inputs';

export interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PASSWORD_FIELD_CONFIGS: {
  name: keyof ChangePasswordFormValues;
  label: string;
  placeholder: string;
}[] = [
  {
    name: 'current_password',
    label: 'Password Saat Ini',
    placeholder: 'Masukkan password saat ini',
  },
  {
    name: 'new_password',
    label: 'Password Baru',
    placeholder: 'Minimal 8 karakter',
  },
  {
    name: 'confirm_password',
    label: 'Konfirmasi Password Baru',
    placeholder: 'Ulangi password baru',
  },
];

function PasswordInputField({
  control,
  name,
  label,
  placeholder,
}: {
  control: Control<ChangePasswordFormValues>;
  name: keyof ChangePasswordFormValues;
  label: string;
  placeholder: string;
}) {
  const [visible, setVisible] = React.useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <SettingsTextFieldInput
          label={label}
          isRequired
          type={visible ? 'text' : 'password'}
          prefix={<Lock className='size-4' />}
          endAddon={
            <button
              type='button'
              onClick={() => setVisible((prev) => !prev)}
              className='pr-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center'
              aria-label={visible ? `Sembunyikan ${label}` : `Tampilkan ${label}`}
            >
              {visible ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
            </button>
          }
          value={field.value}
          onChange={field.onChange}
          isInvalid={Boolean(error)}
          errorMessage={error?.message}
          placeholder={placeholder}
        />
      )}
    />
  );
}

export function useChangePasswordForm({ open, onOpenChange }: ChangePasswordModalProps) {
  const { data: session, update: updateSession } = useSession();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const changePasswordMutation = useChangePasswordMutation();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
    mode: 'onTouched',
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    }
  }, [open, form]);

  const handleOpenChange = (nextOpen: boolean) => {
    setServerError(null);
    onOpenChange(nextOpen);
  };

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      setServerError(null);
      await changePasswordMutation.mutateAsync({
        current_password: values.current_password,
        new_password: values.new_password,
      });

      if (updateSession) {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            must_change_password: false,
          },
        });
      }

      toast.success('Password Berhasil Diperbarui', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            Kata sandi akun Anda telah berhasil diperbarui.
          </span>
        ),
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      let msg = getErrorMessage(error);
      if (isAxiosError<{ message?: string }>(error)) {
        if (!error.response) {
          msg = 'Koneksi jaringan bermasalah. Silakan periksa koneksi internet Anda.';
        } else if (error.response.status === 401) {
          msg = error.response.data?.message || 'Password saat ini tidak sesuai.';
        }
      }
      setServerError(msg || 'Gagal memperbarui password. Silakan coba lagi.');
      toast.danger('Gagal Mengubah Password', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            {msg || 'Terjadi kesalahan sistem.'}
          </span>
        ),
      });
    }
  };

  return {
    form,
    serverError,
    isPending: changePasswordMutation.isPending,
    onSubmit: form.handleSubmit(onSubmit),
    handleOpenChange,
  };
}

export type ChangePasswordFormState = ReturnType<typeof useChangePasswordForm>;

export function ChangePasswordFields({ formState }: { formState: ChangePasswordFormState }) {
  return (
    <div className='flex flex-col gap-4 pt-1'>
      {formState.serverError && (
        <div className='flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-destructive'>
          <TriangleExclamation className='size-4 shrink-0 mt-0.5' />
          <p className='text-xs font-medium leading-relaxed'>{formState.serverError}</p>
        </div>
      )}

      {PASSWORD_FIELD_CONFIGS.map((fieldCfg) => (
        <PasswordInputField
          key={fieldCfg.name}
          control={formState.form.control}
          name={fieldCfg.name}
          label={fieldCfg.label}
          placeholder={fieldCfg.placeholder}
        />
      ))}
    </div>
  );
}

export function ChangePasswordFooterActions({
  onCancel,
  isPending,
}: {
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className='grid grid-cols-2 gap-3 w-full sm:flex sm:w-auto sm:justify-end sm:items-center sm:gap-2.5'>
      <Button
        type='button'
        variant='outline'
        onClick={onCancel}
        disabled={isPending}
        className='h-10 sm:h-9 w-full sm:w-28 rounded-md text-xs font-semibold cursor-pointer border-border bg-card shadow-none hover:bg-muted/50'
      >
        Batal
      </Button>
      <Button
        type='submit'
        disabled={isPending}
        className='h-10 sm:h-9 w-full sm:w-auto sm:min-w-[140px] sm:px-5 rounded-md text-xs font-semibold text-white shadow-sm bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary transition-all cursor-pointer disabled:opacity-60'
      >
        {isPending && <Loader2 className='mr-1.5 size-3.5 animate-spin' />}
        <span>{isPending ? 'Menyimpan...' : 'Simpan Password'}</span>
      </Button>
    </div>
  );
}
