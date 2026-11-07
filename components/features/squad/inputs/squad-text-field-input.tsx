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

export interface SquadTextFieldInputProps
  extends Omit<TextFieldProps, 'onChange' | 'value'> {
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
  inputClassName?: string;
}

export function SquadTextFieldInput({
  label,
  placeholder,
  errorMessage,
  isInvalid,
  isRequired,
  value,
  onChange,
  type = 'text',
  disabled,
  readOnly,
  inputClassName,
  className,
  ...props
}: SquadTextFieldInputProps) {
  const invalid = isInvalid || Boolean(errorMessage);

  return (
    <TextField
      isRequired={isRequired}
      isInvalid={invalid}
      isDisabled={disabled}
      isReadOnly={readOnly}
      value={value !== undefined ? String(value) : undefined}
      onChange={onChange}
      className={cn('flex w-full min-w-0 flex-col gap-1.5', className)}
      {...props}
    >
      {label && (
        <Label className='text-sm font-semibold text-foreground'>
          {label}
        </Label>
      )}

      <Input
        type={type}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        className={cn(
          'h-10 w-full rounded-md border border-border bg-card px-3 text-xs sm:text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary aria-invalid:border-destructive aria-invalid:focus:border-destructive aria-invalid:focus:ring-destructive disabled:bg-muted/40 disabled:text-muted-foreground disabled:cursor-not-allowed',
          inputClassName,
        )}
      />

      {invalid && errorMessage && (
        <FieldError className='mt-1 text-xs text-destructive flex items-center gap-1.5'>
          <TriangleExclamation width={14} height={14} className='shrink-0' />
          <span>{errorMessage}</span>
        </FieldError>
      )}
    </TextField>
  );
}

