'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { cn, formatNumberInput } from '@/lib/utils';

interface StageFormOpportunityProps {
  estimasiNilai: string;
  onEstimasiNilaiChange: (val: string) => void;
  targetClosing: string;
  onTargetClosingChange: (val: string) => void;
  probabilitas: string;
  onProbabilitasChange: (val: string) => void;
  analisisKompetitor: string;
  onAnalisisKompetitorChange: (val: string) => void;
}

export function StageFormOpportunity({
  estimasiNilai,
  onEstimasiNilaiChange,
  targetClosing,
  onTargetClosingChange,
  probabilitas,
  onProbabilitasChange,
  analisisKompetitor,
  onAnalisisKompetitorChange,
}: StageFormOpportunityProps) {
  return (
    <div className='flex flex-col gap-3.5'>
      <div className='grid grid-cols-2 gap-3'>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>
            Estimasi Nilai Closing (Rp) <span className='text-rose-500'>*</span>
          </Label>
          <InputGroup className='h-10 rounded-xl border-border bg-card shadow-none'>
            <InputGroupAddon align='inline-start' className='pl-3 text-xs font-bold text-primary'>
              Rp
            </InputGroupAddon>
            <InputGroupInput
              value={estimasiNilai}
              onChange={(e) => onEstimasiNilaiChange(formatNumberInput(e.target.value))}
              placeholder='0'
              className='text-xs font-semibold'
              required
            />
          </InputGroup>
        </div>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>
            Target Closing <span className='text-rose-500'>*</span>
          </Label>
          <Input
            type='date'
            value={targetClosing}
            onChange={(e) => onTargetClosingChange(e.target.value)}
            className='h-10 rounded-xl text-xs'
            required
          />
        </div>
      </div>

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

      <div className='flex flex-col gap-1.5'>
        <Label className='text-xs font-semibold'>Rencana Aksi & Analisis Pesaing</Label>
        <Input
          value={analisisKompetitor}
          onChange={(e) => onAnalisisKompetitorChange(e.target.value)}
          placeholder='Kompetitor yang masuk dan keunggulan teknologi kita...'
          className='h-10 rounded-xl text-xs'
        />
      </div>
    </div>
  );
}
