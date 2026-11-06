import * as React from 'react';
import { Progress } from '@base-ui/react/progress';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  label?: string;
  className?: string;
}

/** Bar progres 0-100 dengan label kiri dan persentase kanan (opsional). */
export function ProgressBar({ value, label, className }: ProgressBarProps) {
  return (
    <Progress.Root value={value} className={cn('flex flex-col gap-1', className)}>
      <div className='flex items-center justify-between text-[11px] text-secondary-foreground'>
        <span>{label}</span>
        <Progress.Value className='font-semibold text-foreground'>
          {(_, v) => `${Math.round(v ?? 0)}%`}
        </Progress.Value>
      </div>
      <Progress.Track className='h-1.5 w-full overflow-hidden rounded-full bg-secondary'>
        <Progress.Indicator className='h-full rounded-full bg-primary transition-all' />
      </Progress.Track>
    </Progress.Root>
  );
}
