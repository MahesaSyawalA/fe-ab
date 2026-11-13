'use client';

import * as React from 'react';
import {
  TextField,
  Label,
  Input,
  FieldError,
} from '@heroui/react';
import { TriangleExclamation } from '@gravity-ui/icons';
import { cn } from '@/lib/utils';

export interface UserPhoneInputProps {
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  'aria-label'?: string;
}

export function UserPhoneInput({
  label = 'No. Telepon',
  placeholder = '+62 8xx-xxxx-xxxx',
  errorMessage,
  isInvalid,
  isRequired,
  isDisabled,
  value,
  onChange,
  className,
  'aria-label': ariaLabelProp,
}: UserPhoneInputProps) {
  const invalid = isInvalid || Boolean(errorMessage);

  const isExplicitRequired = isRequired || (label ? label.endsWith('*') : false);
  const displayLabel = label ? (label.endsWith('*') ? label.slice(0, -1).trim() : label) : '';
  const effectiveAriaLabel = ariaLabelProp || displayLabel || placeholder || 'Nomor Telepon';

  const handleChange = (val: string) => {
    const cleaned = val.replace(/[^0-9+\s-]/g, '');
    onChange?.(cleaned);
  };

  return (
    <TextField
      isRequired={isRequired}
      isInvalid={invalid}
      isDisabled={isDisabled}
      value={value ?? ''}
      onChange={handleChange}
      aria-label={effectiveAriaLabel}
      className={cn('flex w-full flex-col gap-1.5', className)}
    >
      {displayLabel && (
        <Label className='text-sm font-medium text-foreground'>
          {displayLabel}
          {isExplicitRequired && <span className='text-destructive ml-0.5'>*</span>}
        </Label>
      )}

      <Input
        type='tel'
        placeholder={placeholder}
        aria-label={effectiveAriaLabel}
        className='h-10 w-full rounded-md border border-border bg-card px-3 text-xs sm:text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary aria-invalid:border-destructive aria-invalid:focus:border-destructive disabled:bg-muted/40 disabled:text-muted-foreground disabled:cursor-not-allowed'
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
