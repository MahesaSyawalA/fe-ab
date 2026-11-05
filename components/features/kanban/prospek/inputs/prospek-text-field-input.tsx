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

export interface ProspekTextFieldInputProps
  extends Omit<TextFieldProps, 'onChange'> {
  label: string;
  placeholder?: string;
  errorMessage?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
  inputClassName?: string;
}

export function ProspekTextFieldInput({
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
}: ProspekTextFieldInputProps) {
  const invalid = isInvalid || Boolean(errorMessage);

  return (
    <TextField
      isRequired={isRequired}
      isInvalid={invalid}
      isDisabled={disabled}
      isReadOnly={readOnly}
      value={value}
      onChange={onChange}
      className={cn('flex w-full flex-col gap-1.5', className)}
      {...props}
    >
      <Label className='text-sm font-semibold text-foreground'>{label}</Label>

      <Input
        type={type}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        className={cn(
          'h-10 w-full rounded-md border border-primary/40 bg-card px-3.5 text-xs sm:text-sm text-foreground shadow-none transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary aria-invalid:border-destructive aria-invalid:focus:border-destructive aria-invalid:focus:ring-destructive disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed',
          inputClassName,
        )}
      />

      {invalid && (
        <FieldError className='mt-1 text-[11px] font-medium text-destructive flex items-center gap-1.5'>
          <TriangleExclamation width={14} height={14} className='shrink-0' />
          <span>{errorMessage}</span>
        </FieldError>
      )}
    </TextField>
  );
}
