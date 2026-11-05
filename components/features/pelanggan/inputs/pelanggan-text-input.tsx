'use client';

import * as React from 'react';
import {
  TextField,
  Label,
  Input,
  InputGroup,
  FieldError,
  TextFieldProps,
} from '@heroui/react';
import { TriangleExclamation } from '@gravity-ui/icons';
import { cn } from '@/lib/utils';

export interface PelangganTextInputProps
  extends Omit<TextFieldProps, 'onChange' | 'value'> {
  label?: string;
  required?: boolean;
  optionalText?: string;
  placeholder?: string;
  errorMessage?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  endAddon?: React.ReactNode;
  type?: string;
  step?: string | number;
  min?: number;
  max?: number;
  inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
  disabled?: boolean;
  readOnly?: boolean;
  inputClassName?: string;
  containerClassName?: string;
}

export function PelangganTextInput({
  label,
  required,
  optionalText,
  placeholder,
  errorMessage,
  isInvalid,
  isRequired,
  value,
  onChange,
  icon,
  endAddon,
  type = 'text',
  step,
  min,
  max,
  inputMode,
  disabled,
  readOnly,
  inputClassName,
  containerClassName,
  className,
  ...props
}: PelangganTextInputProps) {
  const invalid = isInvalid || Boolean(errorMessage);
  const isReq = required || isRequired;

  return (
    <TextField
      isRequired={isReq}
      isInvalid={invalid}
      isDisabled={disabled}
      isReadOnly={readOnly}
      value={value !== undefined ? String(value) : undefined}
      onChange={onChange}
      className={cn('flex w-full flex-col gap-1.5', containerClassName, className)}
      {...props}
    >
      {label && (
        <Label className='text-sm font-medium text-foreground'>
          {label}
          {optionalText && (
            <span className='ml-1 text-xs font-normal text-muted-foreground'>
              {optionalText}
            </span>
          )}
        </Label>
      )}

      {icon || endAddon ? (
        <InputGroup
          className={cn(
            'h-10 w-full rounded-md border border-border bg-card shadow-2xs transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary flex items-center',
            invalid && 'border-destructive focus-within:border-destructive focus-within:ring-destructive',
            (disabled || readOnly) && 'bg-muted/40 text-muted-foreground cursor-not-allowed',
            inputClassName,
          )}
        >
          {icon && (
            <InputGroup.Prefix className='pl-3 text-secondary-foreground shrink-0 flex items-center'>
              {icon}
            </InputGroup.Prefix>
          )}
          <InputGroup.Input
            type={type}
            step={step}
            min={min}
            max={max}
            inputMode={inputMode}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            className={cn(
              'w-full bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none border-0 shadow-none px-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
              !icon && 'pl-3',
            )}
          />
          {endAddon && (
            <InputGroup.Suffix className='pr-3 text-xs text-muted-foreground shrink-0 flex items-center'>
              {endAddon}
            </InputGroup.Suffix>
          )}
        </InputGroup>
      ) : (
        <Input
          type={type}
          step={step}
          min={min}
          max={max}
          inputMode={inputMode}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          className={cn(
            'h-9 w-full rounded-md border border-border bg-card px-3 text-xs sm:text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary aria-invalid:border-destructive aria-invalid:focus:border-destructive aria-invalid:focus:ring-destructive read-only:bg-muted/40 read-only:text-muted-foreground read-only:cursor-default disabled:bg-muted/40 disabled:text-muted-foreground disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-2xs',
            inputClassName,
          )}
        />
      )}

      {invalid && errorMessage && (
        <FieldError className='mt-1 text-xs text-destructive flex items-center gap-1.5'>
          <TriangleExclamation width={14} height={14} className='shrink-0' />
          <span>{errorMessage}</span>
        </FieldError>
      )}
    </TextField>
  );
}

