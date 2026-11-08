'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createTicketSchema,
  updateTicketSchema,
  type CreateTicketFormValues,
} from '@/schemas/ticket.schema';
import { usePelangganListQuery } from '@/hooks/queries/use-pelanggan-query';
import {
  useCreateTicketMutation,
  useUpdateTicketMutation,
} from '@/hooks/queries/use-kanban-query';
import { toast } from '@heroui/react';
import { getErrorMessage } from '@/lib/axios';
import { TiketWithDetails } from '@/types/ticket.types';

export interface UseProspekFormProps {
  mode: 'create' | 'edit';
  basePath: string;
  initialStageId?: string;
  ticket?: TiketWithDetails;
  onSuccess?: () => void;
}

export function useProspekForm({
  mode,
  basePath,
  initialStageId = 'visit',
  ticket,
  onSuccess,
}: UseProspekFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [serverError, setServerError] = React.useState<string | null>(null);

  // 1. Fetch real customer list via TanStack Query
  const { data: pelangganResponse, isLoading: isLoadingPelanggan } =
    usePelangganListQuery({
      limit: 100,
    });

  const pelangganList = React.useMemo(() => {
    return pelangganResponse?.data ?? [];
  }, [pelangganResponse]);

  // 2. TanStack Query Mutations
  const createMutation = useCreateTicketMutation();
  const updateMutation = useUpdateTicketMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const [defaultClosingDate] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  });

  // 3. Setup React Hook Form with Zod Resolver
  const form = useForm<CreateTicketFormValues>({
    resolver: zodResolver(
      mode === 'create' ? createTicketSchema : updateTicketSchema,
    ) as Resolver<CreateTicketFormValues>,
    defaultValues: {
      judul: ticket?.judul ?? '',
      id_pelanggan: ticket?.id_pelanggan ?? '',
      id_kontak: ticket?.id_kontak ?? null,
      id_tahap: ticket?.id_tahap ?? initialStageId,
      id_user: ticket?.id_user ?? session?.user?.id_user ?? '',
      estimasi_nilai: ticket?.estimasi_nilai ?? 50_000_000,
      estimasi_closing: ticket?.estimasi_closing
        ? typeof ticket.estimasi_closing === 'string'
          ? ticket.estimasi_closing.slice(0, 10)
          : new Date(ticket.estimasi_closing).toISOString().slice(0, 10)
        : defaultClosingDate,
      status: ticket?.status ?? 'open',
      prioritas: ticket?.prioritas ?? 'sedang',
      kebutuhan_pelanggan: ticket?.kebutuhan_pelanggan ?? '',
      posisi: ticket?.posisi ?? 1,
    },
    mode: 'onTouched',
  });

  // Re-sync default values when ticket changes (e.g. after fetch)
  React.useEffect(() => {
    if (ticket) {
      form.reset({
        judul: ticket.judul,
        id_pelanggan: ticket.id_pelanggan,
        id_kontak: ticket.id_kontak ?? null,
        id_tahap: ticket.id_tahap,
        id_user: ticket.id_user,
        estimasi_nilai: ticket.estimasi_nilai,
        estimasi_closing:
          typeof ticket.estimasi_closing === 'string'
            ? ticket.estimasi_closing.slice(0, 10)
            : new Date(ticket.estimasi_closing).toISOString().slice(0, 10),
        status: ticket.status,
        prioritas: ticket.prioritas,
        kebutuhan_pelanggan: ticket.kebutuhan_pelanggan ?? '',
        posisi: ticket.posisi ?? 1,
      });
    }
  }, [ticket, form]);

  // Derived options for dropdowns
  const selectedPelangganId = useWatch({
    control: form.control,
    name: 'id_pelanggan',
  });

  const selectedOutlet = React.useMemo(
    () => pelangganList.find((p) => p.id_pelanggan === selectedPelangganId),
    [pelangganList, selectedPelangganId],
  );

  const outletOptions = React.useMemo(() => {
    return pelangganList.map((p) => ({
      value: p.id_pelanggan,
      label: p.nama_outlet,
    }));
  }, [pelangganList]);

  const kontakOptions = React.useMemo(() => {
    return (selectedOutlet?.kontak_list ?? []).map((k) => ({
      value: k.id_kontak,
      label: `${k.nama}${k.jabatan ? ` (${k.jabatan})` : ''}`,
    }));
  }, [selectedOutlet]);

  const backPath =
    mode === 'edit' && ticket ? `${basePath}/${ticket.id_tiket}` : basePath;

  // Submit Handler
  const onSubmit = async (values: CreateTicketFormValues) => {
    try {
      setServerError(null);
      const userId = session?.user?.id_user || values.id_user || 'usr-1';

      if (mode === 'edit' && ticket) {
        await updateMutation.mutateAsync({
          id: ticket.id_tiket,
          payload: {
            ...values,
            id_user: userId,
            judul: values.judul.trim(),
            estimasi_nilai: Number(values.estimasi_nilai),
            kebutuhan_pelanggan: values.kebutuhan_pelanggan?.trim() || '',
          },
        });

        toast.success('Prospek Berhasil Diperbarui', {
          description: `Perubahan data prospek ${values.judul} berhasil disimpan.`,
        });
        onSuccess?.();
      } else {
        const createdRes = await createMutation.mutateAsync({
          id_pelanggan: values.id_pelanggan,
          id_user: userId,
          id_tahap: values.id_tahap || initialStageId,
          id_kontak: values.id_kontak || null,
          judul: values.judul.trim(),
          estimasi_nilai: Number(values.estimasi_nilai),
          estimasi_closing: values.estimasi_closing,
          status: values.status || 'open',
          kebutuhan_pelanggan:
            values.kebutuhan_pelanggan?.trim() || values.judul.trim(),
          prioritas: values.prioritas || 'sedang',
          posisi: 1,
        });

        toast.success('Tiket prospek berhasil dibuat', {
          description: `Prospek ${values.judul} berhasil didaftarkan ke pipa penjualan.`,
        });
        onSuccess?.();
        const newTicketId = createdRes.data?.id_tiket;
        if (newTicketId) {
          router.push(`${basePath}/${newTicketId}`);
        } else {
          router.push(basePath);
        }
      }
    } catch (err) {
      const msg = getErrorMessage(err);
      setServerError(
        msg || 'Gagal menyimpan prospek. Silakan periksa kembali formulir.',
      );
      toast.danger('Gagal Menyimpan Prospek', {
        description: msg || 'Terjadi kesalahan pada server.',
      });
    }
  };

  return {
    form,
    pelangganList,
    outletOptions,
    kontakOptions,
    isLoadingPelanggan,
    isPending,
    serverError,
    setServerError,
    backPath,
    ticket,
    onSubmit: form.handleSubmit(onSubmit),
  };
}

export type ProspekFormState = ReturnType<typeof useProspekForm>;
