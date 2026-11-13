import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProspekInfoRowProps {
  label: string;
  value: React.ReactNode;

  href?: string;
  isMultiline?: boolean;
}

export function ProspekInfoRow({
  label,
  value,
  href,
  isMultiline = false,
}: ProspekInfoRowProps) {
  return (
    <div
      className={cn(
        'flex gap-4 px-4 sm:px-6 py-3.5 text-xs sm:text-sm',
        isMultiline
          ? 'flex-col items-start gap-1.5'
          : 'items-center justify-between',
      )}
    >
      <span className='text-muted-foreground font-medium shrink-0'>{label}</span>
      {href && typeof value === 'string' ? (
        <a
          href={href}
          className='text-right font-semibold text-primary hover:underline'
        >
          {value}
        </a>
      ) : isMultiline ? (
        <div className='w-full text-left font-normal text-foreground leading-relaxed bg-muted/30 p-2.5 rounded-lg border border-border/50 text-xs sm:text-sm'>
          {value}
        </div>
      ) : (
        <span className='text-right font-semibold text-foreground truncate'>
          {value}
        </span>
      )}
    </div>
  );
}
