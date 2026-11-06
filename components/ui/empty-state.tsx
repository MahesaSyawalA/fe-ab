import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <Card
      size='sm'
      className={cn(
        'col-span-full rounded-2xl border border-border ring-0 py-12 text-center shadow-none',
        className,
      )}
    >
      <CardContent className='items-center justify-center gap-1.5'>
        <p className='text-sm font-semibold text-foreground'>{title}</p>
        {description && <p className='text-xs text-muted-foreground'>{description}</p>}
      </CardContent>
    </Card>
  );
}
