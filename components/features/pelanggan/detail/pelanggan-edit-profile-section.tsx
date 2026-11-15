'use client';

import * as React from 'react';
import { Controller } from 'react-hook-form';
import { Hospital } from 'lucide-react';
import { Label } from '@heroui/react';
import { OptionCardGroup } from '@/components/ui/option-card';
import { OUTLET_TYPES } from '@/constants/pelanggan-constants';
import {
  PelangganTextInput,
  PelangganTextArea,
  PelangganFileInput,
} from '../inputs';
import type { PelangganEditFormState } from './use-pelanggan-edit-form';

interface PelangganEditProfileSectionProps {
  formState: PelangganEditFormState;
}

export function PelangganEditProfileSection({ formState }: PelangganEditProfileSectionProps) {
  const { form, setSelectedFile } = formState;

  return (
    <div className='flex flex-col gap-4'>
      <h4 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
        Profil Outlet
      </h4>

      <Controller
        control={form.control}
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
            placeholder='Contoh: RSUD / Klinik Medika'
          />
        )}
      />

      <Controller
        control={form.control}
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
              className='grid grid-cols-1 sm:grid-cols-2 gap-2.5'
            />
            {error && (
              <p className='text-xs text-danger font-medium mt-1'>{error.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        control={form.control}
        name='alamat'
        render={({ field, fieldState: { error } }) => (
          <PelangganTextArea
            label='Alamat Lengkap'
            required
            value={field.value}
            onChange={field.onChange}
            isInvalid={Boolean(error)}
            errorMessage={error?.message}
            placeholder='Masukkan alamat lengkap outlet...'
          />
        )}
      />

      <Controller
        control={form.control}
        name='img_url'
        render={({ field, fieldState: { error } }) => (
          <PelangganFileInput
            label='Foto Outlet'
            required={false}
            helperText='Unggah foto baru jika ingin mengganti foto outlet resmi'
            value={field.value}
            onChange={(url, file) => {
              field.onChange(url);
              setSelectedFile(file || null);
            }}
            onRemove={() => {
              field.onChange('');
              setSelectedFile(null);
            }}
            isInvalid={Boolean(error)}
            errorMessage={error?.message}
          />
        )}
      />
    </div>
  );
}

