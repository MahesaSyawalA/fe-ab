import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface ChipFilterItem {
  id: string;
  label: string;
  count?: number;
  dotColor?: string;
  icon?: React.ReactNode;
}

interface ChipFilterProps {
  items: ChipFilterItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function ChipFilter({ items, selectedId, onSelect, className }: ChipFilterProps) {
  return (
    <div
      className={cn(
        'flex w-full max-w-full min-w-0 items-center gap-2 overflow-x-auto no-scrollbar py-0.5',
        className
      )}
    >
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        return (
          <Button
            key={item.id}
            type='button'
            variant='outline'
            size='sm'
            onClick={() => onSelect(item.id)}
            className={cn(
              'h-8 shrink-0 gap-2 rounded-xl px-3 text-xs shadow-none cursor-pointer',
              isSelected
                ? 'border-kanban-purple/50 bg-kanban-purple/8 text-kanban-purple font-semibold hover:bg-kanban-purple/12 hover:text-kanban-purple'
                : 'border-border bg-card text-foreground font-medium hover:bg-secondary/60'
            )}
          >
            {item.dotColor ? (
              <span
                className={cn('size-2 shrink-0 rounded-full', item.dotColor)}
                aria-hidden='true'
              />
            ) : (
              item.icon && <span className='shrink-0'>{item.icon}</span>
            )}
            <span className='whitespace-nowrap'>{item.label}</span>
            {item.count !== undefined && (
              <Badge
                variant='secondary'
                className={cn(
                  'h-4 min-w-5 rounded-md px-1.5 py-0 text-[11px] font-semibold',
                  isSelected
                    ? 'bg-kanban-purple/15 text-kanban-purple'
                    : 'bg-secondary text-secondary-foreground'
                )}
              >
                {item.count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}
