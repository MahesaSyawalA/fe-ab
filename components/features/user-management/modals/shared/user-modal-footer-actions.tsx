'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface UserModalFooterActionsProps {
  onCancel: () => void;
  submitLabel: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
}

export function UserModalFooterActions({
  onCancel,
  submitLabel,
  cancelLabel = 'Batal',
  isSubmitting = false,
}: UserModalFooterActionsProps) {
  return (
    <div className='grid grid-cols-2 gap-3 w-full sm:flex sm:w-auto sm:justify-end sm:items-center sm:gap-2.5'>
      <Button
        type='button'
        variant='outline'
        onClick={onCancel}
        disabled={isSubmitting}
        className='h-10 sm:h-9 w-full sm:w-28 rounded-md text-xs font-semibold cursor-pointer border-border bg-card shadow-none hover:bg-muted/50'
      >
        {cancelLabel}
      </Button>
      <Button
        type='submit'
        disabled={isSubmitting}
        className='h-10 sm:h-9 w-full sm:w-auto sm:min-w-[140px] sm:px-5 rounded-md text-xs font-semibold text-white shadow-sm bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary transition-all cursor-pointer disabled:opacity-60'
      >
        {isSubmitting && <Loader2 className='mr-1.5 size-3.5 animate-spin' />}
        <span>{submitLabel}</span>
      </Button>
    </div>
  );
}

