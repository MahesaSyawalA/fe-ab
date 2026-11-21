import * as React from 'react';
import { cn, toFiniteNumber } from '@/lib/utils';

export interface BarListItem {
  id: string;
  label: string;
  sublabel?: string;
  value: number;
  valueLabel: string;
}

interface BarListProps {
  items: BarListItem[];
  className?: string;
}

export function BarList({ items, className }: BarListProps) {
  const max = Math.max(...items.map((i) => toFiniteNumber(i.value)), 0);

  return (
    <ul className={cn('flex flex-col gap-3', className)}>
      {items.map((item) => {
        const val = toFiniteNumber(item.value);
        return (
          <li key={item.id} className='flex flex-col gap-1'>
            <div className='flex items-baseline justify-between gap-3 text-xs'>
              <span className='truncate font-semibold text-foreground'>{item.label}</span>
              <span className='shrink-0 font-bold text-primary'>{item.valueLabel}</span>
            </div>
            <div className='h-2 w-full overflow-hidden rounded-full bg-secondary'>
              <div
                className='h-full rounded-full bg-primary transition-all'
                style={{ width: `${max > 0 ? Math.max((val / max) * 100, 2) : 0}%` }}
              />
            </div>
            {item.sublabel && (
              <span className='text-[11px] text-secondary-foreground'>{item.sublabel}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
