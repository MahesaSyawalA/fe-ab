'use client';

import * as React from 'react';
import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCurrentLocation } from '../form/steps/use-current-location';
import { useUpdatePelangganMutation } from '@/hooks/queries/use-pelanggan-query';
import { updateCustomerSchema, type UpdateCustomerInput } from '@/schemas/customer.schema';
import { getErrorMessage } from '@/lib/axios';
import { toast } from '@heroui/react';
import type { PelangganWithDetails } from '@/types/customer.types';

export interface UsePelangganEditFormProps {
  pelanggan: PelangganWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function usePelangganEditForm({
  pelanggan,
  open,
  onOpenChange,
}: UsePelangganEditFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const form = useForm<UpdateCustomerInput>({
    resolver: zodResolver(updateCustomerSchema) as Resolver<UpdateCustomerInput>,
    defaultValues: {
      nama_outlet: pelanggan.nama_outlet,
      tipe_outlet: pelanggan.tipe_outlet,
      alamat: pelanggan.alamat,
      latitude: pelanggan.latitude,
      longitude: pelanggan.longitude,
      radius_kunjungan: pelanggan.radius_kunjungan || 200,
      img_url: pelanggan.img_url || '',
    },
    mode: 'onTouched',
  });

  const [prevOpen, setPrevOpen] = React.useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      setSelectedFile(null);
    }
  }

  React.useEffect(() => {
    if (open) {
      form.reset({
        nama_outlet: pelanggan.nama_outlet,
        tipe_outlet: pelanggan.tipe_outlet,
        alamat: pelanggan.alamat,
        latitude: pelanggan.latitude,
        longitude: pelanggan.longitude,
        radius_kunjungan: pelanggan.radius_kunjungan || 200,
        img_url: pelanggan.img_url || '',
      });
    }
  }, [open, pelanggan, form]);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setServerError(null);
      setSelectedFile(null);
    }
    onOpenChange(newOpen);
  };

  const latitude = useWatch({ control: form.control, name: 'latitude' }) ?? pelanggan.latitude ?? 0;
  const longitude = useWatch({ control: form.control, name: 'longitude' }) ?? pelanggan.longitude ?? 0;

  const { isLocating, locate } = useCurrentLocation((coords) => {
    if (coords.latitude !== undefined) {
      form.setValue('latitude', coords.latitude, { shouldValidate: true, shouldDirty: true });
    }
    if (coords.longitude !== undefined) {
      form.setValue('longitude', coords.longitude, { shouldValidate: true, shouldDirty: true });
    }
  });

  const handleMapLocationChange = (lat: number, lng: number) => {
    form.setValue('latitude', Number(lat.toFixed(6)), { shouldValidate: true, shouldDirty: true });
    form.setValue('longitude', Number(lng.toFixed(6)), { shouldValidate: true, shouldDirty: true });
  };

  const updateMutation = useUpdatePelangganMutation(pelanggan.id_pelanggan);

  const onSubmit = async (values: UpdateCustomerInput) => {
    try {
      setServerError(null);
      await updateMutation.mutateAsync({
        ...values,
        file: selectedFile,
      });
      toast.success('Data pelanggan berhasil disimpan', {
        description: React.createElement(
          'span',
          { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
          'Perubahan data pelanggan berhasil diperbarui.',
        ),
      });
      onOpenChange(false);
    } catch (err) {
      const msg = getErrorMessage(err);
      setServerError(msg || 'Gagal memperbarui data pelanggan. Silakan coba lagi.');
      toast.danger('Gagal Memperbarui Pelanggan', {
        description: React.createElement(
          'span',
          { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
          msg || 'Terjadi kesalahan sistem.',
        ),
      });
    }
  };

  return {
    form,
    serverError,
    selectedFile,
    setSelectedFile,
    latitude,
    longitude,
    isLocating,
    locate,
    handleMapLocationChange,
    isPending: updateMutation.isPending,
    onSubmit: form.handleSubmit(onSubmit),
    handleOpenChange,
  };
}

export type PelangganEditFormState = ReturnType<typeof usePelangganEditForm>;

