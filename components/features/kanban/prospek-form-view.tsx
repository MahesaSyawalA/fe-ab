'use client';

import { useRouter } from 'next/navigation';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import {
  ProspekFieldClosing,
  ProspekFieldEstimasi,
  ProspekFieldJudul,
  ProspekFieldOutletPic,
  ProspekFieldPenawaran,
  ProspekFieldPrioritas,
  ProspekFormActions,
  ProspekFormBanner,
  useProspekForm,
} from './prospek/form';
import { ProspekFormViewProps } from './prospek/types';

export function ProspekFormView(props: ProspekFormViewProps) {
  const { mode, ticket } = props;
  const router = useRouter();
  const form = useProspekForm(props);
  const { errors } = form;

  return (
    <div className='mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-card'>
      <SubpageHeader
        title={mode === 'create' ? 'Buat Prospek' : 'Edit Prospek'}
        onBack={() => router.push(form.backPath)}
      />

      <form
        onSubmit={form.handleSubmit}
        className='flex flex-1 flex-col justify-between gap-5 px-5 py-4'
      >
        <div className='flex flex-col gap-4'>
          <ProspekFormBanner errorCount={form.errorCount} mode={mode} />

          {/* ID Tiket (Only in Edit Prospek) */}
          {mode === 'edit' && (
            <FormField label='ID Tiket' required>
              <Input
                type='text'
                value={ticket?.kode_tiket ?? 'TKT-0142'}
                disabled
                className='h-10 rounded-xl border-border bg-muted px-3.5 text-xs font-medium text-muted-foreground'
              />
            </FormField>
          )}

          <ProspekFieldJudul
            value={form.judul}
            onChange={form.setJudul}
            error={errors.judul}
          />
          <ProspekFieldOutletPic
            outlets={form.pelangganList}
            outletId={form.selectedOutletId}
            onOutletChange={form.selectOutlet}
            kontakOptions={form.kontakOptions}
            kontakId={form.selectedKontakId}
            onKontakChange={form.setSelectedKontakId}
            error={errors.outlet}
          />
          <ProspekFieldEstimasi
            value={form.estimasiDisplay}
            onChange={form.setEstimasiDisplay}
          />
          <ProspekFieldClosing
            value={form.targetClosing}
            onChange={form.setTargetClosing}
          />
          <ProspekFieldPrioritas
            value={form.prioritas}
            onChange={form.setPrioritas}
          />
          <ProspekFieldPenawaran
            value={form.filePenawaran}
            onChange={form.setFilePenawaran}
          />
        </div>

        <ProspekFormActions onCancel={() => router.push(form.backPath)} />
      </form>
    </div>
  );
}
