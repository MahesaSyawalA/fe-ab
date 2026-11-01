import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  required,
  error,
  hint,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label className='text-xs font-semibold text-foreground'>
        {label}
        {required && <span className='text-destructive'> *</span>}
      </Label>
      {children}
      {error ? (
        <p className='flex items-center gap-1.5 text-[11px] font-medium text-destructive'>
          <AlertTriangle className='size-3 shrink-0' />
          {error}
        </p>
      ) : (
        hint && <span className='text-[10px] text-muted-foreground'>{hint}</span>
      )}
    </div>
  );
}
