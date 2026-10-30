import * as React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { ChipFilter, ChipFilterItem } from '@/components/ui/chip-filter';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

export interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  filterChips?: ChipFilterItem[];
  onOpenFilterModal?: () => void;
  activeFilterCount?: number;
  className?: string;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  placeholder = 'Search',
  selectedCategory,
  onCategoryChange,
  filterChips,
  onOpenFilterModal,
  activeFilterCount,
  className,
}: SearchFilterBarProps) {
  const hasChips = Boolean(
    filterChips && filterChips.length > 0 && selectedCategory !== undefined && onCategoryChange,
  );

  return (
    <div className={cn('flex w-full min-w-0 flex-col gap-3', className)}>
      <div
        className={cn(
          'flex w-full min-w-0 flex-col gap-3',
          hasChips && 'lg:flex-row lg:items-center lg:justify-between',
        )}
      >
        <div
          className={cn(
            'flex w-full min-w-0 items-center gap-2.5',
            hasChips && 'lg:max-w-md',
          )}
        >
          <InputGroup className='h-10 flex-1 rounded-xl border-border bg-card shadow-2xs'>
            <InputGroupAddon
              align='inline-start'
              className='gap-2.5 pl-3 pr-1 text-secondary-foreground'
            >
              <Search className='size-4' />
              <Separator orientation='vertical' className='h-4' />
            </InputGroupAddon>
            <InputGroupInput
              type='text'
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              className='text-xs text-foreground placeholder:text-muted-foreground'
            />
            {searchQuery && (
              <InputGroupAddon align='inline-end' className='pr-2'>
                <InputGroupButton
                  size='icon-xs'
                  onClick={() => onSearchChange('')}
                  className='text-muted-foreground hover:text-foreground cursor-pointer'
                >
                  <X className='size-3.5' />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>

          <Button
            type='button'
            variant='outline'
            size='icon'
            onClick={onOpenFilterModal}
            className='relative size-10 shrink-0 rounded-xl border-primary/15 bg-primary/8 text-primary shadow-none hover:bg-primary/15 hover:text-primary cursor-pointer'
            title='Filter'
          >
            <Filter className='size-4' />
            {Boolean(activeFilterCount && activeFilterCount > 0) && (
              <span className='absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white'>
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {hasChips && (
          <div className='w-full lg:w-auto min-w-0 overflow-x-auto no-scrollbar'>
            <ChipFilter
              items={filterChips!}
              selectedId={selectedCategory!}
              onSelect={onCategoryChange!}
              className='flex-nowrap lg:flex-wrap'
            />
          </div>
        )}
      </div>
    </div>
  );
}

