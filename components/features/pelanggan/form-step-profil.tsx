import * as React from 'react';
import { Hospital } from 'lucide-react';
import { OptionCardGroup } from '@/components/ui/option-card';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SectionHeader } from '@/components/ui/section-header';
import { IconInputField } from '@/components/ui/icon-input-field';
import { Textarea } from '@/components/ui/textarea';
import { OUTLET_TYPES } from '@/constants/pelanggan-constants';

export interface FormStepProfilData {
  nama_faskes: string;
  tipe_faskes: string;
  alamat: string;
  img_url: string;
}

interface FormStepProfilProps {
  data: FormStepProfilData;
  onChange: (fields: Partial<FormStepProfilData>) => void;
  onNext: () => void;
}

export function FormStepProfil({ data, onChange, onNext }: FormStepProfilProps) {
  const isValid = Boolean(
    data.nama_faskes.trim() && data.tipe_faskes && data.alamat.trim()
  );

  return (
    <Card
      size='sm'
      className='w-full min-w-0 rounded-2xl border border-border ring-0 py-4 md:py-6 shadow-2xs bg-card'
    >
      <CardContent className='gap-5 px-4 md:px-6'>
        <SectionHeader
          icon={<Hospital className='size-4' />}
          title='Informasi Outlet'
          badgeText='Wajib'
        />

        {/* Nama Outlet */}
        <IconInputField
          label='Nama Outlet'
          required
          icon={<Hospital className='size-4' />}
          value={data.nama_faskes}
          onChange={(e) => onChange({ nama_faskes: e.target.value })}
          placeholder='Contoh: RS Ibu & Anak Kasih Bunda'
        />

        {/* Tipe Outlet */}
        <div className='flex flex-col gap-1.5'>
          <Label className='gap-0.5 text-xs font-medium text-foreground'>
            <span>Tipe Outlet</span>
            <span className='text-destructive'>*</span>
          </Label>
          <OptionCardGroup
            options={OUTLET_TYPES}
            value={data.tipe_faskes}
            onChange={(val) => onChange({ tipe_faskes: val })}
            className='grid grid-cols-1 sm:grid-cols-2 gap-3'
          />
        </div>

        {/* Alamat & Foto Outlet (2 columns on desktop) */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-start'>
          {/* Alamat Lengkap Outlet */}
          <div className='flex flex-col gap-1.5'>
            <Label className='gap-0.5 text-xs font-medium text-foreground'>
              <span>Alamat Lengkap Outlet</span>
              <span className='text-destructive'>*</span>
            </Label>
            <Textarea
              rows={5}
              value={data.alamat}
              onChange={(e) => onChange({ alamat: e.target.value })}
              placeholder='Contoh: Jl. Salemba Raya No. 42A, RT 03 / RW 05, Kenari, Senen, Jakarta Pusat 10430'
              className='min-h-[148px] resize-none rounded-xl border-border bg-card p-3 text-xs text-foreground placeholder:text-muted-foreground shadow-2xs'
              required
            />
          </div>

          {/* Foto Outlet */}
          <FileUpload
            label='Foto Outlet'
            helperText='Unggah 1 foto beresolusi jelas yang memperlihatkan identitas outlet resmi'
            value={data.img_url}
            onChange={(url) => onChange({ img_url: url })}
            onRemove={() => onChange({ img_url: '' })}
          />
        </div>

        {/* Submit Step 1 */}
        <div className='flex justify-end pt-2'>
          <Button
            type='button'
            onClick={onNext}
            disabled={!isValid}
            className='h-10 w-full md:w-auto md:min-w-48 rounded-xl bg-primary hover:bg-primary/90 text-xs font-medium text-primary-foreground shadow-xs disabled:opacity-50 cursor-pointer'
          >
            Lanjut ke Lokasi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
