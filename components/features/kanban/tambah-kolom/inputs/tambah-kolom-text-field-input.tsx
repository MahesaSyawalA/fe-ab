'use client';

import * as React from 'react';
import {
  TextField,
  Label,
  Input,
  FieldError,
  TextFieldProps,
} from '@heroui/react';
import { TriangleExclamation } from '@gravity-ui/icons';
import { cn } from '@/lib/utils';

export interface TambahKolomTextFieldInputProps
  extends Omit<TextFieldProps, 'onChange' | 'value'> {
  label: string;
  placeholder?: string;
  errorMessage?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  type?: string;
  min?: number;
  max?: number;
  autoFocus?: boolean;
  inputClassName?: string;
}

export function TambahKolomTextFieldInput({
  label,
  placeholder,
  errorMessage,
  isInvalid,
  isRequired,
  value,
  onChange,
  type = 'text',
  min,
  max,
  autoFocus,
  inputClassName,
  className,
  ...props
}: TambahKolomTextFieldInputProps) {
  const invalid = isInvalid || Boolean(errorMessage);

  return (
    <TextField
      isRequired={isRequired}
      isInvalid={invalid}
      value={value !== undefined ? String(value) : undefined}
      onChange={onChange}
      className={cn('flex w-full flex-col gap-1.5', className)}
      {...props}
    >
      <Label className='text-xs font-semibold text-foreground'>{label}</Label>

      <Input
        type={type}
        min={min}
        max={max}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className={cn(
          'h-10 w-full rounded-xl border border-border bg-card px-3 text-xs text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary aria-invalid:border-destructive aria-invalid:focus:border-destructive aria-invalid:focus:ring-destructive',
          inputClassName,
        )}
      />

      {invalid && (
        <FieldError className='mt-1 text-xs text-destructive flex items-center gap-1.5'>
          <TriangleExclamation width={14} height={14} className='shrink-0' />
          <span>{errorMessage}</span>
        </FieldError>
      )}
    </TextField>
  );
}
