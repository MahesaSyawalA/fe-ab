import * as React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconInputField } from '@/components/ui/icon-input-field';
import { PelangganResponsiveMap } from '../../map';
import { FormStepLokasiData } from '../types';
import { WizardStepCard } from '../wizard-step-card';
import { useCurrentLocation } from './use-current-location';

interface FormStepLokasiProps {
  data: FormStepLokasiData;
  onChange: (fields: Partial<FormStepLokasiData>) => void;
  onNext: () => void;
}

export function FormStepLokasi({ data, onChange, onNext }: FormStepLokasiProps) {
  const { isLocating, locate } = useCurrentLocation(onChange);

  const handleMapLocationChange = (lat: number, lng: number) => {
    onChange({
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
    });
  };

  return (
    <WizardStepCard
      icon={<MapPin className='size-4' />}
      title='Titik Koordinat'
      badgeText='Wajib'
    >
      <div className='grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-start'>
        {/* Left Column on Desktop: Map (7 cols) */}
        <div className='md:col-span-7 flex flex-col gap-2'>
          <PelangganResponsiveMap
            latitude={data.latitude}
            longitude={data.longitude}
            onLocationChange={handleMapLocationChange}
            mobile={{ interactive: true, height: '200px' }}
            desktop={{ interactive: true, height: '320px' }}
            badgeClassName='right-2.5 bottom-2.5 h-5 px-2.5 text-[10px]'
          />
          <p className='text-[11px] text-muted-foreground'>
            Klik atau geser marker pada peta untuk menentukan posisi faskes secara presisi.
          </p>
        </div>

        {/* Right Column on Desktop: Coordinates & Inputs (5 cols) */}
        <div className='md:col-span-5 flex flex-col gap-4'>
          {/* Latitude & Longitude */}
          <div className='grid grid-cols-2 gap-3'>
            <IconInputField
              label='Latitude'
              required
              type='number'
              step='any'
              value={data.latitude}
              onChange={(e) =>
                onChange({ latitude: parseFloat(e.target.value) || 0 })
              }
              placeholder='-6.208812'
            />

            <IconInputField
              label='Longitude'
              required
              type='number'
              step='any'
              value={data.longitude}
              onChange={(e) =>
                onChange({ longitude: parseFloat(e.target.value) || 0 })
              }
              placeholder='106.845648'
            />
          </div>

          {/* Radius Kunjungan */}
          <IconInputField
            label='Radius Kunjungan'
            optionalText='(optional)'
            type='text'
            value={data.radius_kunjungan ? `${data.radius_kunjungan} m` : ''}
            onChange={(e) => {
              const numeric = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
              onChange({ radius_kunjungan: isNaN(numeric) ? 0 : numeric });
            }}
            placeholder='200 m'
          />

          {/* Action Buttons inside card */}
          <div className='flex flex-col gap-2.5 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={locate}
              disabled={isLocating}
              className='h-10 w-full rounded-xl border-primary bg-primary/4 hover:bg-primary/10 text-xs font-medium text-primary cursor-pointer'
            >
              {isLocating
                ? 'Mendeteksi Lokasi...'
                : 'Ambil Titik Koordinat Saat Ini'}
            </Button>

            <Button
              type='button'
              onClick={onNext}
              className='h-10 w-full rounded-xl bg-primary hover:bg-primary/90 text-xs font-medium text-primary-foreground shadow-xs cursor-pointer'
            >
              Lanjut ke Kontak PIC
            </Button>
          </div>
        </div>
      </div>
    </WizardStepCard>
  );
}
