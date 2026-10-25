'use client';

import { TextField, Label, Input, FieldError, TextFieldProps } from '@heroui/react';
import { TriangleExclamation } from '@gravity-ui/icons';

interface CustomTextFieldProps extends Omit<TextFieldProps, 'errorMessage'> {
    label: string;
    placeholder?: string;
    errorMessage?: string;
}

export function TextFieldInput({
    label,
    placeholder,
    errorMessage,
    isInvalid,
    ...props
}: CustomTextFieldProps) {
    return (
        <TextField isRequired isInvalid={isInvalid} className='flex w-full flex-col gap-1.5' {...props}>
            <Label className='font-medium text-foreground'>{label}</Label>

            <Input
                placeholder={placeholder}
                className='h-10 w-full rounded-[8px] border border-border bg-card px-3 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-primary-default focus:outline-none focus:ring-1 focus:ring-primary-default aria-invalid:border-destructive aria-invalid:focus:border-destructive aria-invalid:focus:ring-destructive'
            />

            <FieldError className='mt-1 text-sm text-destructive'>
                <div className='flex items-center gap-1.5'>
                    <TriangleExclamation width={16} height={16} />
                    <span>{errorMessage}</span>
                </div>
            </FieldError>
        </TextField>
    );
}