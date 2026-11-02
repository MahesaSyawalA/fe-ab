import * as React from 'react';
import { Check } from 'lucide-react';
import { SurfaceCard } from '@/components/ui/surface-card';
import { CardContent } from '@/components/ui/card';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/reui/stepper';
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
          <div className='min-w-[580px] lg:min-w-0 lg:w-full'>
            <Stepper
              value={currentStepIdx + 1}
              orientation='horizontal'
              className='w-full'
            >
              <StepperNav className='w-full items-start'>
                {JENIS_TAHAP_OPTIONS.map((step, index) => {
                  const isCompleted = index < currentStepIdx;
                  const isCurrent = index === currentStepIdx;
                  const isLast = index === JENIS_TAHAP_OPTIONS.length - 1;

                  return (
                    <StepperItem
                      key={step.id}
                      step={index + 1}
                      completed={isCompleted}
                      className='relative flex-1 flex-col items-center justify-start'
                    >
                      <StepperTrigger className='flex flex-col items-center gap-1.5 p-0 bg-transparent hover:bg-transparent shadow-none cursor-default pointer-events-none border-0 focus-visible:ring-0 w-full z-10'>
                        <StepperIndicator
                          className={cn(
                            'size-6 lg:size-7 rounded-full transition-all text-xs font-semibold shrink-0 z-10',
                            isCompleted &&
                              'bg-primary text-primary-foreground border-transparent shadow-xs',
                            isCurrent &&
                              'bg-primary text-primary-foreground border-transparent ring-2 ring-primary/25 ring-offset-2 ring-offset-card shadow-xs font-bold',
                            !isCompleted &&
                              !isCurrent &&
                              'border border-border bg-muted/40 text-muted-foreground',
                          )}
                        >
                          {isCompleted ? (
                            <Check className='size-3.5 lg:size-4 stroke-[2.5]' />
                          ) : (
                            index + 1
                          )}
                        </StepperIndicator>
                        <StepperTitle
                          className={cn(
                            'text-[10px] lg:text-[11px] font-medium whitespace-nowrap text-center transition-colors',
                            isCurrent
                              ? 'text-primary font-bold'
                              : isCompleted
                                ? 'text-foreground font-medium'
                                : 'text-muted-foreground',
                          )}
                        >
                          {step.label}
                        </StepperTitle>
                      </StepperTrigger>

                      {!isLast && (
                        <StepperSeparator
                          className={cn(
                            'absolute top-[11px] lg:top-[13px] left-1/2 w-full m-0 h-0.5 rounded-none z-0',
                            'group-data-[orientation=horizontal]/stepper-nav:w-full group-data-[orientation=horizontal]/stepper-nav:flex-none',
                            'bg-muted/70 transition-colors',
                            'group-data-[state=completed]/step:bg-primary',
                          )}
                        />
                      )}
                    </StepperItem>
                  );
                })}
              </StepperNav>
            </Stepper>
          </div>
        </div>
      </CardContent>
    </SurfaceCard>
  );
}
