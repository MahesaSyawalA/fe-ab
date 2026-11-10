'use client';

import * as React from 'react';
import {
  TextField,
  Label,
  Input,
  TextFieldProps,
} from '@heroui/react';
import { cn } from '@/lib/utils';

export interface ProfileDetailFieldProps
  extends Omit<TextFieldProps, 'onChange' | 'value'> {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  endAddon?: React.ReactNode;
}

export function ProfileDetailField({
  label,
  value,
  icon,
  endAddon,
  className,
  ...props
}: ProfileDetailFieldProps) {
  const ariaLabel = props['aria-label'] || label || 'Detail Akun';

  return (
    <TextField
      isReadOnly
      isDisabled
      aria-label={ariaLabel}
      value={value ?? '-'}
      className={cn('flex w-full flex-col gap-1', className)}
      {...props}
    >
      <Label className='text-xs text-muted-foreground font-normal'>
        {label}
      </Label>
      <div className='flex items-center justify-between text-xs sm:text-sm font-semibold text-foreground'>
        <div className='flex items-center gap-2'>
          {icon && <span className='text-muted-foreground/70 shrink-0'>{icon}</span>}
          <Input
            readOnly
            disabled
            aria-label={ariaLabel}
            value={value ?? '-'}
            className='h-auto border-0 bg-transparent p-0 text-xs sm:text-sm font-semibold text-foreground shadow-none disabled:bg-transparent disabled:text-foreground cursor-default'
          />
        </div>
        {endAddon}
      </div>
    </TextField>
  );
}
