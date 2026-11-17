'use client';

import * as React from 'react';
import { Controller } from 'react-hook-form';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PelangganTextInput } from '../inputs';
import { PelangganResponsiveMap } from '../map';
import type { PelangganEditFormState } from './use-pelanggan-edit-form';

interface PelangganEditLocationSectionProps {
  formState: PelangganEditFormState;
}

export function PelangganEditLocationSection({ formState }: PelangganEditLocationSectionProps) {
  const {
    form,
    latitude,
    longitude,
    isLocating,
    locate,
    handleMapLocationChange,
  } = formState;

  return (
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
          latitude={Number.isFinite(Number(latitude)) ? Number(latitude) : 0}
          longitude={Number.isFinite(Number(longitude)) ? Number(longitude) : 0}
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
            value={field.value ?? ''}
            onChange={field.onChange}
            isInvalid={Boolean(error)}
            errorMessage={error?.message}
            placeholder='200'
          />
        )}
      />
    </div>
  );
}

