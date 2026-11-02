import * as React from 'react';
import { Check, CircleDot } from 'lucide-react';
import { SurfaceCard } from '@/components/ui/surface-card';
import { CardContent } from '@/components/ui/card';
import { JENIS_TAHAP_OPTIONS } from '@/constants/kanban-constants';
import { cn } from '@/lib/utils';

interface ProspekProgressCardProps {
  stageId: string;
  stageLabel?: string;
  className?: string;
}

export function ProspekProgressCard({
  stageId,
  className,
}: ProspekProgressCardProps) {
  const currentStepIdx = Math.max(
    0,
    JENIS_TAHAP_OPTIONS.findIndex((s) => s.id === stageId),
  );

  return (
    <SurfaceCard className={className}>
      <CardContent className='flex flex-col gap-3 p-3.5 sm:p-4 lg:p-5'>
        <div className='flex items-center justify-between'>
          <span className='text-xs lg:text-sm font-bold text-foreground'>
            Progres Tahap
          </span>
          <span className='text-[10px] lg:text-xs text-muted-foreground font-medium'>
            Tahap {Math.min(currentStepIdx + 1, JENIS_TAHAP_OPTIONS.length)} dari {JENIS_TAHAP_OPTIONS.length}
          </span>
        </div>

        {/* Stepper Track */}
        <div className='overflow-x-auto lg:overflow-x-visible no-scrollbar -mx-1 px-1 py-1.5'>
          <div className='flex items-start min-w-[580px] lg:min-w-0 lg:w-full'>
            {JENIS_TAHAP_OPTIONS.map((step, index) => {
              const isCompleted = index <= currentStepIdx;
              const isCurrent = index === currentStepIdx;
              const isLast = index === JENIS_TAHAP_OPTIONS.length - 1;

              return (
                <React.Fragment key={step.id}>
                  <div className='flex flex-col items-center shrink-0 lg:shrink-0 w-16 lg:w-20'>
                    <div
                      className={cn(
                        'flex size-6 lg:size-7 items-center justify-center rounded-full text-xs font-semibold transition-all shrink-0',
                        isCompleted
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'border border-muted-foreground/30 bg-muted/30 text-muted-foreground',
                        isCurrent && 'ring-2 ring-primary/25 ring-offset-1',
                      )}
                    >
                      {isCompleted ? (
                        <Check className='size-3.5 lg:size-4 stroke-[2.5]' />
                      ) : (
                        <CircleDot className='size-3 lg:size-3.5' />
                      )}
                    </div>
                    <span
                      className={cn(
                        'mt-1.5 text-[10px] lg:text-[11px] font-medium whitespace-nowrap text-center transition-colors',
                        isCurrent
                          ? 'text-primary font-bold'
                          : isCompleted
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground',
                      )}
                    >
                      {step.label}
                    </span>
                  </div>

                  {!isLast && (
                    <div
                      className={cn(
                        'h-[2px] flex-1 min-w-8 lg:min-w-6 mt-3 lg:mt-3.5 rounded-full mx-1 transition-colors',
                        index < currentStepIdx
                          ? 'bg-primary'
                          : 'bg-slate-200 dark:bg-slate-700',
                      )}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </CardContent>
    </SurfaceCard>
  );
}
