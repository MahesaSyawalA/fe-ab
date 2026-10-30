import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

export interface IconInputFieldProps extends React.ComponentProps<'input'> {
  label: string;
  required?: boolean;
  optionalText?: string;
  icon?: React.ReactNode;
  endAddon?: React.ReactNode;
  errorMessage?: string;
  containerClassName?: string;
}

export function IconInputField({
  label,
  required,
  optionalText,
  icon,
  endAddon,
  errorMessage,
  containerClassName,
  className,
  ...inputProps
}: IconInputFieldProps) {
  return (
    <div className={cn('flex w-full min-w-0 flex-col gap-1.5', containerClassName)}>
      <Label className='gap-0.5 text-xs font-medium text-foreground'>
        <span>{label}</span>
        {required && <span className='text-destructive'>*</span>}
        {optionalText && (
          <span className='ml-1 font-normal text-secondary-foreground'>
            {optionalText}
          </span>
        )}
      </Label>

      <InputGroup
        className={cn(
          'h-10 rounded-xl border-border bg-card shadow-2xs',
          errorMessage && 'border-destructive',
          className
        )}
      >
        {icon && (
          <InputGroupAddon align='inline-start' className='pl-3 text-secondary-foreground'>
            {icon}
          </InputGroupAddon>
        )}
        <InputGroupInput
          className={cn(
            'text-xs text-foreground placeholder:text-muted-foreground',
            !icon && 'pl-3'
          )}
          required={required}
          {...inputProps}
        />
        {endAddon && (
          <InputGroupAddon align='inline-end' className='pr-3 text-xs text-secondary-foreground'>
            {endAddon}
          </InputGroupAddon>
        )}
      </InputGroup>

      {errorMessage && (
        <span className='text-[11px] text-destructive'>{errorMessage}</span>
      )}
    </div>
  );
}
