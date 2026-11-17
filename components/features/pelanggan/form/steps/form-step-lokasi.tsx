import * as React from 'react';
import { MapPin } from 'lucide-react';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PelangganTextInput } from '../../inputs';
import { PelangganResponsiveMap } from '../../map';
import type { CreateCustomerInput } from '@/schemas/customer.schema';
import { WizardStepCard } from '../wizard-step-card';
import { useCurrentLocation } from './use-current-location';

interface FormStepLokasiProps {
  control: Control<CreateCustomerInput>;
  setValue: UseFormSetValue<CreateCustomerInput>;
  latitude: number;
  longitude: number;
  onNext: () => void;
}

export function FormStepLokasi({
  control,
  setValue,
  latitude,
  longitude,
  onNext,
}: FormStepLokasiProps) {
  const { isLocating, locate } = useCurrentLocation((coords) => {
    if (coords.latitude !== undefined) {
      setValue('latitude', coords.latitude, { shouldValidate: true, shouldDirty: true });
    }
    if (coords.longitude !== undefined) {
      setValue('longitude', coords.longitude, { shouldValidate: true, shouldDirty: true });
    }
  });

  const handleMapLocationChange = (lat: number, lng: number) => {
    setValue('latitude', Number(lat.toFixed(6)), { shouldValidate: true, shouldDirty: true });
    setValue('longitude', Number(lng.toFixed(6)), { shouldValidate: true, shouldDirty: true });
  };

  return (
    <WizardStepCard
      icon={<MapPin className='size-4' />}
      title='Titik Koordinat'
      badgeText='Wajib'
    >
      <div className='grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-start'>

        <div className='md:col-span-7 flex flex-col gap-2'>
          <PelangganResponsiveMap
            latitude={Number.isFinite(Number(latitude)) ? Number(latitude) : -6.208812}
            longitude={Number.isFinite(Number(longitude)) ? Number(longitude) : 106.845648}
            onLocationChange={handleMapLocationChange}
            mobile={{ interactive: true, height: '200px' }}
            desktop={{ interactive: true, height: '320px' }}
            badgeClassName='right-2.5 bottom-2.5 h-5 px-2.5 text-[10px]'
          />
          <p className='text-xs text-muted-foreground'>
            Klik atau geser marker pada peta untuk menentukan posisi outlet secara presisi.
          </p>
        </div>

        <div className='md:col-span-5 flex flex-col gap-4'>

          <div className='grid grid-cols-2 gap-3'>
            <Controller
              control={control}
              name='latitude'
              render={({ field, fieldState: { error } }) => (
                <PelangganTextInput
                  label='Latitude'
                  required
                  type='number'
                  step='any'
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  isInvalid={Boolean(error)}
                  errorMessage={error?.message}
                  placeholder='-6.208812'
                />
              )}
            />

            <Controller
              control={control}
              name='longitude'
              render={({ field, fieldState: { error } }) => (
                <PelangganTextInput
                  label='Longitude'
                  required
                  type='number'
                  step='any'
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  isInvalid={Boolean(error)}
                  errorMessage={error?.message}
                  placeholder='106.845648'
                />
              )}
            />
          </div>

          <Controller
            control={control}
            name='radius_kunjungan'
            render={({ field, fieldState: { error } }) => (
              <PelangganTextInput
                label='Radius Kunjungan (meter)'
                optionalText='(Opsional)'
                type='number'
                value={field.value ?? ''}
                onChange={field.onChange}
                isInvalid={Boolean(error)}
                errorMessage={error?.message}
                placeholder='200'
              />
            )}
          />

          <div className='flex flex-col gap-2.5 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={locate}
              disabled={isLocating}
              className='h-10 w-full rounded-md border-primary bg-primary/4 hover:bg-primary/10 text-xs font-medium text-primary cursor-pointer'
            >
              {isLocating
                ? 'Mendeteksi Lokasi...'
                : 'Ambil Titik Koordinat Saat Ini'}
            </Button>

            <Button
              type='button'
              onClick={onNext}
              className='h-10 w-full rounded-md bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary text-xs font-semibold text-white shadow-sm disabled:opacity-50 transition-all cursor-pointer'
            >
              Lanjut ke Kontak PIC
            </Button>
          </div>
        </div>
      </div>
    </WizardStepCard>
  );
}
