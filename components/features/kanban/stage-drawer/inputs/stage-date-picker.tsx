'use client';

import * as React from 'react';
import {
  DatePicker,
  DateField,
  Calendar,
  Label,
  FieldError,
} from '@heroui/react';
import { parseDate, type DateValue } from '@internationalized/date';
import { TriangleExclamation } from '@gravity-ui/icons';
import { cn } from '@/lib/utils';

export interface StageDatePickerProps {
  label?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
  inputClassName?: string;
  classNames?: {
    segment?: string;
    selectorButton?: string;
    calendarContent?: string;
    dateInputGroup?: string;
  };
}

export function StageDatePicker({
  label,
  errorMessage,
  isInvalid,
  isRequired,
  isDisabled,
  value,
  onChange,
  name,
  className,
  inputClassName,
  classNames,
}: StageDatePickerProps) {
  const invalid = isInvalid || Boolean(errorMessage);

  const parsedValue = React.useMemo<DateValue | null>(() => {
    if (!value) return null;
    try {
      const dateStr = value.includes('T') ? value.slice(0, 10) : value;
      return parseDate(dateStr);
    } catch {
      return null;
    }
  }, [value]);

  const handleDateChange = (dateVal: DateValue | null) => {
    if (!dateVal) {
      onChange?.('');
    } else {
      onChange?.(dateVal.toString());
    }
  };

  return (
    <DatePicker
      name={name}
      value={parsedValue}
      onChange={handleDateChange}
      isRequired={isRequired}
      isInvalid={invalid}
      isDisabled={isDisabled}
      className={cn('flex w-full min-w-0 flex-col gap-1.5 bg-transparent', className)}
    >
      {label && (
        <Label className='text-sm font-medium text-foreground bg-transparent'>{label}</Label>
      )}

      <DateField.Group
        fullWidth
        className={cn(
          'h-10 w-full rounded-md border border-border bg-card px-3 text-xs text-foreground transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary aria-invalid:border-destructive disabled:bg-muted/40 disabled:text-muted-foreground disabled:cursor-not-allowed',
          inputClassName,
          classNames?.dateInputGroup,
        )}
      >
        <DateField.Input className='text-xs sm:text-sm'>
          {(segment) => (
            <DateField.Segment
              segment={segment}
              className={cn(
                'text-foreground',
                'data-[type=literal]:text-foreground/50',
                'data-placeholder:text-muted-foreground',
                classNames?.segment,
              )}
            />
          )}
        </DateField.Input>
        <DateField.Suffix>
          <DatePicker.Trigger
            className={cn(
              'cursor-pointer text-foreground/70 hover:text-foreground',
              classNames?.selectorButton,
            )}
          >
            <DatePicker.TriggerIndicator className='text-foreground/70 hover:text-foreground' />
          </DatePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>

      <DatePicker.Popover className='z-60 rounded-xl border border-border bg-popover p-3 shadow-md'>
        <Calendar
          aria-label={label || 'Pilih tanggal'}
          className={cn(
            '[&_th]:text-foreground/70 [&_th]:font-semibold',
            classNames?.calendarContent,
          )}
        >
          <Calendar.Header>
            <Calendar.YearPickerTrigger>
              <Calendar.YearPickerTriggerHeading />
              <Calendar.YearPickerTriggerIndicator />
            </Calendar.YearPickerTrigger>
            <Calendar.NavButton slot='previous' />
            <Calendar.NavButton slot='next' />
          </Calendar.Header>
          <Calendar.Grid>
            <Calendar.GridHeader>
              {(day) => (
                <Calendar.HeaderCell className='text-foreground/70 font-semibold'>
                  {day}
                </Calendar.HeaderCell>
              )}
            </Calendar.GridHeader>
            <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
          </Calendar.Grid>
          <Calendar.YearPickerGrid>
            <Calendar.YearPickerGridBody>
              {({ year }) => <Calendar.YearPickerCell year={year} />}
            </Calendar.YearPickerGridBody>
          </Calendar.YearPickerGrid>
        </Calendar>
      </DatePicker.Popover>

      {invalid && errorMessage && (
        <FieldError className='mt-1 flex items-center gap-1.5 text-xs text-destructive'>
          <TriangleExclamation width={14} height={14} className='shrink-0' />
          <span>{errorMessage}</span>
        </FieldError>
      )}
    </DatePicker>
  );
}
