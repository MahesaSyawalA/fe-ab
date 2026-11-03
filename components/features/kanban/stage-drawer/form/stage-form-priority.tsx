'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TiketPrioritas } from '@/types/ticket.types';
import { PRIORITY_CONFIG } from '@/constants/kanban-constants';

interface StageFormPriorityProps {
  prioritas: TiketPrioritas;
  onPrioritasChange: (p: TiketPrioritas) => void;
}

export function StageFormPriority({
  prioritas,
  onPrioritasChange,
}: StageFormPriorityProps) {
  return (
    <div className='flex flex-col gap-2 pt-1 border-t border-border/60'>
      <Label className='text-sm font-medium text-foreground'>
        Prioritas Tiket <span className='text-rose-500'>*</span>
      </Label>
      <div className='grid grid-cols-3 gap-2'>
        {(['rendah', 'sedang', 'tinggi'] as TiketPrioritas[]).map((p) => {
          const cfg = PRIORITY_CONFIG[p];
          const isSelected = prioritas === p;
          return (
            <Button
              key={p}
              type='button'
              variant='outline'
              onClick={() => onPrioritasChange(p)}
              className={cn(
                'h-9 rounded-xl text-xs font-medium gap-1.5 transition-all cursor-pointer',
                isSelected ? cfg.activeClass : 'border-border text-muted-foreground',
              )}
            >
              <span className={cn('size-2 rounded-full', cfg.dotClass)} />
              {cfg.formLabel}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
