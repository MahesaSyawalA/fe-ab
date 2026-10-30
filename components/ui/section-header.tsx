import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  badgeText?: string;
  className?: string;
}

export function SectionHeader({
  icon,
  title,
  badgeText,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between gap-2', className)}>
      <div className='flex items-center gap-2.5'>
        <div className='flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent'>
          {icon}
        </div>
        <h2 className='text-sm sm:text-base font-bold text-foreground'>{title}</h2>
      </div>

      {badgeText && (
        <Badge
          variant='outline'
          className='rounded-full border-primary/20 bg-primary/8 px-3 py-0.5 text-[11px] font-medium text-primary'
        >
          {badgeText}
        </Badge>
      )}
    </div>
  );
}
