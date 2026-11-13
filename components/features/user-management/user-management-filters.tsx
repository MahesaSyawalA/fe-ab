'use client';

import * as React from 'react';
import { Search, Filter } from 'lucide-react';
import { SearchField } from '@heroui/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  ROLE_FILTER_OPTIONS,
  type RoleFilterValue,
} from './types';

interface UserManagementFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedRole: RoleFilterValue;
  onRoleChange: (role: RoleFilterValue) => void;
  roleCounts: Record<RoleFilterValue, number>;
  onOpenFilterModal?: () => void;
  className?: string;
}

export function UserManagementFilters({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  roleCounts,
  onOpenFilterModal,
  className,
}: UserManagementFiltersProps) {
  return (
    <div className={cn('flex w-full min-w-0 flex-col gap-3', className)}>
      <div className='flex w-full min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex w-full min-w-0 items-center gap-2.5 lg:max-w-md'>
          <SearchField
            aria-label='Cari pengguna'
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
                placeholder='Cari nama, email, no telepon...'
                className='w-full bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none border-0 shadow-none px-2'
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
            title='Filter Tambahan'
            aria-label='Buka filter tambahan'
          >
            <Filter className='size-4' />
          </Button>
        </div>

        <div className='w-full lg:w-auto min-w-0 overflow-x-auto no-scrollbar'>
          <div className='flex items-center gap-2 py-0.5'>
            {ROLE_FILTER_OPTIONS.map((option) => {
              const isSelected = selectedRole === option.key;
              const count = roleCounts[option.key] ?? 0;

              return (
                <Button
                  key={option.key}
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => onRoleChange(option.key)}
                  className={cn(
                    'h-8 shrink-0 gap-2 rounded-full px-3 text-xs shadow-none cursor-pointer transition-all',
                    isSelected
                      ? 'border-kanban-purple/50 bg-kanban-purple/8 text-kanban-purple font-semibold hover:bg-kanban-purple/12 hover:text-kanban-purple'
                      : 'border-border bg-card text-foreground font-medium hover:bg-secondary/60'
                  )}
                >
                  <span
                    className={cn('size-2 shrink-0 rounded-full', option.dotColor)}
                    aria-hidden='true'
                  />
                  <span className='whitespace-nowrap'>{option.label}</span>

                  <Badge
                    variant='secondary'
                    className={cn(
                      'h-4.5 min-w-5 rounded-full px-1.5 py-0 text-[10px] font-semibold flex items-center justify-center',
                      isSelected
                        ? 'bg-kanban-purple/15 text-kanban-purple'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
