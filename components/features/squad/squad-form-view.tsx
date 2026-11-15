'use client';

import * as React from 'react';
import { Controller } from 'react-hook-form';
import { Trash2, UserMinus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { FormActions } from '@/components/ui/form-actions';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { Switch } from '@/components/ui/switch';
import type { SquadMember, SquadWithDetails } from '@/types/squad.types';
import { SquadTextFieldInput, SquadSelectInput } from './inputs';
import { SquadMemberCard } from './form/squad-member-card';
import { SquadMemberPicker } from './form/squad-member-picker';
import { useSquadForm } from './form/use-squad-form';

interface SquadFormViewProps {
  basePath: string;
  squad?: SquadWithDetails;
}

export function SquadFormView({ basePath, squad }: SquadFormViewProps) {
  const s = useSquadForm({ basePath, squad });
  const [memberToRemove, setMemberToRemove] = React.useState<SquadMember | null>(null);
  const { control, formState } = s.form;
  const { errors } = formState;

  return (
    <div className='mx-auto flex w-full min-w-0 flex-1 flex-col gap-4 md:max-w-3xl md:pb-12'>
      <SubpageHeader
        title={s.isEdit ? 'Edit Squad' : 'Tambah Squad Baru'}
        onBack={s.requestCancel}
      />

      <form onSubmit={s.onSubmit} noValidate className='flex flex-1 flex-col gap-4 px-4 pt-2 md:px-0 md:pt-0'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Controller
            control={control}
            name='nama_squad'
            render={({ field, fieldState: { error } }) => (
              <SquadTextFieldInput
                label='Nama Squad'
                isRequired
                placeholder='Contoh: Squad Jakarta Timur'
                value={field.value}
                onChange={field.onChange}
                isInvalid={Boolean(error)}
                errorMessage={error?.message}
                disabled={s.isSubmitting}
              />
            )}
          />

          <Controller
            control={control}
            name='id_supervisor'
            render={({ field, fieldState: { error } }) => (
              <SquadSelectInput
                label='Supervisor'
                isRequired
                placeholder='Pilih Supervisor'
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: '', label: 'Pilih Supervisor' },
                  ...s.supervisors.map((u) => ({
                    value: u.id_user,
                    label: u.nama,
                  })),
                ]}
                isInvalid={Boolean(error)}
                errorMessage={error?.message}
                isDisabled={s.isSubmitting}
              />
            )}
          />

          <Controller
            control={control}
            name='kode_squad'
            render={({ field, fieldState: { error } }) => (
              <SquadTextFieldInput
                label='Kode Squad'
                isRequired
                placeholder='Contoh: SQD-01'
                value={field.value}
                onChange={field.onChange}
                isInvalid={Boolean(error)}
                errorMessage={error?.message}
                disabled={s.isSubmitting}
              />
            )}
          />

          <Controller
            control={control}
            name='wilayah'
            render={({ field, fieldState: { error } }) => (
              <SquadTextFieldInput
                label='Wilayah'
                isRequired
                placeholder='Contoh: Jakarta Selatan'
                value={field.value}
                onChange={field.onChange}
                isInvalid={Boolean(error)}
                errorMessage={error?.message}
                disabled={s.isSubmitting}
              />
            )}
          />
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
              onRemove={() => setMemberToRemove(member)}
            />
          ))}
          <Button
            type='button'
            variant='outline'
            onClick={() => s.setDialog('picker')}
            className='h-10 gap-2 rounded-md border-primary/40 bg-primary/5 text-xs font-medium text-primary hover:bg-primary/10 cursor-pointer'
          >
            <UserPlus className='size-4' />
            Tambahkan Member Lainnya
          </Button>
        </div>

        {s.isEdit && (
          <div className='flex justify-start pt-1'>
            <Button
              type='button'
              variant='destructive'
              onClick={() => s.setDialog('delete')}
              className='h-9 w-fit gap-1.5 rounded-md border border-destructive/30 bg-destructive/10 px-4 text-xs font-semibold text-destructive shadow-none hover:bg-destructive/15 active:bg-destructive/20 transition-all cursor-pointer'
            >
              <Trash2 className='size-3.5' />
              <span>Hapus Squad</span>
            </Button>
          </div>
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
        cancelLabel='Batal'
        icon={<Trash2 className='size-7 text-rose-600' />}
        onConfirm={s.confirmDelete}
        isLoading={s.isDeleting}
      />

      <ConfirmModal
        open={Boolean(memberToRemove)}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
        title='Keluarkan Anggota?'
        description={`Yakin ingin mengeluarkan "${memberToRemove?.nama || 'anggota ini'}" dari squad?`}
        confirmLabel='Keluarkan'
        cancelLabel='Batal'
        icon={<UserMinus className='size-7 text-rose-600' />}
        onConfirm={() => {
          if (memberToRemove) {
            s.toggleMember(memberToRemove.id_user);
            setMemberToRemove(null);
          }
        }}
      />
    </div>
  );
}
