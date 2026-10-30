import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export interface StatCardProps extends React.ComponentProps<typeof Card> {
  value: React.ReactNode;
  label: string;
  icon?: React.ReactNode;
  align?: 'left' | 'center';
  valueClassName?: string;
}

export function StatCard({
  value,
  label,
  icon,
  align = 'left',
  valueClassName,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card
      size='sm'
      className={cn(
        'py-3 ring-0 border border-border shadow-2xs',
        className
      )}
      {...props}
    >
      <CardContent
        className={cn(
          'gap-0.5 px-3',
          align === 'center' ? 'items-center text-center' : 'items-start text-left'
        )}
      >
        {icon && <div className='mb-1 text-primary'>{icon}</div>}
        <div
          className={cn(
            'text-base sm:text-lg font-bold text-primary tracking-tight leading-snug truncate max-w-full',
            valueClassName
          )}
        >
          {value}
        </div>
        <div className='text-[11px] font-normal text-secondary-foreground leading-snug truncate max-w-full'>
          {label}
        </div>
      </CardContent>
    </Card>
  );
}
