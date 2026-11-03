'use client';

import * as React from 'react';
import { StageDrawerMode } from '../types';
import { StageCurrencyInput, StageDatePicker } from '../inputs';

export interface StageFormOpportunityProps {
  mode?: StageDrawerMode;
  estimasiNilai: string;
  onEstimasiNilaiChange: (val: string) => void;
  targetClosing?: string;
  onTargetClosingChange?: (val: string) => void;
}

export function StageFormOpportunity({
  mode = 'create',
  estimasiNilai,
  onEstimasiNilaiChange,
  targetClosing = '',
  onTargetClosingChange,
}: StageFormOpportunityProps) {
  return (
    <div className='flex flex-col gap-3'>
      {mode === 'move' ? (
        <>
          {/* Estimasi Nilai Closing * */}
          <StageCurrencyInput
            label='Estimasi Nilai Closing'
            name='estimasiNilaiOpportunity'
            isRequired
            value={estimasiNilai}
            onChange={onEstimasiNilaiChange}
            placeholder='45.000.000'
            prefix='RP'
            prefixClassName='text-primary font-bold'
          />

          {/* Target Closing * */}
          <StageDatePicker
            label='Target Closing'
            name='targetClosing'
            isRequired
            value={targetClosing}
            onChange={(val) => onTargetClosingChange?.(val)}
          />
        </>
      ) : (
        /* Estimasi Nilai Closing (opsional) di mode create */
        <StageCurrencyInput
          label='Estimasi Nilai Closing (opsional)'
          name='estimasiNilaiOpportunity'
          value={estimasiNilai}
          onChange={onEstimasiNilaiChange}
          placeholder='45.000.000'
          prefix='RP'
          prefixClassName='text-primary font-bold'
        />
      )}
    </div>
  );
}
