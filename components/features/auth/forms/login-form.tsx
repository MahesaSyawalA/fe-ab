'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, toast } from '@heroui/react';
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
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!result || result.error) {
        toast.danger('Gagal Masuk', {
          description: (
            <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
              Email atau password tidak valid. Silakan periksa kembali akun Anda.
            </span>
          ),
        });
        return;
      }

      if (result.ok) {
        toast.success('Berhasil Masuk', {
          description: (
            <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
              Mengalihkan ke dashboard...
            </span>
          ),
        });
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.danger('Koneksi Gagal', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            Terjadi gangguan koneksi ke server autentikasi. Silakan coba beberapa saat lagi.
          </span>
        ),
      });
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className='mt-8 flex w-full flex-col gap-5'
      validationBehavior='aria'
    >
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
