import * as React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ListPageHeaderProps {
  title: string;
  subtitle: string;
  addLabel: string;
  onAddClick?: () => void;
}

export function ListPageHeader({ title, subtitle, addLabel, onAddClick }: ListPageHeaderProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full'>
      <div>
        <h1 className='text-lg sm:text-xl font-bold text-foreground tracking-tight leading-snug'>
          {title}
        </h1>
        <p className='text-xs sm:text-sm text-secondary-foreground'>{subtitle}</p>
      </div>

      {onAddClick && (
        <Button
          onClick={onAddClick}
          className='h-9.5 rounded-md bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary font-semibold text-xs px-4 gap-1.5 text-white shadow-sm disabled:opacity-50 transition-all cursor-pointer self-start sm:self-auto'
        >
          <Plus className='size-3.5 stroke-[2.5]' />
          {addLabel}
        </Button>
      )}
    </div>
  );
}
