'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export interface OptionCardItem {
  id: string;
  title: string;
  description?: string;
}

interface OptionCardGroupProps {
  options: OptionCardItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function OptionCardGroup({ options, value, onChange, className }: OptionCardGroupProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(val) => onChange(String(val))}
      className={cn('flex flex-col gap-2.5', className)}
    >
      {options.map((option) => {
        const isSelected = option.id === value;
        return (
          <label
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              'flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-all select-none',
              isSelected
                ? 'border-primary bg-primary/4 ring-1 ring-primary/20'
                : 'border-border bg-card hover:bg-secondary/40'
            )}
          >
            <RadioGroupItem value={option.id} className='shrink-0' />
            <div className='flex min-w-0 flex-1 flex-col'>
              <span className='text-xs sm:text-sm font-semibold text-foreground leading-tight'>
                {option.title}
              </span>
              {option.description && (
                <span className='text-[11px] text-secondary-foreground mt-0.5 leading-snug'>
                  {option.description}
                </span>
              )}
            </div>
          </label>
        );
      })}
    </RadioGroup>
  );
}
