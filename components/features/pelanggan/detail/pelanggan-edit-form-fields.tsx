'use client';

import * as React from 'react';
import { Controller } from 'react-hook-form';
import { Hospital, MapPin, Navigation, Loader2 } from 'lucide-react';
import { TriangleExclamation } from '@gravity-ui/icons';
import { Label } from '@heroui/react';
import { Button } from '@/components/ui/button';
import { OptionCardGroup } from '@/components/ui/option-card';
import { OUTLET_TYPES } from '@/constants/pelanggan-constants';
import {
  PelangganTextInput,
  PelangganTextArea,
  PelangganFileInput,
} from '../inputs';
import { PelangganResponsiveMap } from '../map';
import type { PelangganEditFormState } from './use-pelanggan-edit-form';

interface PelangganEditFormFieldsProps {
  formState: PelangganEditFormState;
}

export function PelangganEditFormFields({ formState }: PelangganEditFormFieldsProps) {
  const {
    form,
    serverError,
    latitude,
    longitude,
    isLocating,
    locate,
    handleMapLocationChange,
  } = formState;

  return (
    <div className='flex flex-col gap-5 pt-1'>
      {serverError && (
        <div className='flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-destructive'>
          <TriangleExclamation className='size-4 shrink-0 mt-0.5' />
          <p className='text-xs font-medium leading-relaxed'>{serverError}</p>
        </div>
      )}

      {/* Section 1: Profil Outlet */}
      <div className='flex flex-col gap-4'>
        <h4 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
          Profil Outlet
        </h4>

        {/* Nama Outlet */}
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
              placeholder='Contoh: RS Ibu & Anak Kasih Bunda'
            />
          )}
        />

        {/* Tipe Outlet */}
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

        {/* Alamat */}
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
              placeholder='Masukkan nama jalan, nomor, kecamatan, kota...'
            />
          )}
        />

        {/* Foto Outlet */}
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
                formState.setSelectedFile(file || null);
              }}
              onRemove={() => {
                field.onChange('');
                formState.setSelectedFile(null);
              }}
              isInvalid={Boolean(error)}
              errorMessage={error?.message}
            />
          )}
        />
      </div>

      {/* Section 2: Titik Koordinat & Geofence */}
      <div className='flex flex-col gap-4 border-t border-border pt-4'>
        <div className='flex items-center justify-between'>
          <h4 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            Titik Koordinat & Radius
          </h4>
          <Button
            type='button'
            variant='outline'
            size='xs'
            onClick={locate}
            disabled={isLocating}
            className='gap-1 rounded-lg text-[11px] font-medium cursor-pointer'
          >
            {isLocating ? (
              <Loader2 className='size-3 animate-spin' />
            ) : (
              <Navigation className='size-3' />
            )}
            <span>{isLocating ? 'Mencari...' : 'GPS Saat Ini'}</span>
          </Button>
        </div>

        <div className='flex flex-col gap-2'>
          <PelangganResponsiveMap
            latitude={Number(latitude) || 0}
            longitude={Number(longitude) || 0}
            onLocationChange={handleMapLocationChange}
            mobile={{ interactive: true, height: '180px' }}
            desktop={{ interactive: true, height: '220px' }}
            badgeClassName='right-2.5 bottom-2.5 h-5 px-2 text-[10px]'
          />
          <p className='text-[11px] text-muted-foreground'>
            Klik atau geser penanda untuk menyesuaikan koordinat GPS outlet.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <Controller
            control={form.control}
            name='latitude'
            render={({ field, fieldState: { error } }) => (
              <PelangganTextInput
                label='Latitude'
                required
                type='number'
                step='any'
                icon={<MapPin className='size-4' />}
                value={field.value ?? ''}
                onChange={field.onChange}
                isInvalid={Boolean(error)}
                errorMessage={error?.message}
                placeholder='-6.2088'
              />
            )}
          />

          <Controller
            control={form.control}
            name='longitude'
            render={({ field, fieldState: { error } }) => (
              <PelangganTextInput
                label='Longitude'
                required
                type='number'
                step='any'
                icon={<MapPin className='size-4' />}
                value={field.value ?? ''}
                onChange={field.onChange}
                isInvalid={Boolean(error)}
                errorMessage={error?.message}
                placeholder='106.8456'
              />
            )}
          />
        </div>

        <Controller
          control={form.control}
          name='radius_kunjungan'
          render={({ field, fieldState: { error } }) => (
            <PelangganTextInput
              label='Radius Kunjungan (meter)'
              required
              type='number'
              min={50}
              max={5000}
              value={field.value ?? 200}
              onChange={field.onChange}
              isInvalid={Boolean(error)}
              errorMessage={error?.message}
              placeholder='200'
            />
          )}
        />
      </div>
    </div>
  );
}

interface PelangganEditFooterActionsProps {
  onCancel: () => void;
  isPending: boolean;
}

export function PelangganEditFooterActions({
  onCancel,
  isPending,
}: PelangganEditFooterActionsProps) {
  return (
    <div className='grid grid-cols-2 gap-3 w-full sm:flex sm:w-auto sm:justify-end sm:items-center sm:gap-2.5'>
      <Button
        type='button'
        variant='outline'
        onClick={onCancel}
        disabled={isPending}
        className='h-10 sm:h-9 w-full sm:w-28 rounded-lg text-xs font-semibold cursor-pointer border-border bg-card shadow-none hover:bg-muted/50'
      >
        Batal
      </Button>
      <Button
        type='submit'
        disabled={isPending}
        className='h-10 sm:h-9 w-full sm:w-auto sm:min-w-[140px] sm:px-5 rounded-lg text-xs font-semibold text-white shadow-sm bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary transition-all cursor-pointer disabled:opacity-60'
      >
        {isPending && <Loader2 className='mr-1.5 size-3.5 animate-spin' />}
        <span>{isPending ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
      </Button>
    </div>
  );
}

