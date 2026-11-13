'use client';

import * as React from 'react';
import {
  Select,
  Label,
  Description,
  ListBox,
  FieldError,
} from '@heroui/react';
import { TriangleExclamation } from '@gravity-ui/icons';
import { cn } from '@/lib/utils';

export interface UserSelectOption {
  value: string;
  label: string;
}

export interface UserSelectInputProps {
  label: string;
  options: UserSelectOption[];
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  name?: string;
  className?: string;
  'aria-label'?: string;
}

const EMPTY_KEY = '__empty__';

export function UserSelectInput({
  label,
  options,
  value,
  onChange,
  placeholder = 'Pilih...',
  hint,
  errorMessage,
  isInvalid,
  isRequired,
  isDisabled,
  name,
  className,
  'aria-label': ariaLabelProp,
}: UserSelectInputProps) {
  const invalid = isInvalid || Boolean(errorMessage);
  const internalValue = value === null || value === undefined || value === '' ? null : value;

  const isExplicitRequired = isRequired || (label ? label.endsWith('*') : false);
  const displayLabel = label ? (label.endsWith('*') ? label.slice(0, -1).trim() : label) : '';
  const effectiveAriaLabel = ariaLabelProp || displayLabel || placeholder || 'Pilihan';

  const handleSelectionChange = (val: string | number | null | (string | number)[]) => {
    if (val === null || val === undefined || val === EMPTY_KEY) {
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
      aria-label={effectiveAriaLabel}
      className={cn('flex w-full min-w-0 flex-col gap-1.5', className)}
    >
      {displayLabel && (
        <Label className='text-sm font-medium text-foreground'>
          {displayLabel}
          {isExplicitRequired && <span className='text-destructive ml-0.5'>*</span>}
        </Label>
      )}

      {hint && !invalid && (
        <Description className='text-[11px] text-muted-foreground'>
          {hint}
        </Description>
      )}

      <Select.Trigger
        aria-label={effectiveAriaLabel}
        className='h-10 w-full min-w-0 items-center gap-2 overflow-hidden rounded-md border border-border bg-card px-3 text-xs sm:text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary aria-invalid:border-destructive disabled:bg-muted/40 disabled:text-muted-foreground disabled:cursor-not-allowed'
      >
        <Select.Value className='text-xs sm:text-sm min-w-0 flex-1 truncate text-left overflow-hidden pr-3'>
          {({ isPlaceholder, state, selectedText }) => {
            if (isPlaceholder || !state.selectedItems.length) {
              return (
                <span className='block min-w-0 truncate text-left text-muted-foreground'>
                  {placeholder}
                </span>
              );
            }

            const selectedKey = state.selectedItems[0]?.key;
            const selectedOpt =
              options.find((opt) => opt.value === selectedKey) ??
              options.find((opt) => opt.value === value);

            const labelText = selectedOpt?.label ?? selectedText ?? '';

            return (
              <span className='block min-w-0 truncate text-left'>
                {labelText || placeholder}
              </span>
            );
          }}
        </Select.Value>
        <Select.Indicator className='size-3.5 shrink-0 text-muted-foreground' />
      </Select.Trigger>

      <Select.Popover className='z-60 min-w-(--trigger-width) max-h-60 overflow-y-auto rounded-xl border border-border bg-popover shadow-md'>
        <ListBox className='p-1'>
          {options.map((opt) => (
            <ListBox.Item
              key={opt.value}
              id={opt.value}
              textValue={opt.label}
              className='flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground outline-none data-[focused=true]:bg-accent data-[focused=true]:text-accent-foreground data-[selected=true]:font-semibold'
            >
              <span className='min-w-0 flex-1 whitespace-normal wrap-break-word'>{opt.label}</span>
            </ListBox.Item>
          ))}
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
