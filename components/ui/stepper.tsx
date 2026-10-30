'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Stepper as ReuiStepper,
  StepperNav,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
} from '@/components/reui/stepper';

export interface StepItem {
  id: number;
  label: string;
}

interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
  className?: string;
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  return (
    <ReuiStepper
      value={currentStep}
      onValueChange={(step) => onStepClick?.(step)}
      className={cn('w-full', className)}
    >
      <StepperNav className='flex w-full items-start justify-between'>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isReached = stepNumber <= currentStep;
          const isLineActive = stepNumber < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <StepperItem
                step={stepNumber}
                className='flex flex-col items-center flex-none!'
              >
                <StepperTrigger
                  disabled={stepNumber > currentStep}
                  className='flex flex-col items-center gap-1.5 rounded-lg disabled:opacity-100'
                >
                  <StepperIndicator
                    className={cn(
                      'size-7 rounded-full text-xs font-semibold transition-colors',
                      isReached
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'bg-blue-50 text-slate-400'
                    )}
                  >
                    {stepNumber}
                  </StepperIndicator>
                  <StepperTitle
                    className={cn(
                      'text-xs transition-colors',
                      isReached
                        ? 'font-medium text-primary'
                        : 'font-normal text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </StepperTitle>
                </StepperTrigger>
              </StepperItem>

              {!isLast && (
                <div
                  aria-hidden='true'
                  className={cn(
                    'mt-3.5 h-0.5 flex-1 mx-1 rounded-full transition-colors duration-200',
                    isLineActive ? 'bg-primary' : 'bg-blue-100'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </StepperNav>
    </ReuiStepper>
  );
}
