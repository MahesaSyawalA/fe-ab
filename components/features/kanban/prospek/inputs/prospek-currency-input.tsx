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

export interface ProspekCurrencyInputProps
  extends Omit<TextFieldProps, 'onChange' | 'value'> {
  label: string;
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

export function ProspekCurrencyInput({
  label,
  value,
  onChange,
  isRequired,
  disabled,
  readOnly,
  placeholder = 'Default',
  prefix = 'RP',
  prefixClassName,
  errorMessage,
  isInvalid,
  name,
  className,
  inputGroupClassName,
  inputClassName,
  ...props
}: ProspekCurrencyInputProps) {
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
      <Label className='text-xs font-semibold text-foreground'>{label}</Label>

      <InputGroup
        className={cn(
          'h-10 w-full rounded-xl border border-primary/40 bg-card shadow-none transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary aria-invalid:border-destructive disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed',
          inputGroupClassName,
        )}
      >
        <InputGroup.Prefix
          className={cn(
            'flex items-center gap-2.5 pl-3.5 pr-1 text-xs font-semibold text-muted-foreground',
            prefixClassName,
          )}
        >
          <span>{prefix}</span>
          <span className='h-4 w-px bg-border' aria-hidden='true' />
        </InputGroup.Prefix>
        <InputGroup.Input
          type='text'
          inputMode='numeric'
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          className={cn(
            'text-xs font-medium text-foreground placeholder:text-muted-foreground',
            inputClassName,
          )}
        />
      </InputGroup>

      {invalid && (
        <FieldError className='mt-1 text-[11px] font-medium text-destructive flex items-center gap-1.5'>
          <TriangleExclamation width={14} height={14} className='shrink-0' />
          <span>{errorMessage}</span>
        </FieldError>
      )}
    </TextField>
  );
}
