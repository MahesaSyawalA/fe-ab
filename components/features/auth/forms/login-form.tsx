'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Form } from '@heroui/react';
import { TextFieldInput } from '../inputs/text-field-input';
import { PasswordFieldInput } from '../inputs/password-field-input';
import { AuthButton } from '../buttons/auth-button';

const loginSchema = z.object({
    email: z.string().min(1, { message: 'Email wajib diisi' }).email({ message: 'Format email tidak valid' }),
    password: z.string().min(8, { message: 'Password minimal 8 karakter' }), 
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (data: LoginFormValues) => {
        // soon, the auth.ts (signIn) logic will be executed here
        console.log('Data form submitted:', data);
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
                    />
                )}
            />

            <AuthButton
                type='submit'
                label='Login'
                isPending={isSubmitting}
                className='mt-4'
            />
        </Form>
    );
}