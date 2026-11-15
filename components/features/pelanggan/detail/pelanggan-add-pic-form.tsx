'use client';

import * as React from 'react';
import { Controller, useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Briefcase, Loader2, Mail, Phone, Tag, User } from 'lucide-react';
import { TriangleExclamation } from '@gravity-ui/icons';
import { toast } from '@heroui/react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useAddPelangganContactMutation } from '@/hooks/queries';
import { getErrorMessage } from '@/lib/axios';
import { createContactSchema } from '@/schemas/contact.schema';
import { PelangganTextInput } from '../inputs';

type CreateContactFormValues = z.infer<typeof createContactSchema>;

export interface UsePelangganAddPicFormProps {
  idPelanggan: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function usePelangganAddPicForm({
  idPelanggan,
  open,
  onOpenChange,
}: UsePelangganAddPicFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const addContactMutation = useAddPelangganContactMutation(idPelanggan);

  const form = useForm<CreateContactFormValues>({
    resolver: zodResolver(createContactSchema) as Resolver<CreateContactFormValues>,
    defaultValues: {
      id_pelanggan: idPelanggan,
      nama: '',
      jabatan: '',
      no_telp: '',
      email: '',
      kategori_peran: '',
    },
    mode: 'onTouched',
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        id_pelanggan: idPelanggan,
        nama: '',
        jabatan: '',
        no_telp: '',
        email: '',
        kategori_peran: '',
      });
    }
  }, [open, idPelanggan, form]);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setServerError(null);
    }
    onOpenChange(newOpen);
  };

  const onSubmit = async (values: CreateContactFormValues) => {
    try {
      setServerError(null);
      await addContactMutation.mutateAsync({
        nama: values.nama.trim(),
        jabatan: values.jabatan.trim(),
        no_telp: values.no_telp.trim(),
        email: values.email.trim(),
        kategori_peran: values.kategori_peran?.trim() || undefined,
      });

      toast.success('Kontak PIC berhasil ditambahkan', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            Kontak <strong>{values.nama.trim()}</strong> telah ditambahkan ke daftar PIC.
          </span>
        ),
      });
      onOpenChange(false);
    } catch (err) {
      const msg = getErrorMessage(err);
      setServerError(msg || 'Gagal menambahkan kontak PIC. Silakan coba lagi.');
      toast.danger('Gagal Menambahkan Kontak', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            {msg || 'Terjadi kesalahan sistem.'}
          </span>
        ),
      });
    }
  };

  return {
    form,
    serverError,
    isPending: addContactMutation.isPending,
    onSubmit: form.handleSubmit(onSubmit),
    handleOpenChange,
  };
}

export type PelangganAddPicFormState = ReturnType<typeof usePelangganAddPicForm>;

export function PelangganAddPicFields({ formState }: { formState: PelangganAddPicFormState }) {
  const { form, serverError } = formState;

  return (
    <div className='flex flex-col gap-4 pt-1'>
      {serverError && (
        <div className='flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-destructive'>
          <TriangleExclamation className='size-4 shrink-0 mt-0.5' />
          <p className='text-xs font-medium leading-relaxed'>{serverError}</p>
        </div>
      )}

      <Controller
        control={form.control}
        name='nama'
        render={({ field, fieldState: { error } }) => (
          <PelangganTextInput
            label='Nama PIC'
            required
            icon={<User className='size-4' />}
            value={field.value}
            onChange={field.onChange}
            isInvalid={Boolean(error)}
            errorMessage={error?.message}
            placeholder='Masukkan nama lengkap PIC'
          />
        )}
      />

      <Controller
        control={form.control}
        name='jabatan'
        render={({ field, fieldState: { error } }) => (
          <PelangganTextInput
            label='Jabatan'
            required
            icon={<Briefcase className='size-4' />}
            value={field.value}
            onChange={field.onChange}
            isInvalid={Boolean(error)}
            errorMessage={error?.message}
            placeholder='Contoh: Kepala Instalasi Farmasi'
          />
        )}
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
        <Controller
          control={form.control}
          name='no_telp'
          render={({ field, fieldState: { error } }) => (
            <PelangganTextInput
              label='No. Telepon'
              required
              type='tel'
              icon={<Phone className='size-4' />}
              value={field.value}
              onChange={(val) => {
                let sanitized = val.replace(/[^\d\s\-+]/g, '');
                if (sanitized.includes('+')) {
                  sanitized =
                    (sanitized.startsWith('+') ? '+' : '') + sanitized.replace(/\+/g, '');
                }
                field.onChange(sanitized);
              }}
              isInvalid={Boolean(error)}
              errorMessage={error?.message}
              placeholder='+62 8xx-xxxx-xxxx'
            />
          )}
        />

        <Controller
          control={form.control}
          name='email'
          render={({ field, fieldState: { error } }) => (
            <PelangganTextInput
              label='Email'
              required
              type='email'
              icon={<Mail className='size-4' />}
              value={field.value}
              onChange={field.onChange}
              isInvalid={Boolean(error)}
              errorMessage={error?.message}
              placeholder='pic@instansi.co.id'
            />
          )}
        />
      </div>

      <Controller
        control={form.control}
        name='kategori_peran'
        render={({ field, fieldState: { error } }) => (
          <PelangganTextInput
            label='Kategori Peran'
            icon={<Tag className='size-4' />}
            value={field.value ?? ''}
            onChange={field.onChange}
            isInvalid={Boolean(error)}
            errorMessage={error?.message}
            placeholder='Contoh: Pengambil Keputusan (Opsional)'
          />
        )}
      />
    </div>
  );
}

export function PelangganAddPicFooterActions({
  onCancel,
  isPending,
}: {
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className='grid grid-cols-2 gap-3 w-full sm:flex sm:w-auto sm:justify-end sm:items-center sm:gap-2.5'>
      <Button
        type='button'
        variant='outline'
        onClick={onCancel}
        disabled={isPending}
        className='h-10 sm:h-9 w-full sm:w-28 rounded-md text-xs font-semibold cursor-pointer border-border bg-card shadow-none hover:bg-muted/50'
      >
        Batal
      </Button>
      <Button
        type='submit'
        disabled={isPending}
        className='h-10 sm:h-9 w-full sm:w-auto sm:min-w-[140px] sm:px-5 rounded-md text-xs font-semibold text-white shadow-sm bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary transition-all cursor-pointer disabled:opacity-60'
      >
        {isPending && <Loader2 className='mr-1.5 size-3.5 animate-spin' />}
        <span>{isPending ? 'Menyimpan...' : 'Simpan PIC'}</span>
      </Button>
    </div>
  );
}
