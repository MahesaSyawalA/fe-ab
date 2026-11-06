'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle } from 'lucide-react';

import { Form } from '@heroui/react';
import { TextFieldInput } from '../inputs/text-field-input';
import { PasswordFieldInput } from '../inputs/password-field-input';
import { AuthButton } from '../buttons/auth-button';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email wajib diisi' })
    .email({ message: 'Format email tidak valid' }),
  password: z.string().min(8, { message: 'Password minimal 8 karakter' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [authError, setAuthError] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!result || result.error) {
        setAuthError('Email atau password tidak valid. Silakan periksa kembali akun Anda.');
        return;
      }

      if (result.ok) {
        // Arahkan ke target callback / dashboard dan refresh agar proxy.ts mengeksekusi navigasi default role
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error('[Login Form Error]:', err);
      setAuthError('Terjadi gangguan koneksi ke server autentikasi. Silakan coba beberapa saat lagi.');
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className='mt-8 flex w-full flex-col gap-5'
      validationBehavior='aria'
    >
      {authError && (
        <div
          role='alert'
          className='flex items-center gap-2.5 rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-3 text-xs font-medium text-danger transition-all'
        >
          <AlertCircle className='size-4 shrink-0' />
          <span>{authError}</span>
        </div>
      )}

      <Controller
        name='email'
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextFieldInput
            label='Email'
            placeholder='Masukkan Email'
            isInvalid={!!error}
            errorMessage={error?.message}
            value={field.value}
            onChange={field.onChange}
            isDisabled={isSubmitting}
          />
        )}
      />

      <Controller
        name='password'
        control={control}
        render={({ field, fieldState: { error } }) => (
          <PasswordFieldInput
            label='Password'
            placeholder='Masukkan Password'
            isInvalid={!!error}
            errorMessage={error?.message}
            value={field.value}
            onChange={field.onChange}
            isDisabled={isSubmitting}
          />
        )}
      />

      <AuthButton
        type='submit'
        label='Login'
        isPending={isSubmitting}
        isDisabled={isSubmitting}
        className='mt-4'
      />
    </Form>
  );
}
