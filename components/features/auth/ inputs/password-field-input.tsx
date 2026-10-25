'use client';

import { useState } from 'react';
import { TextField, Label, Input, FieldError, TextFieldProps } from '@heroui/react';
import { Eye, EyeSlash, TriangleExclamation } from '@gravity-ui/icons';

interface PasswordFieldInputProps extends Omit<TextFieldProps, 'errorMessage'> {
    label: string;
    placeholder?: string;
    errorMessage?: string;
}

export function PasswordFieldInput({
    label,
    placeholder,
    errorMessage,
    isInvalid,
    ...props
}: PasswordFieldInputProps) {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <TextField isRequired isInvalid={isInvalid} className='flex w-full flex-col gap-1.5' {...props}>
            <Label className='font-medium text-foreground'>{label}</Label>

            <div className='relative w-full'>
                <Input
                    type={isVisible ? 'text' : 'password'}
                    placeholder={placeholder}
                    className='h-10 w-full rounded-[8px] border border-border bg-card pl-3 pr-10 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-primary-default focus:outline-none focus:ring-1 focus:ring-primary-default aria-invalid:border-destructive aria-invalid:focus:border-destructive aria-invalid:focus:ring-destructive'
                />
                <button
                    type='button'
                    onClick={toggleVisibility}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground'
                    aria-label='Toggle password visibility'
                >
                    {isVisible ? <Eye width={18} height={18} /> : <EyeSlash width={18} height={18} />}
                </button>
            </div>

            <FieldError className='mt-1 text-sm text-destructive'>
                <div className='flex items-center gap-1.5'>
                    <TriangleExclamation width={16} height={16} />
                    <span>{errorMessage}</span>
                </div>
            </FieldError>
        </TextField>
    );
}