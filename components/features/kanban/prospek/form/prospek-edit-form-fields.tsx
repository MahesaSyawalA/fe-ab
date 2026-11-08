'use client';

import * as React from 'react';
import { Controller } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ProspekCurrencyInput,
  ProspekDatePicker,
  ProspekSelectInput,
  ProspekTextFieldInput,
} from '../inputs';
import { ProspekFieldPrioritas } from './prospek-field-prioritas';
import type { ProspekFormState } from './use-prospek-form';
import { TiketPrioritas } from '@/types/ticket.types';

export interface ProspekEditFormFieldsProps {
  formState: ProspekFormState;
  showKodeTiket?: boolean;
}

export function ProspekEditFormFields({
  formState,
  showKodeTiket = true,
}: ProspekEditFormFieldsProps) {
  const { form, outletOptions, kontakOptions, ticket, serverError } = formState;

  return (
    <div className='flex flex-col gap-4'>
      {/* Server Error Alert */}
      {serverError && (
        <div className='rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800'>
          <p className='font-semibold'>Gagal menyimpan perubahan</p>
          <p className='text-[11px] text-rose-700 mt-0.5'>{serverError}</p>
        </div>
      )}

      {/* ID / Kode Tiket (Readonly) */}
      {showKodeTiket && ticket?.kode_tiket && (
        <ProspekTextFieldInput
          label='ID Tiket'
          value={ticket.kode_tiket}
          disabled
          inputClassName='bg-muted/50 cursor-default font-mono'
        />
      )}

      {/* Judul Prospek */}
      <Controller
        name='judul'
        control={form.control}
        render={({ field, fieldState }) => (
          <ProspekTextFieldInput
            label='Judul Prospek'
            isRequired
            placeholder='cth. Pengadaan USG Doppler 4D'
            value={field.value}
            onChange={field.onChange}
            isInvalid={Boolean(fieldState.error)}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      {/* Pelanggan / Outlet */}
      <Controller
        name='id_pelanggan'
        control={form.control}
        render={({ field, fieldState }) => (
          <ProspekSelectInput
            label='Pelanggan / Outlet'
            isRequired
            placeholder='Pilih Pelanggan...'
            options={outletOptions}
            value={field.value}
            onChange={(val) => {
              field.onChange(val);
              // Reset kontak when outlet changes
              form.setValue('id_kontak', null, { shouldValidate: true });
            }}
            isInvalid={Boolean(fieldState.error)}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      {/* Kontak PIC */}
      <Controller
        name='id_kontak'
        control={form.control}
        render={({ field, fieldState }) => (
          <ProspekSelectInput
            label='Kontak PIC'
            placeholder={
              kontakOptions.length === 0
                ? 'Belum ada kontak terdaftar'
                : 'Pilih PIC...'
            }
            options={kontakOptions}
            value={field.value || ''}
            onChange={(val) => field.onChange(val || null)}
            isInvalid={Boolean(fieldState.error)}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      {/* Estimasi Nilai Penawaran */}
      <Controller
        name='estimasi_nilai'
        control={form.control}
        render={({ field, fieldState }) => (
          <ProspekCurrencyInput
            label='Estimasi Nilai Penawaran'
            isRequired
            value={field.value}
            onChange={(rawStr) => {
              const numeric = Number(rawStr.replace(/\D/g, '')) || 0;
              field.onChange(numeric);
            }}
            isInvalid={Boolean(fieldState.error)}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      {/* Target Estimasi Closing */}
      <Controller
        name='estimasi_closing'
        control={form.control}
        render={({ field, fieldState }) => {
          const stringDate =
            typeof field.value === 'string'
              ? field.value
              : field.value
                ? new Date(field.value).toISOString().slice(0, 10)
                : '';
          return (
            <ProspekDatePicker
              label='Target Estimasi Closing'
              isRequired
              value={stringDate}
              onChange={field.onChange}
              isInvalid={Boolean(fieldState.error)}
              errorMessage={fieldState.error?.message}
            />
          );
        }}
      />

      {/* Tingkat Prioritas Prospek */}
      <Controller
        name='prioritas'
        control={form.control}
        render={({ field }) => (
          <ProspekFieldPrioritas
            value={(field.value as TiketPrioritas) || 'sedang'}
            onChange={field.onChange}
          />
        )}
      />

      {/* Kebutuhan Pelanggan */}
      <Controller
        name='kebutuhan_pelanggan'
        control={form.control}
        render={({ field, fieldState }) => (
          <ProspekTextFieldInput
            label='Kebutuhan & Spesifikasi Pelanggan'
            placeholder='Catatan spesifikasi alat, observasi ruangan, dsb...'
            value={field.value || ''}
            onChange={field.onChange}
            isInvalid={Boolean(fieldState.error)}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
    </div>
  );
}

export interface ProspekEditFooterActionsProps {
  onCancel: () => void;
  isPending?: boolean;
}

export function ProspekEditFooterActions({
  onCancel,
  isPending,
}: ProspekEditFooterActionsProps) {
  return (
    <div className='flex items-center justify-end gap-2 w-full'>
      <Button
        type='button'
        variant='outline'
        onClick={onCancel}
        disabled={isPending}
        className='h-8.5 shrink-0 rounded-[8px] px-4 text-xs font-semibold cursor-pointer'
      >
        Batal
      </Button>
      <Button
        type='submit'
        disabled={isPending}
        className='h-8.5 flex-1 sm:flex-none rounded-[8px] px-5 text-xs font-semibold text-white shadow-sm bg-primary-default hover:bg-primary-hover active:bg-primary transition-all cursor-pointer disabled:opacity-60'
      >
        {isPending ? (
          <span className='flex items-center gap-1.5'>
            <Loader2 className='size-3.5 animate-spin' />
            <span>Menyimpan Perubahan...</span>
          </span>
        ) : (
          <span>Simpan Perubahan</span>
        )}
      </Button>
    </div>
  );
}

