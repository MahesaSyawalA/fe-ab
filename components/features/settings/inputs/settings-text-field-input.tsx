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

export interface SettingsTextFieldInputProps
  extends Omit<TextFieldProps, 'onChange' | 'value'> {
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
  prefix?: React.ReactNode;
  endAddon?: React.ReactNode;
  inputClassName?: string;
  containerClassName?: string;
}

export const SettingsTextFieldInput = React.forwardRef<
  HTMLInputElement,
  SettingsTextFieldInputProps
>(function SettingsTextFieldInput(
  {
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
    prefix,
    endAddon,
    inputClassName,
    containerClassName,
    className,
    ...props
  },
  ref,
) {
  const invalid = isInvalid || Boolean(errorMessage);
  const ariaLabel = props['aria-label'] || label || placeholder;

  return (
    <TextField
      isRequired={isRequired}
      isInvalid={invalid}
      isDisabled={disabled}
      isReadOnly={readOnly}
      aria-label={ariaLabel}
      value={value !== undefined ? String(value) : undefined}
      onChange={onChange}
      className={cn('flex w-full min-w-0 flex-col gap-1.5', containerClassName, className)}
      {...props}
    >
      {label && (
        <Label className='text-sm font-medium text-foreground'>
          {label}
        </Label>
      )}

      {prefix || endAddon ? (
        <InputGroup
          className={cn(
            'h-10 w-full rounded-md border border-border bg-card shadow-2xs transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary flex items-center',
            invalid && 'border-destructive focus-within:border-destructive focus-within:ring-destructive',
            (disabled || readOnly) && 'border-border/60 bg-muted/40 text-muted-foreground cursor-not-allowed select-none',
            inputClassName,
          )}
        >
          {prefix && (
            <InputGroup.Prefix className='pl-3 text-muted-foreground shrink-0 flex items-center'>
              {prefix}
            </InputGroup.Prefix>
          )}
          <InputGroup.Input
            ref={ref}
            type={type}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            aria-label={ariaLabel}
            className={cn(
              'w-full bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none border-0 shadow-none px-3',
              !prefix && 'pl-3',
              (disabled || readOnly) && 'cursor-not-allowed text-muted-foreground',
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
          ref={ref}
          type={type}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className={cn(
            'h-10 w-full rounded-md border border-border bg-card px-3 text-xs sm:text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary aria-invalid:border-destructive aria-invalid:focus:border-destructive aria-invalid:focus:ring-destructive disabled:border-border/60 disabled:bg-muted/40 disabled:text-muted-foreground disabled:cursor-not-allowed disabled:select-none shadow-2xs',
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
});
