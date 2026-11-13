'use client';

import * as React from 'react';
import {
  TextField,
  Label,
  Input,
  FieldError,
  TextFieldProps,
} from '@heroui/react';
import { Eye, EyeOff } from 'lucide-react';
import { TriangleExclamation } from '@gravity-ui/icons';
import { cn } from '@/lib/utils';

export interface UserTextFieldInputProps
  extends Omit<TextFieldProps, 'onChange' | 'value'> {
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  autoFocus?: boolean;
  isDisabled?: boolean;
  inputClassName?: string;
  'aria-label'?: string;
}

export function UserTextFieldInput({
  label,
  placeholder,
  errorMessage,
  isInvalid,
  isRequired,
  value,
  onChange,
  type = 'text',
  autoFocus,
  isDisabled,
  inputClassName,
  className,
  'aria-label': ariaLabelProp,
  ...props
}: UserTextFieldInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPasswordField = type === 'password';
  const effectiveType = isPasswordField ? (showPassword ? 'text' : 'password') : type;
  const invalid = isInvalid || Boolean(errorMessage);

  const isExplicitRequired = isRequired || (label ? label.endsWith('*') : false);
  const displayLabel = label ? (label.endsWith('*') ? label.slice(0, -1).trim() : label) : '';
  const effectiveAriaLabel = ariaLabelProp || displayLabel || placeholder || 'Input text';

  return (
    <TextField
      isRequired={isRequired}
      isInvalid={invalid}
      isDisabled={isDisabled}
      value={value ?? ''}
      onChange={onChange}
      aria-label={effectiveAriaLabel}
      className={cn('flex w-full flex-col gap-1.5', className)}
      {...props}
    >
      {displayLabel && (
        <Label className='text-sm font-medium text-foreground'>
          {displayLabel}
          {isExplicitRequired && <span className='text-destructive ml-0.5'>*</span>}
        </Label>
      )}

      <div className='relative flex w-full items-center'>
        <Input
          type={effectiveType}
          autoFocus={autoFocus}
          placeholder={placeholder}
          aria-label={effectiveAriaLabel}
          className={cn(
            'h-10 w-full rounded-md border border-border bg-card px-3 text-xs sm:text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary aria-invalid:border-destructive aria-invalid:focus:border-destructive disabled:bg-muted/40 disabled:text-muted-foreground disabled:cursor-not-allowed',
            isPasswordField && 'pr-10',
            inputClassName
          )}
        />
        {isPasswordField && (
          <button
            type='button'
            onClick={() => setShowPassword((prev) => !prev)}
            className='absolute right-3 flex size-5 items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none'
            title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
            aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
          >
            {showPassword ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
          </button>
        )}
      </div>

      {invalid && errorMessage && (
        <FieldError className='mt-1 text-xs text-destructive flex items-center gap-1.5'>
          <TriangleExclamation width={14} height={14} className='shrink-0' />
          <span>{errorMessage}</span>
        </FieldError>
      )}
    </TextField>
  );
}
