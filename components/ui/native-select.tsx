import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NativeSelect({
  className,
  children,
  ...props
}: React.ComponentProps<'select'>) {
  return (
    <div className='relative'>
      <select
        data-slot='native-select'
        className={cn(
          'h-10 w-full appearance-none rounded-xl border border-primary/40 bg-card px-3.5 pr-9 text-xs text-foreground outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-muted-foreground',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className='pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground' />
    </div>
  );
}

