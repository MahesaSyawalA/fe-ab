import * as React from 'react';
import { MapPin } from 'lucide-react';
import { PelangganMap } from './pelanggan-map';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { IconInputField } from '@/components/ui/icon-input-field';

export interface FormStepLokasiData {
  latitude: number;
  longitude: number;
  radius_kunjungan: number;
}

interface FormStepLokasiProps {
  data: FormStepLokasiData;
  onChange: (fields: Partial<FormStepLokasiData>) => void;
  onNext: () => void;
}

export function FormStepLokasi({ data, onChange, onNext }: FormStepLokasiProps) {
  const [isLocating, setIsLocating] = React.useState(false);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onChange({
            latitude: Number(pos.coords.latitude.toFixed(6)),
            longitude: Number(pos.coords.longitude.toFixed(6)),
          });
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  const handleMapLocationChange = (lat: number, lng: number) => {
    onChange({
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
    });
  };

  return (
    <Card
      size='sm'
      className='w-full min-w-0 rounded-2xl border border-border ring-0 py-4 md:py-6 shadow-2xs bg-card'
    >
      <CardContent className='gap-5 px-4 md:px-6'>
        <SectionHeader
          icon={<MapPin className='size-4' />}
          title='Titik Koordinat'
          badgeText='Wajib'
        />

        <div className='grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-start'>
          {/* Left Column on Desktop: Map (7 cols) */}
          <div className='md:col-span-7 flex flex-col gap-2'>
            <div className='relative w-full overflow-hidden rounded-xl border border-border/80'>
              <div className='block md:hidden'>
                <PelangganMap
                  latitude={data.latitude}
                  longitude={data.longitude}
                  interactive={true}
                  onLocationChange={handleMapLocationChange}
                  height='200px'
                />
              </div>
              <div className='hidden md:block'>
                <PelangganMap
                  latitude={data.latitude}
                  longitude={data.longitude}
                  interactive={true}
                  onLocationChange={handleMapLocationChange}
                  height='320px'
                />
              </div>
              <Badge className='absolute right-2.5 bottom-2.5 z-10 h-5 rounded-md bg-kanban-green px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-xs'>
                GPS Siap
              </Badge>
            </div>
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
                onClick={handleGetCurrentLocation}
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
      </CardContent>
    </Card>
  );
}
