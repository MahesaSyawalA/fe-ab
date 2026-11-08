'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { SubpageHeader } from '@/components/ui/subpage-header';
import {
  ProspekEditFormFields,
  ProspekEditFooterActions,
  ProspekFormBanner,
  useProspekForm,
} from './prospek/form';
import { ProspekFormViewProps } from './prospek/types';

export function ProspekFormView(props: ProspekFormViewProps) {
  const { mode } = props;
  const router = useRouter();
  const formState = useProspekForm(props);

  return (
    <div className='mx-auto flex min-h-dvh md:min-h-0 w-full max-w-lg md:max-w-4xl lg:max-w-5xl min-w-0 flex-col bg-card md:bg-transparent md:gap-6'>
      <SubpageHeader
        title={mode === 'create' ? 'Buat Prospek' : 'Edit Prospek'}
        subtitle={
          mode === 'create'
            ? 'Daftarkan prospek baru ke dalam pipa penjualan kanban'
            : 'Perbarui data prospek, estimasi nilai penawaran, dan target closing'
        }
        onBack={() => router.push(formState.backPath)}
      />

      <form
        onSubmit={formState.onSubmit}
        className='flex flex-1 flex-col justify-between gap-5 px-5 py-4 bg-card md:rounded-2xl md:border md:border-border md:p-6 lg:p-8 md:shadow-xs'
      >
        <div className='flex flex-col gap-4 pb-4 sm:pb-0'>
          {mode === 'create' && (
            <ProspekFormBanner errorCount={0} mode={mode} />
          )}

          <ProspekEditFormFields
            formState={formState}
            showKodeTiket={mode === 'edit'}
          />
        </div>

        <ProspekEditFooterActions
          onCancel={() => router.push(formState.backPath)}
          isPending={formState.isPending}
        />
      </form>
    </div>
  );
}
