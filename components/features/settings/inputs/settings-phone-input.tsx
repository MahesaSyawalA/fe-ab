'use client';

import * as React from 'react';
import {
  TextField,
  Label,
  InputGroup,
  FieldError,
  TextFieldProps,
} from '@heroui/react';
import { Phone } from 'lucide-react';
import { TriangleExclamation } from '@gravity-ui/icons';
import { cn } from '@/lib/utils';

export interface SettingsPhoneInputProps
  extends Omit<TextFieldProps, 'onChange' | 'value'> {
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  endAddon?: React.ReactNode;
  inputClassName?: string;
  containerClassName?: string;
}

/**
 * Sanitizer nomor telepon: hanya memperbolehkan angka, spasi, tanda strip, atau awalan '+'
 */
export function sanitizePhoneNumber(val: string): string {
  let sanitized = val.replace(/[^\d\s\-+]/g, '');
  if (sanitized.includes('+')) {
    sanitized = (sanitized.startsWith('+') ? '+' : '') + sanitized.replace(/\+/g, '');
  }
  return sanitized;
}

export const SettingsPhoneInput = React.forwardRef<
  HTMLInputElement,
  SettingsPhoneInputProps
>(function SettingsPhoneInput(
  {
    label = 'Nomor Telepon',
    placeholder = '+62 812-xxxx-xxxx',
    errorMessage,
    isInvalid,
    isRequired,
    value,
    onChange,
    disabled,
    readOnly,
    endAddon,
    inputClassName,
    containerClassName,
    className,
    ...props
  },
  ref,
) {
  const invalid = isInvalid || Boolean(errorMessage);
  const ariaLabel = props['aria-label'] || label || placeholder || 'Nomor Telepon';

  const handleChange = (val: string) => {
    const clean = sanitizePhoneNumber(val);
    onChange?.(clean);
  };

  return (
    <TextField
      isRequired={isRequired}
      isInvalid={invalid}
      isDisabled={disabled}
      isReadOnly={readOnly}
      aria-label={ariaLabel}
      value={value !== undefined ? String(value) : undefined}
      onChange={handleChange}
      className={cn('flex w-full min-w-0 flex-col gap-1.5', containerClassName, className)}
      {...props}
    >
      {label && (
        <Label className='text-sm font-medium text-foreground'>
          {label}
        </Label>
      )}

      <InputGroup
        className={cn(
          'h-10 w-full rounded-md border border-border bg-card shadow-2xs transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary flex items-center',
          invalid && 'border-destructive focus-within:border-destructive focus-within:ring-destructive',
          (disabled || readOnly) && 'border-border/60 bg-muted/40 text-muted-foreground cursor-not-allowed select-none',
          inputClassName,
        )}
      >
        <InputGroup.Prefix className='pl-3 text-muted-foreground/70 shrink-0 flex items-center'>
          <Phone className='size-4' />
        </InputGroup.Prefix>

        <InputGroup.Input
          ref={ref}
          type='tel'
          inputMode='tel'
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className={cn(
            'w-full bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none border-0 shadow-none px-3',
            (disabled || readOnly) && 'cursor-not-allowed text-muted-foreground',
          )}
        />

        {endAddon && (
          <InputGroup.Suffix className='pr-3 text-xs text-muted-foreground shrink-0 flex items-center'>
            {endAddon}
          </InputGroup.Suffix>
        )}
      </InputGroup>

      {invalid && errorMessage && (
        <FieldError className='mt-1 text-xs text-destructive flex items-center gap-1.5'>
          <TriangleExclamation width={14} height={14} className='shrink-0' />
          <span>{errorMessage}</span>
        </FieldError>
      )}
    </TextField>
  );
});
