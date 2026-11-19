'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { SurfaceCard } from '@/components/ui/surface-card';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { Skeleton } from '@/components/ui/skeleton';
import { StageActivityDrawer } from './stage-activity-drawer';
import {
  ProspekActionsCard,
  ProspekDetailTabs,
  ProspekNegotiationDrawer,
  ProspekProgressCard,
  ProspekSummaryCard,
} from './prospek/detail';
import { ProspekEditModal } from './prospek/prospek-edit-modal';
import {
  ProspekTabAktivitas,
  ProspekTabInfo,
  ProspekTabRiwayat,
} from './prospek/tabs';
import { ProspekDetailViewProps } from './prospek/types';
import { useProspekDetail } from './prospek/use-prospek-detail';

export function ProspekDetailView(props: ProspekDetailViewProps) {
  const router = useRouter();
  const { basePath } = props;

  const {
    ticket,
    currentStage,
    stageLabel,
    activeTab,
    setActiveTab,
    activityDrawerOpen,
    setActivityDrawerOpen,
    negotiationDrawerOpen,
    setNegotiationDrawerOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    canDeleteTicket,
    isDeletingTicket,
    isTicketDeleted,
    isSubmittingActivity,
    isTicketLoading,
    isError,
    refetch,
    handleNegotiationResult,
    handleConfirmActivity,
    handleDeleteTicket,
  } = useProspekDetail(props);

  if (isTicketLoading && !ticket) {
    return <ProspekDetailSkeleton onBack={() => router.push(basePath)} />;
  }

  if (!isTicketDeleted && (isError || (!isTicketLoading && !ticket))) {
    return (
      <ProspekNotFoundView
        onBack={() => router.push(basePath)}
        onRetry={() => refetch()}
      />
    );
  }

  if (!ticket) return null;

  return (
    <div className='mx-auto flex min-h-dvh md:min-h-0 w-full max-w-lg lg:max-w-7xl min-w-0 flex-col bg-muted/25 lg:bg-transparent pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-10'>
      <SubpageHeader
        title='Detail Prospek'
        subtitle='Informasi lengkap prospek, progres tahapan pipa penjualan, dan log aktivitas kunjungan'
        onBack={() => router.push(basePath)}
        rightAction={
          <div className='flex items-center gap-1.5'>
            <Button
              type='button'
              variant='ghost'
              size='icon-sm'
              onClick={() => setIsEditModalOpen(true)}
              className='size-8 rounded-full text-foreground hover:bg-muted cursor-pointer md:hidden'
              aria-label='Edit Prospek'
            >
              <Pencil className='size-4' />
            </Button>

            {canDeleteTicket && (
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                onClick={() => setIsDeleteOpen(true)}
                className='size-8 rounded-full text-destructive hover:bg-destructive/10 cursor-pointer md:hidden'
                aria-label='Hapus Tiket'
              >
                <Trash2 className='size-4' />
              </Button>
            )}

            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => setIsEditModalOpen(true)}
              className='hidden md:flex h-9 rounded-xl border-border bg-card text-foreground shadow-2xs hover:bg-secondary gap-1.5 px-3.5 cursor-pointer text-xs font-medium'
            >
              <Pencil className='size-3.5' />
              <span>Edit Prospek</span>
            </Button>

            {canDeleteTicket && (
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setIsDeleteOpen(true)}
                className='hidden md:flex h-9 rounded-xl border-destructive/30 bg-destructive/5 text-destructive shadow-2xs hover:bg-destructive/10 gap-1.5 px-3.5 cursor-pointer text-xs font-semibold'
              >
                <Trash2 className='size-3.5' />
                <span>Hapus</span>
              </Button>
            )}
          </div>
        }
      />

      <div className='flex flex-1 flex-col gap-4 lg:gap-6 px-4 md:px-0 py-4 md:py-2'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start'>
          <ProspekProgressCard
            stageId={ticket.id_tahap}
            stageLabel={stageLabel}
            className='order-2 lg:order-1 lg:col-span-12'
          />

          <div className='order-1 lg:order-2 lg:col-span-5 xl:col-span-4 flex flex-col gap-4 lg:sticky lg:top-20'>
            <ProspekSummaryCard ticket={ticket} stageLabel={stageLabel} />
            <ProspekActionsCard
              onNegotiate={() => setNegotiationDrawerOpen(true)}
              onAddActivity={() => setActivityDrawerOpen(true)}
            />
          </div>

          <div className='order-3 lg:col-span-7 xl:col-span-8 flex flex-col gap-3.5'>
            <SurfaceCard className='overflow-hidden'>
              <ProspekDetailTabs
                active={activeTab}
                onChange={setActiveTab}
                riwayatCount={ticket.riwayat_list?.length ?? 0}
                aktivitasCount={ticket.aktivitas_list?.length ?? 0}
              />
              {activeTab === 'info' && <ProspekTabInfo ticket={ticket} />}
              {activeTab === 'riwayat' && <ProspekTabRiwayat ticket={ticket} />}
              {activeTab === 'aktivitas' && (
                <ProspekTabAktivitas
                  ticket={ticket}
                  canEdit={canDeleteTicket}
                  onAdd={() => setActivityDrawerOpen(true)}
                />
              )}
            </SurfaceCard>
          </div>

          <div className='fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/85 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md lg:hidden shadow-lg'>
            <div className='mx-auto w-full max-w-lg'>
              <Button
                type='button'
                onClick={() => setNegotiationDrawerOpen(true)}
                className='h-11 w-full rounded-md bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary text-xs font-semibold text-white shadow-sm disabled:opacity-50 transition-all cursor-pointer'
              >
                Tentukan Hasil Negosiasi
              </Button>
            </div>
          </div>
        </div>
      </div>

      <StageActivityDrawer
        open={activityDrawerOpen}
        onOpenChange={setActivityDrawerOpen}
        mode='move'
        ticket={ticket}
        fromStage={currentStage}
        targetStage={currentStage}
        isSubmitting={isSubmittingActivity}
        onConfirmMove={handleConfirmActivity}
        onCancelMove={() => setActivityDrawerOpen(false)}
      />

      <ProspekNegotiationDrawer
        open={negotiationDrawerOpen}
        onOpenChange={setNegotiationDrawerOpen}
        onSelect={handleNegotiationResult}
      />

      <ProspekEditModal
        ticket={ticket}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        basePath={basePath}
        onSuccess={() => refetch()}
      />

      <ConfirmModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title='Hapus Tiket Prospek?'
        description={
          <>
            Prospek <strong className='font-semibold text-foreground'>{ticket.judul}</strong> beserta seluruh riwayat dan aktivitas terkait akan dihapus secara permanen dari sistem.
          </>
        }
        confirmLabel='Hapus'
        cancelLabel='Batal'
        icon={<Trash2 className='size-7 text-rose-600' />}
        onConfirm={handleDeleteTicket}
        isLoading={isDeletingTicket}
      />
    </div>
  );
}

function ProspekDetailSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <div className='mx-auto flex min-h-dvh md:min-h-0 w-full max-w-lg lg:max-w-7xl min-w-0 flex-col bg-muted/25 lg:bg-transparent pb-10'>
      <SubpageHeader
        title='Detail Prospek'
        subtitle='Memuat rincian prospek dan riwayat aktivitas...'
        onBack={onBack}
      />
      <div className='flex flex-1 flex-col gap-4 lg:gap-6 px-4 md:px-0 py-4 md:py-2'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start'>
          <div className='order-2 lg:order-1 lg:col-span-12'>
            <Skeleton className='h-24 w-full rounded-2xl' />
          </div>

          <div className='order-1 lg:order-2 lg:col-span-5 xl:col-span-4 flex flex-col gap-4'>
            <Skeleton className='h-64 w-full rounded-2xl' />
            <Skeleton className='h-28 w-full rounded-2xl' />
          </div>

          <div className='order-3 lg:col-span-7 xl:col-span-8 flex flex-col gap-3.5'>
            <Skeleton className='h-96 w-full rounded-2xl' />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProspekNotFoundView({
  onBack,
  onRetry,
}: {
  onBack: () => void;
  onRetry: () => void;
}) {
  return (
    <div className='mx-auto flex min-h-dvh md:min-h-0 w-full max-w-lg lg:max-w-7xl min-w-0 flex-col bg-muted/25 lg:bg-transparent pb-10'>
      <SubpageHeader
        title='Detail Prospek'
        subtitle='Tiket Tidak Ditemukan'
        onBack={onBack}
      />
      <div className='flex flex-1 flex-col items-center justify-center p-6 md:p-12 text-center'>
        <SurfaceCard className='max-w-md w-full p-6 sm:p-8 flex flex-col items-center text-center gap-3'>
          <div className='size-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-1'>
            <AlertCircle className='size-7' />
          </div>
          <h2 className='text-base sm:text-lg font-bold text-foreground'>
            Tiket Prospek Tidak Ditemukan
          </h2>
          <p className='text-xs sm:text-sm text-muted-foreground leading-relaxed'>
            Data tiket prospek yang Anda tuju tidak ditemukan pada server atau mungkin telah dipindahkan atau dihapus.
          </p>
          <div className='flex items-center gap-2.5 pt-3 w-full'>
            <Button
              type='button'
              variant='outline'
              onClick={onRetry}
              className='flex-1 h-9.5 text-xs font-semibold gap-1.5 rounded-xl cursor-pointer'
            >
              <RotateCcw className='size-3.5' />
              <span>Coba Lagi</span>
            </Button>
            <Button
              type='button'
              onClick={onBack}
              className='flex-1 h-9.5 text-xs font-semibold gap-1.5 rounded-xl bg-primary text-white hover:bg-primary/90 cursor-pointer'
            >
              <ArrowLeft className='size-3.5' />
              <span>Ke Kanban Board</span>
            </Button>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
