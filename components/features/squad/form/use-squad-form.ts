import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import {
  useCreateSquadMutation,
  useDeleteSquadMutation,
  useUpdateSquadMutation,
  useUserListQuery,
} from '@/hooks/queries';
import { getErrorMessage } from '@/lib/axios';
import { toast } from '@heroui/react';
import { SQUAD_FORM_DEFAULTS } from '@/constants/squad-constants';
import { squadFormSchema, type SquadFormValues } from '@/schemas/squad.schema';
import type { CreateSquadInput, SquadMember, SquadWithDetails } from '@/types/squad.types';

interface UseSquadFormOptions {
  basePath: string;
  /** Diisi saat mode edit. */
  squad?: SquadWithDetails;
}

const toFormValues = (squad: SquadWithDetails): SquadFormValues => ({
  nama_squad: squad.nama_squad,
  id_supervisor: squad.id_supervisor ?? '',
  kode_squad: squad.kode_squad,
  wilayah: squad.wilayah,
  is_active: squad.is_active,
  member_ids: squad.members.map((m) => m.id_user),
});

export function useSquadForm({ basePath, squad }: UseSquadFormOptions) {
  const router = useRouter();
  const { data: session } = useSession();
  const isEdit = Boolean(squad);

  const form = useForm<SquadFormValues>({
    resolver: zodResolver(squadFormSchema),
    defaultValues: squad ? toFormValues(squad) : SQUAD_FORM_DEFAULTS,
  });

  const createMutation = useCreateSquadMutation();
  const updateMutation = useUpdateSquadMutation(squad?.id_squad ?? '');
  const deleteMutation = useDeleteSquadMutation();
  const users = useUserListQuery().data?.data;

  const [dialog, setDialog] = React.useState<'cancel' | 'delete' | 'picker' | null>(null);
  const closeDialog = (open: boolean) => !open && setDialog(null);

  // Manager membuat squad untuk dirinya sendiri secara default.
  const managerId = session?.user.role === 'sales_manager' ? session.user.id_user : null;
  React.useEffect(() => {
    if (!isEdit && managerId && !form.getValues('id_supervisor')) {
      form.setValue('id_supervisor', managerId);
    }
  }, [isEdit, managerId, form]);

  const supervisors = React.useMemo(
    () => (users ?? []).filter((u) => u.role === 'sales_manager'),
    [users],
  );
  const salesCandidates = React.useMemo(
    () => (users ?? []).filter((u) => u.role === 'sales'),
    [users],
  );

  const memberIds = useWatch({ control: form.control, name: 'member_ids' });
  const members: SquadMember[] = React.useMemo(() => {
    const byId = new Map<string, SquadMember>(
      [...(squad?.members ?? []), ...(users ?? [])].map((u) => [u.id_user, u]),
    );
    return memberIds.flatMap((id) => byId.get(id) ?? []);
  }, [memberIds, users, squad]);

  const toggleMember = (id: string) =>
    form.setValue(
      'member_ids',
      memberIds.includes(id) ? memberIds.filter((m) => m !== id) : [...memberIds, id],
      { shouldDirty: true },
    );

  const goBack = () => router.push(basePath);
  const requestCancel = () => (form.formState.isDirty ? setDialog('cancel') : goBack());

  const onValid = async (values: SquadFormValues) => {
    try {
      const payload: CreateSquadInput = {
        nama_squad: values.nama_squad,
        kode_squad: values.kode_squad,
        wilayah: values.wilayah,
        is_active: values.is_active,
        id_supervisor: values.id_supervisor || null,
        member_ids: Array.isArray(values.member_ids) ? values.member_ids : [],
      };

      await (isEdit ? updateMutation : createMutation).mutateAsync(payload);
      toast.success('Data squad berhasil disimpan', {
        description: React.createElement(
          'span',
          { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
          `Squad "${values.nama_squad}" berhasil disimpan.`,
        ),
      });
      goBack();
    } catch (error: unknown) {
      const message = getErrorMessage(error);

      // Tangani error backend spesifik HTTP 409 ("Kode squad sudah digunakan")
      if (
        (isAxiosError(error) && error.response?.status === 409) ||
        message.toLowerCase().includes('kode squad')
      ) {
        form.setError('kode_squad', {
          type: 'server',
          message: message || 'Kode squad sudah digunakan.',
        });
      } else {
        form.setError('root.server', { message });
      }
    }
  };

  const onInvalid = () => {};

  const onSubmit = form.handleSubmit(onValid, onInvalid);

  const confirmDelete = async () => {
    if (!squad) return;
    try {
      await deleteMutation.mutateAsync(squad.id_squad);
      toast.success('Data berhasil dihapus', {
        description: React.createElement(
          'span',
          { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
          `Squad "${squad.nama_squad}" berhasil dihapus.`,
        ),
      });
      goBack();
    } catch (error) {
      setDialog(null);
      const msg = getErrorMessage(error);
      form.setError('root.server', { message: msg });
      toast.danger('Gagal Menghapus Squad', {
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
    isEdit,
    isSubmitting: form.formState.isSubmitting,
    isDeleting: deleteMutation.isPending,
    supervisors,
    salesCandidates,
    members,
    memberIds,
    toggleMember,
    dialog,
    setDialog,
    closeDialog,
    requestCancel,
    onSubmit,
    confirmDelete,
    goBack,
  };
}
