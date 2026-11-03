'use client';

import { useRouter } from 'next/navigation';
import { Form } from '@heroui/react';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { cn } from '@/lib/utils';
import { ProspekTextFieldInput } from './prospek/inputs';
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
    <div className='mx-auto flex min-h-dvh md:min-h-0 w-full max-w-lg md:max-w-4xl lg:max-w-5xl min-w-0 flex-col bg-card md:bg-transparent md:gap-6 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-0'>
      <SubpageHeader
        title={mode === 'create' ? 'Buat Prospek' : 'Edit Prospek'}
        subtitle={
          mode === 'create'
            ? 'Daftarkan prospek baru ke dalam pipa penjualan kanban'
            : 'Perbarui data prospek, estimasi nilai penawaran, dan target closing'
        }
        onBack={() => router.push(form.backPath)}
      />

      <Form
        onSubmit={form.handleSubmit}
        className='flex flex-1 flex-col justify-between gap-5 px-5 py-4 bg-card md:rounded-2xl md:border md:border-border md:p-6 lg:p-8 md:shadow-xs'
        validationBehavior='aria'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5'>
          {/* Banner error validasi atau info pembuatan prospek */}
          {(form.errorCount > 0 || mode === 'create') && (
            <div className='col-span-1 md:col-span-2'>
              <ProspekFormBanner errorCount={form.errorCount} mode={mode} />
            </div>
          )}

          {/* ID Tiket (Hanya tampil di mode Edit) */}
          {mode === 'edit' && (
            <div className='col-span-1'>
              <ProspekTextFieldInput
                label='ID Tiket'
                isRequired
                value={ticket?.kode_tiket ?? 'TKT-0142'}
                disabled
              />
            </div>
          )}

          {/* Judul Prospek: 1 kolom di mode edit, 2 kolom penuh di mode create */}
          <div className={cn('col-span-1', mode === 'create' && 'md:col-span-2')}>
            <ProspekFieldJudul
              value={form.judul}
              onChange={form.setJudul}
              error={errors.judul}
            />
          </div>

          {/* Outlet & PIC Outlet (Dua select input berdampingan di desktop) */}
          <ProspekFieldOutletPic
            outlets={form.pelangganList}
            outletId={form.selectedOutletId}
            onOutletChange={form.selectOutlet}
            kontakOptions={form.kontakOptions}
            kontakId={form.selectedKontakId}
            onKontakChange={form.setSelectedKontakId}
            error={errors.outlet}
          />

          {/* Estimasi Nilai Penawaran */}
          <div className='col-span-1'>
            <ProspekFieldEstimasi
              value={form.estimasiDisplay}
              onChange={form.setEstimasiDisplay}
            />
          </div>

          {/* Target Tanggal Closing */}
          <div className='col-span-1'>
            <ProspekFieldClosing
              value={form.targetClosing}
              onChange={form.setTargetClosing}
            />
          </div>

          {/* Tingkat Prioritas Prospek */}
          <div className='col-span-1'>
            <ProspekFieldPrioritas
              value={form.prioritas}
              onChange={form.setPrioritas}
            />
          </div>

          {/* Upload File Penawaran */}
          <div className='col-span-1'>
            <ProspekFieldPenawaran
              value={form.filePenawaran}
              onChange={form.setFilePenawaran}
            />
          </div>
        </div>

        <ProspekFormActions onCancel={() => router.push(form.backPath)} />
      </Form>
    </div>
  );
}

