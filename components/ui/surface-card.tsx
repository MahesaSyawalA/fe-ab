import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function SurfaceCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        'rounded-2xl border-border bg-card border py-0 shadow-xs ring-0',
        className,
      )}
      {...props}
    />
  );
}
