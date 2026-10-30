import * as React from 'react';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SubpageHeaderProps {
  title: string;
  onBack: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export function SubpageHeader({
  title,
  onBack,
  rightAction,
  className,
}: SubpageHeaderProps) {
  return (
    <header
      className={cn(
        'relative flex h-14 w-full shrink-0 items-center justify-between bg-card px-4',
        className
      )}
    >
      <Button
        type='button'
        variant='outline'
        size='icon-sm'
        onClick={onBack}
        className='z-10 rounded-full border-border bg-card text-foreground shadow-2xs hover:bg-secondary cursor-pointer'
        title='Kembali'
      >
        <ChevronLeft className='size-4' />
      </Button>

      <h1 className='absolute inset-x-12 text-center text-sm sm:text-base font-semibold text-foreground truncate'>
        {title}
      </h1>

      <div className='z-10 flex min-w-8 items-center justify-end'>
        {rightAction}
      </div>
    </header>
  );
}
