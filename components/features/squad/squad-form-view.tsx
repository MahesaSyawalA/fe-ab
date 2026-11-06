'use client';

import { Controller } from 'react-hook-form';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { FormActions } from '@/components/ui/form-actions';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { Switch } from '@/components/ui/switch';
import type { SquadWithDetails } from '@/types/squad.types';
import { SquadMemberCard } from './form/squad-member-card';
import { SquadMemberPicker } from './form/squad-member-picker';
import { useSquadForm } from './form/use-squad-form';

interface SquadFormViewProps {
  basePath: string;
  /** Diisi saat mode edit. */
  squad?: SquadWithDetails;
}

const inputClass = 'h-10 rounded-xl border-border bg-card text-xs shadow-2xs';

export function SquadFormView({ basePath, squad }: SquadFormViewProps) {
  const s = useSquadForm({ basePath, squad });
  const { register, control, formState } = s.form;
  const { errors } = formState;

  return (
    <div className='mx-auto flex w-full min-w-0 flex-1 flex-col gap-4 md:max-w-3xl md:pb-12'>
      <SubpageHeader
        title={s.isEdit ? 'Edit Squad' : 'Tambah Squad Baru'}
        onBack={s.requestCancel}
      />

      <form onSubmit={s.onSubmit} noValidate className='flex flex-1 flex-col gap-4 px-4 pt-2 md:px-0 md:pt-0'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField label='Nama Squad' required error={errors.nama_squad?.message}>
            <Input {...register('nama_squad')} placeholder='Team Eca' className={inputClass} />
          </FormField>

          <FormField label='Supervisor' required error={errors.id_supervisor?.message}>
            <Controller
              control={control}
              name='id_supervisor'
              render={({ field }) => (
                <NativeSelect {...field}>
                  <option value=''>Pilih Supervisor</option>
                  {s.supervisors.map((u) => (
                    <option key={u.id_user} value={u.id_user}>
                      {u.nama}
                    </option>
                  ))}
                </NativeSelect>
              )}
            />
          </FormField>

          <FormField label='Kode Squad' required error={errors.kode_squad?.message}>
            <Input {...register('kode_squad')} placeholder='S0123' className={inputClass} />
          </FormField>

          <FormField label='Wilayah' required error={errors.wilayah?.message}>
            <Input {...register('wilayah')} placeholder='Bandung' className={inputClass} />
          </FormField>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-sm font-semibold text-foreground'>
            Active<span className='text-destructive'> *</span>
          </span>
          <Controller
            control={control}
            name='is_active'
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} aria-label='Active' />
            )}
          />
        </div>

        <div className='flex flex-col gap-2.5'>
          {s.members.map((member) => (
            <SquadMemberCard
              key={member.id_user}
              member={member}
              onRemove={() => s.toggleMember(member.id_user)}
            />
          ))}
          <Button
            type='button'
            variant='outline'
            onClick={() => s.setDialog('picker')}
            className='h-10 gap-2 rounded-xl border-primary/40 bg-primary/5 text-xs font-medium text-primary hover:bg-primary/10 cursor-pointer'
          >
            <UserPlus className='size-4' />
            Tambahkan Member Lainnya
          </Button>
        </div>

        {s.isEdit && (
          <Button
            type='button'
            onClick={() => s.setDialog('delete')}
            className='h-10 rounded-md bg-destructive text-xs font-semibold text-white hover:bg-destructive/90 cursor-pointer'
          >
            Hapus Squad
          </Button>
        )}

        {errors.root?.server && (
          <p className='text-xs font-medium text-destructive'>{errors.root.server.message}</p>
        )}

        <FormActions
          onCancel={s.requestCancel}
          isSubmitting={s.isSubmitting}
          className='-mx-4 mt-auto px-4 sm:mx-0 sm:mt-2 sm:px-0'
        />
      </form>

      <SquadMemberPicker
        open={s.dialog === 'picker'}
        onOpenChange={s.closeDialog}
        candidates={s.salesCandidates}
        selectedIds={s.memberIds}
        onToggle={s.toggleMember}
      />

      <ConfirmModal
        open={s.dialog === 'cancel'}
        onOpenChange={s.closeDialog}
        title='Batalkan perubahan?'
        description='Perubahan yang belum disimpan akan hilang. Yakin ingin membatalkan?'
        confirmLabel='Batalkan'
        onConfirm={s.goBack}
      />

      <ConfirmModal
        open={s.dialog === 'delete'}
        onOpenChange={s.closeDialog}
        title='Hapus squad?'
        description='Squad akan dihapus permanen dan seluruh anggotanya dikeluarkan dari squad ini.'
        confirmLabel='Hapus'
        onConfirm={s.confirmDelete}
        isLoading={s.isDeleting}
      />
    </div>
  );
}
