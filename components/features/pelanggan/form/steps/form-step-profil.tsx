import * as React from 'react';
import { Hospital } from 'lucide-react';
import { Label } from '@heroui/react';
import { OptionCardGroup } from '@/components/ui/option-card';
import { Button } from '@/components/ui/button';
import { PelangganTextInput, PelangganTextArea, PelangganFileInput } from '../../inputs';
import { OUTLET_TYPES } from '@/constants/pelanggan-constants';
import { FormStepProfilData } from '../types';
import { WizardStepCard } from '../wizard-step-card';

interface FormStepProfilProps {
  data: FormStepProfilData;
  onChange: (fields: Partial<FormStepProfilData>) => void;
  onNext: () => void;
}

export function FormStepProfil({ data, onChange, onNext }: FormStepProfilProps) {
  const isValid = Boolean(
    data.nama_outlet.trim() &&
    data.tipe_outlet &&
    data.alamat.trim() &&
    data.img_url.trim()
  );

  return (
    <WizardStepCard
      icon={<Hospital className='size-4' />}
      title='Informasi Outlet'
      badgeText='Wajib'
    >
      {/* Nama Outlet */}
      <PelangganTextInput
        label='Nama Outlet'
        required
        icon={<Hospital className='size-4' />}
        value={data.nama_outlet}
        onChange={(val) => onChange({ nama_outlet: val })}
        placeholder='Contoh: RS Ibu & Anak Kasih Bunda'
      />

      {/* Tipe Outlet */}
      <div className='flex flex-col gap-1.5'>
        <Label isRequired className='text-sm font-medium text-foreground'>
          Tipe Outlet
        </Label>
        <OptionCardGroup
          options={OUTLET_TYPES}
          value={data.tipe_outlet}
          onChange={(val) => onChange({ tipe_outlet: val })}
          className='grid grid-cols-1 sm:grid-cols-2 gap-3'
        />
      </div>

      {/* Alamat Lengkap Outlet (Full Width) */}
      <PelangganTextArea
        label='Alamat Lengkap Outlet'
        required
        rows={4}
        value={data.alamat}
        onChange={(val) => onChange({ alamat: val })}
        placeholder='Contoh: Jl. Salemba Raya No. 42A, RT 03 / RW 05, Kenari, Senen, Jakarta Pusat 10430'
      />

      {/* Foto Outlet (Full Width below Alamat) */}
      <PelangganFileInput
        label='Foto Outlet'
        isRequired
        helperText='Unggah 1 foto beresolusi jelas yang memperlihatkan identitas outlet resmi'
        value={data.img_url}
        onChange={(url) => onChange({ img_url: url })}
        onRemove={() => onChange({ img_url: '' })}
      />

      {/* Submit Step 1 */}
      <div className='flex justify-end pt-2'>
        <Button
          type='button'
          onClick={onNext}
          disabled={!isValid}
          suppressHydrationWarning
          className='h-10 w-full md:w-auto md:min-w-48 rounded-md bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary text-xs font-semibold text-white shadow-sm disabled:opacity-50 transition-all cursor-pointer'
        >
          Lanjut ke Lokasi
        </Button>
      </div>
    </WizardStepCard>
  );
}
