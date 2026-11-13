import * as React from 'react';
import { Hospital } from 'lucide-react';
import { Label } from '@heroui/react';
import { TriangleExclamation } from '@gravity-ui/icons';
import { Control, Controller } from 'react-hook-form';
import { OptionCardGroup } from '@/components/ui/option-card';
import { Button } from '@/components/ui/button';
import {
  PelangganTextInput,
  PelangganTextArea,
  PelangganFileInput,
} from '../../inputs';
import { OUTLET_TYPES } from '@/constants/pelanggan-constants';
import type { CreateCustomerInput } from '@/schemas/customer.schema';
import { WizardStepCard } from '../wizard-step-card';

interface FormStepProfilProps {
  control: Control<CreateCustomerInput>;
  onNext: () => void;
  onFileChange?: (file: File | null) => void;
}

export function FormStepProfil({ control, onNext, onFileChange }: FormStepProfilProps) {
  return (
    <WizardStepCard
      icon={<Hospital className='size-4' />}
      title='Informasi Outlet'
      badgeText='Wajib'
    >

      <Controller
        control={control}
        name='nama_outlet'
        render={({ field, fieldState: { error } }) => (
          <PelangganTextInput
            label='Nama Outlet'
            required
            icon={<Hospital className='size-4' />}
            value={field.value}
            onChange={field.onChange}
            isInvalid={Boolean(error)}
            errorMessage={error?.message}
            placeholder='Contoh: RS Ibu & Anak Kasih Bunda'
          />
        )}
      />

      <Controller
        control={control}
        name='tipe_outlet'
        render={({ field, fieldState: { error } }) => (
          <div className='flex flex-col gap-1.5'>
            <Label isRequired className='text-sm font-medium text-foreground'>
              Tipe Outlet
            </Label>
            <OptionCardGroup
              options={OUTLET_TYPES}
              value={field.value}
              onChange={field.onChange}
              className='grid grid-cols-1 sm:grid-cols-2 gap-3'
            />
            {error && (
              <span className='mt-1 text-xs text-destructive flex items-center gap-1.5'>
                <TriangleExclamation width={14} height={14} className='shrink-0' />
                <span>{error.message}</span>
              </span>
            )}
          </div>
        )}
      />

      <Controller
        control={control}
        name='alamat'
        render={({ field, fieldState: { error } }) => (
          <PelangganTextArea
            label='Alamat Lengkap Outlet'
            required
            rows={4}
            value={field.value}
            onChange={field.onChange}
            isInvalid={Boolean(error)}
            errorMessage={error?.message}
            placeholder='Contoh: Jl. Salemba Raya No. 42A, RT 03 / RW 05, Kenari, Senen, Jakarta Pusat 10430'
          />
        )}
      />

      <Controller
        control={control}
        name='img_url'
        render={({ field, fieldState: { error } }) => (
          <PelangganFileInput
            label='Foto Outlet'
            isRequired
            helperText='Unggah 1 foto beresolusi jelas yang memperlihatkan identitas outlet resmi'
            value={field.value}
            onChange={(url, file) => {
              field.onChange(url);
              onFileChange?.(file || null);
            }}
            onRemove={() => {
              field.onChange('');
              onFileChange?.(null);
            }}
            isInvalid={Boolean(error)}
            errorMessage={error?.message}
          />
        )}
      />

      <div className='flex justify-end pt-2'>
        <Button
          type='button'
          onClick={onNext}
          suppressHydrationWarning
          className='h-10 w-full md:w-auto md:min-w-48 rounded-md bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary text-xs font-semibold text-white shadow-sm disabled:opacity-50 transition-all cursor-pointer'
        >
          Lanjut ke Lokasi
        </Button>
      </div>
    </WizardStepCard>
  );
}
