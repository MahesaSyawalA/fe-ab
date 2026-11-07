import * as React from 'react';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SubpageHeaderProps {
  title: string;
  onBack: () => void;
  rightAction?: React.ReactNode;
  className?: string;
  subtitle?: string;
}

export function SubpageHeader({
  title,
  onBack,
  rightAction,
  className,
  subtitle,
}: SubpageHeaderProps) {
  return (
    <>
      {/* Mobile Top App Bar (< md) */}
      <header
        className={cn(
          'sticky top-0 z-40 flex h-14 w-full shrink-0 items-center justify-between border-b border-border/40 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80 px-4 md:hidden',
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

        <h1 className='absolute inset-x-12 text-center text-sm font-semibold text-foreground truncate'>
          {title}
        </h1>

        <div className='z-10 flex min-w-8 items-center justify-end'>
          {rightAction}
        </div>
      </header>

      {/* Desktop Header Row (>= md) */}
      <div
        className={cn(
          'hidden md:flex items-center justify-between w-full pb-4',
          className
        )}
      >
        <div className='flex items-center gap-3'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={onBack}
            className='h-9 rounded-xl border-border bg-card text-foreground shadow-2xs hover:bg-secondary gap-1.5 px-3 cursor-pointer text-xs font-medium'
            title='Kembali'
          >
            <ChevronLeft className='size-4' />
            <span>Kembali</span>
          </Button>

          <div className='h-5 w-px bg-border/80' />

          <div className='flex flex-col'>
            <h1 className='text-xl lg:text-2xl font-bold tracking-tight text-foreground'>
              {title}
            </h1>
            {subtitle && (
              <p className='text-xs sm:text-sm text-secondary-foreground mt-0.5 leading-snug'>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {rightAction && (
          <div className='flex items-center gap-2'>
            {rightAction}
          </div>
        )}
      </div>
    </>
  );
}
