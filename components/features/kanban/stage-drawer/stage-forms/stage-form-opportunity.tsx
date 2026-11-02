'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { StageCurrencyInput, StageDatePicker } from '../inputs';

interface StageFormOpportunityProps {
  estimasiNilai: string;
  onEstimasiNilaiChange: (val: string) => void;
  targetClosing: string;
  onTargetClosingChange: (val: string) => void;
  probabilitas: string;
  onProbabilitasChange: (val: string) => void;
  analisisKompetitor?: string;
  onAnalisisKompetitorChange?: (val: string) => void;
}

export function StageFormOpportunity({
  estimasiNilai,
  onEstimasiNilaiChange,
  targetClosing,
  onTargetClosingChange,
  probabilitas,
  onProbabilitasChange,
}: StageFormOpportunityProps) {
  return (
    <div className='flex flex-col gap-3'>
      <StageCurrencyInput
        label='Estimasi Nilai Closing (Rp)'
        name='estimasiNilai'
        isRequired
        value={estimasiNilai}
        onChange={onEstimasiNilaiChange}
        placeholder='0'
        prefix='Rp'
        prefixClassName='text-foreground'
        inputClassName='font-semibold'
      />

      <StageDatePicker
        label='Target Closing'
        name='targetClosing'
        isRequired
        value={targetClosing}
        onChange={onTargetClosingChange}
      />

      <div className='flex flex-col gap-1.5'>
        <Label className='text-xs font-semibold'>
          Tingkat Probabilitas (Win Rate) <span className='text-rose-500'>*</span>
        </Label>
        <div className='grid grid-cols-4 gap-2'>
          {['25%', '50%', '75%', '90%'].map((rate) => (
            <Button
              key={rate}
              type='button'
              variant='outline'
              onClick={() => onProbabilitasChange(rate)}
              className={cn(
                'h-9 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                probabilitas === rate
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground',
              )}
            >
              {rate}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
