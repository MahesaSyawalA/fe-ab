'use client';

import * as React from 'react';
import {
  TextField,
  Label,
  InputGroup,
  FieldError,
  TextFieldProps,
} from '@heroui/react';
import { TriangleExclamation } from '@gravity-ui/icons';
import { cn, formatNumberInput } from '@/lib/utils';

export interface StageCurrencyInputProps
  extends Omit<TextFieldProps, 'onChange' | 'value'> {
  label?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  isRequired?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  prefix?: string;
  prefixClassName?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  name?: string;
  className?: string;
  inputGroupClassName?: string;
  inputClassName?: string;
}

export function StageCurrencyInput({
  label,
  value,
  onChange,
  isRequired,
  disabled,
  readOnly,
  placeholder = '0',
  prefix = 'Rp',
  prefixClassName,
  errorMessage,
  isInvalid,
  name,
  className,
  inputGroupClassName,
  inputClassName,
  ...props
}: StageCurrencyInputProps) {
  const invalid = isInvalid || Boolean(errorMessage);

  return (
    <TextField
      isRequired={isRequired}
      isInvalid={invalid}
      isDisabled={disabled}
      isReadOnly={readOnly}
      name={name}
      value={String(value ?? '')}
      onChange={(val) => onChange?.(formatNumberInput(val))}
      className={cn('flex w-full flex-col gap-1.5', className)}
      {...props}
    >
      {label && (
        <Label className='text-xs font-semibold text-foreground'>{label}</Label>
      )}

      <InputGroup
        className={cn(
          'h-9 w-full rounded-xl border border-border bg-card shadow-none transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary aria-invalid:border-destructive disabled:bg-muted/40 disabled:text-muted-foreground disabled:cursor-not-allowed',
          inputGroupClassName,
        )}
      >
        <InputGroup.Prefix
          className={cn('pl-3 text-xs font-bold text-primary', prefixClassName)}
        >
          {prefix}
        </InputGroup.Prefix>
        <InputGroup.Input
          type='text'
          inputMode='numeric'
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          className={cn(
            'text-xs text-foreground placeholder:text-muted-foreground',
            inputClassName,
          )}
        />
      </InputGroup>

      {invalid && (
        <FieldError className='mt-1 text-xs text-destructive flex items-center gap-1.5'>
          <TriangleExclamation width={14} height={14} className='shrink-0' />
          <span>{errorMessage}</span>
        </FieldError>
      )}
    </TextField>
  );
}
