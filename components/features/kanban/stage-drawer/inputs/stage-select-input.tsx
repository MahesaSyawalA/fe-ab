'use client';

import * as React from 'react';
import {
  Select,
  Label,
  ListBox,
  FieldError,
} from '@heroui/react';
import { TriangleExclamation } from '@gravity-ui/icons';
import { cn } from '@/lib/utils';

export interface StageSelectOption {
  value: string;
  label: string;
}

export interface StageSelectInputProps {
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  options: StageSelectOption[];
  name?: string;
  className?: string;
  triggerClassName?: string;
}

const EMPTY_OPTION_KEY = '__empty__';

export function StageSelectInput({
  label,
  placeholder = 'Pilih...',
  errorMessage,
  isInvalid,
  isRequired,
  isDisabled,
  value,
  onChange,
  options,
  name,
  className,
  triggerClassName,
}: StageSelectInputProps) {
  const invalid = isInvalid || Boolean(errorMessage);
  const hasEmptyOption = options.some((opt) => opt.value === '');

  let internalValue: string | null;
  if (value === '' || value === undefined) {
    internalValue = hasEmptyOption ? EMPTY_OPTION_KEY : null;
  } else {
    internalValue = value;
  }

  const handleSelectionChange = (
    val: string | number | null | (string | number)[],
  ) => {
    if (val === null || val === undefined) {
      onChange?.('');
    } else if (hasEmptyOption && val === EMPTY_OPTION_KEY) {
      onChange?.('');
    } else {
      onChange?.(String(val));
    }
  };

  return (
    <Select
      isRequired={isRequired}
      isInvalid={invalid}
      isDisabled={isDisabled}
      value={internalValue}
      onChange={handleSelectionChange}
      placeholder={placeholder}
      name={name}
      className={cn('flex w-full flex-col gap-1.5', className)}
    >
      {label && (
        <Label className='text-xs font-semibold text-foreground'>{label}</Label>
      )}

      <Select.Trigger
        className={cn(
          'h-9 w-full rounded-xl border border-border bg-card px-3 text-xs text-foreground transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary aria-invalid:border-destructive disabled:bg-muted/40 disabled:text-muted-foreground disabled:cursor-not-allowed',
          triggerClassName,
        )}
      >
        <Select.Value className='text-xs' />
        <Select.Indicator className='size-3.5 text-muted-foreground' />
      </Select.Trigger>

      <Select.Popover className='z-[60] min-w-[var(--trigger-width)] max-h-60 overflow-y-auto rounded-xl border border-border bg-popover shadow-md'>
        <ListBox className='p-1'>
          {options.map((opt) => {
            const itemId = opt.value === '' ? EMPTY_OPTION_KEY : opt.value;
            return (
              <ListBox.Item
                key={itemId}
                id={itemId}
                textValue={opt.label}
                className='flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-foreground outline-none data-[focused=true]:bg-accent data-[focused=true]:text-accent-foreground data-[selected=true]:font-semibold'
              >
                <span>{opt.label}</span>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            );
          })}
        </ListBox>
      </Select.Popover>

      {invalid && errorMessage && (
        <FieldError className='mt-1 text-xs text-destructive flex items-center gap-1.5'>
          <TriangleExclamation width={14} height={14} className='shrink-0' />
          <span>{errorMessage}</span>
        </FieldError>
      )}
    </Select>
  );
}
