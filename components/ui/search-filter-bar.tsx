import * as React from 'react';
import { Search, Filter } from 'lucide-react';
import { SearchField } from '@heroui/react';
import { ChipFilter, ChipFilterItem } from '@/components/ui/chip-filter';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

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
          <SearchField
            aria-label={placeholder}
            value={searchQuery}
            onChange={onSearchChange}
            className='flex-1 min-w-0'
          >
            <SearchField.Group className='h-10 w-full rounded-xl border border-border bg-card px-3 shadow-2xs transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary flex items-center'>
              <div className='flex items-center gap-2.5 pr-1 text-muted-foreground pointer-events-none shrink-0'>
                <Search className='size-4 text-muted-foreground shrink-0' />
                <Separator orientation='vertical' className='h-4 w-px bg-border/80' />
              </div>
              <SearchField.Input
                placeholder={placeholder}
                className='w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none border-0 shadow-none px-2'
              />
              <SearchField.ClearButton className='text-muted-foreground hover:text-foreground cursor-pointer shrink-0' />
            </SearchField.Group>
          </SearchField>

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

