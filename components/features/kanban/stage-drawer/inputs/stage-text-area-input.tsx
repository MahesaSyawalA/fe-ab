'use client';

import * as React from 'react';
import {
  TextField,
  Label,
  TextArea,
  FieldError,
  TextFieldProps,
} from '@heroui/react';
import { TriangleExclamation } from '@gravity-ui/icons';
import { cn } from '@/lib/utils';

export interface StageTextAreaInputProps
  extends Omit<TextFieldProps, 'onChange' | 'value'> {
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  disabled?: boolean;
  readOnly?: boolean;
  inputClassName?: string;
}

export function StageTextAreaInput({
  label,
  placeholder,
  errorMessage,
  isInvalid,
  isRequired,
  value,
  onChange,
  rows = 2,
  disabled,
  readOnly,
  inputClassName,
  className,
  ...props
}: StageTextAreaInputProps) {
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
      {label && (
        <Label className='text-sm font-medium text-foreground'>{label}</Label>
      )}

      <TextArea
        rows={rows}
        disabled={disabled}
        readOnly={readOnly}
        required={isRequired}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-md border border-border bg-card px-3 py-2 text-xs sm:text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary aria-invalid:border-destructive aria-invalid:focus:border-destructive aria-invalid:focus:ring-destructive read-only:bg-muted/40 read-only:text-muted-foreground read-only:cursor-default disabled:bg-muted/40 disabled:text-muted-foreground disabled:cursor-not-allowed resize-none',
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
