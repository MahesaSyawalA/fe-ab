'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AlertCircle, ArrowLeft, Pencil, RotateCcw } from 'lucide-react';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { SurfaceCard } from '@/components/ui/surface-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';
import {
  INITIAL_KANBAN_STAGES,
  AKTIVITAS_STAGE_CONFIG,
  KanbanStageColumn,
} from '@/constants/kanban-constants';
import { useKanbanStore } from '@/lib/kanban-store';
import {
  useKanbanTicketDetailQuery,
  useKanbanStagesQuery,
  useMoveTicketMutation,
  useCreateAktivitasMutation,
  useCreateBuktiKunjunganMutation,
  useCreateEvidenceMutation,
} from '@/hooks/queries/use-kanban-query';
import { detectFileType } from './stage-drawer/types';
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
import {
  DetailTab,
  NegotiationResult,
  ProspekDetailViewProps,
} from './prospek/types';

export function ProspekDetailView({
  ticketId: propTicketId,
  ticket: propTicket,
  basePath,
}: ProspekDetailViewProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { addActivity, moveTicketToStage, updateTicket } = useKanbanStore();

  const ticketId = propTicketId || propTicket?.id_tiket || '';

  // 1. TanStack Query: Ticket Detail & Stages
  const {
    data: ticketResponse,
    isLoading: isTicketLoading,
    isError,
    refetch,
  } = useKanbanTicketDetailQuery(ticketId, {
    enabled: Boolean(ticketId),
    initialData: propTicket ? { success: true, data: propTicket } : undefined,
  });

  const { data: stagesResponse } = useKanbanStagesQuery();

  const stages: KanbanStageColumn[] = React.useMemo(() => {
    const raw = stagesResponse?.data;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw
        .filter((s) => s.is_aktif ?? true)
        .sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0))
        .map((s, idx) => ({
          ...s,
          dotColor:
            s.dotColor ||
            AKTIVITAS_STAGE_CONFIG[s.jenis_tahap]?.dotColor ||
            INITIAL_KANBAN_STAGES[idx % INITIAL_KANBAN_STAGES.length]?.dotColor ||
            '#7C5CFC',
        }));
    }
    return INITIAL_KANBAN_STAGES;
  }, [stagesResponse]);

  const ticket = ticketResponse?.data ?? propTicket;

  // Mutation hooks
  const moveTicketMutation = useMoveTicketMutation();
  const createAktivitasMutation = useCreateAktivitasMutation();
  const createBuktiKunjunganMutation = useCreateBuktiKunjunganMutation();
  const createEvidenceMutation = useCreateEvidenceMutation();

  const [activeTab, setActiveTab] = React.useState<DetailTab>('info');
  const [activityDrawerOpen, setActivityDrawerOpen] = React.useState(false);
  const [negotiationDrawerOpen, setNegotiationDrawerOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isSubmittingActivity, setIsSubmittingActivity] = React.useState(false);

  const currentStage = React.useMemo(() => {
    if (!ticket) return stages[0];
    return (
      stages.find((s) => s.id_tahap === ticket.id_tahap) ||
      stages.find((s) => s.jenis_tahap === ticket.id_tahap) ||
      stages[0]
    );
  }, [stages, ticket]);

  const stageLabel = currentStage?.nama_tahap ?? 'Tahap Prospek';

  // Handle Negotiation result
  const handleNegotiationResult = async (result: NegotiationResult) => {
    if (!ticket) return;

    const targetStageType = result === 'negosiasi' ? 'follow_up' : 'revenue';
    const targetStageObj =
      stages.find((s) => s.jenis_tahap === targetStageType) ||
      stages.find((s) => s.id_tahap === targetStageType) ||
      stages[stages.length - 1];

    const newStatus =
      result === 'won' ? 'won' : result === 'lost' ? 'lost' : 'open';

    try {
      await moveTicketMutation.mutateAsync({
        id_tiket: ticket.id_tiket,
        id_tahap: targetStageObj.id_tahap,
        ticketUpdates: {
          status: newStatus,
          tanggal_closing: result !== 'negosiasi' ? new Date().toISOString() : null,
        },
        catatan: `Hasil negosiasi: ${result.toUpperCase()} dicatat oleh Sales.`,
      });

      // Optimistic update in client store
      if (result === 'negosiasi') {
        moveTicketToStage(ticket.id_tiket, targetStageObj.id_tahap);
      } else {
        updateTicket(ticket.id_tiket, {
          status: newStatus,
          id_tahap: targetStageObj.id_tahap,
        });
      }

      toast.add({
        title: 'Hasil Negosiasi Tersimpan',
        description: `Status prospek berhasil diperbarui menjadi ${result}.`,
        type: 'success',
      });
      refetch();
    } catch (err: unknown) {
      toast.add({
        title: 'Gagal Memperbarui Negosiasi',
        description:
          err instanceof Error ? err.message : 'Terjadi kesalahan sistem.',
        type: 'error',
      });
    } finally {
      setNegotiationDrawerOpen(false);
    }
  };

  // 2. Loading State: Skeleton Layout
  if (isTicketLoading && !ticket) {
    return <ProspekDetailSkeleton onBack={() => router.push(basePath)} />;
  }

  // 3. Error / Not Found State
  if (isError || (!isTicketLoading && !ticket)) {
    return (
      <ProspekNotFoundView
        onBack={() => router.push(basePath)}
        onRetry={() => refetch()}
      />
    );
  }

  // Guaranteed ticket exists from here on
  if (!ticket) return null;

  return (
    <div className='mx-auto flex min-h-dvh md:min-h-0 w-full max-w-lg lg:max-w-7xl min-w-0 flex-col bg-muted/25 lg:bg-transparent pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-10'>
      <SubpageHeader
        title='Detail Prospek'
        subtitle='Informasi lengkap prospek, progres tahapan pipa penjualan, dan log aktivitas kunjungan'
        onBack={() => router.push(basePath)}
        rightAction={
          <>
            {/* Mobile Edit Button (< md) */}
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

            {/* Desktop Edit Button (>= md) */}
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
          </>
        }
      />

      <div className='flex flex-1 flex-col gap-4 lg:gap-6 px-4 md:px-0 py-4 md:py-2'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start'>
          {/* 1. Progres Tahap (full-width di desktop, scrollable di mobile) */}
          <ProspekProgressCard
            stageId={ticket.id_tahap}
            stageLabel={stageLabel}
            className='order-2 lg:order-1 lg:col-span-12'
          />

          {/* 2. Kolom kiri: ringkasan & aksi cepat */}
          <div className='order-1 lg:order-2 lg:col-span-5 xl:col-span-4 flex flex-col gap-4 lg:sticky lg:top-20'>
            <ProspekSummaryCard ticket={ticket} stageLabel={stageLabel} />
            <ProspekActionsCard
              onNegotiate={() => setNegotiationDrawerOpen(true)}
              onAddActivity={() => setActivityDrawerOpen(true)}
            />
          </div>

          {/* 3. Kolom kanan: tab & isi */}
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
                  onAdd={() => setActivityDrawerOpen(true)}
                />
              )}
            </SurfaceCard>
          </div>

          {/* 4. CTA mobile: Tentukan Hasil Negosiasi (Sticky di mobile/PWA, disembunyikan di desktop) */}
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

      {/* Drawer: Tambah Aktivitas Dinamis Sesuai Tahap Prospek */}
      <StageActivityDrawer
        open={activityDrawerOpen}
        onOpenChange={setActivityDrawerOpen}
        mode='move'
        ticket={ticket}
        fromStage={currentStage}
        targetStage={currentStage}
        isSubmitting={isSubmittingActivity}
        onConfirmMove={async (params) => {
          try {
            setIsSubmittingActivity(true);
            await moveTicketMutation.mutateAsync({
              id_tiket: params.id_tiket,
              id_tahap: params.toStageId,
              ticketUpdates: params.ticketUpdates,
              catatan: params.activity.catatan,
            });

            const userId =
              session?.user?.id_user || params.activity.id_user || 'usr-1';
            const createdRes = await createAktivitasMutation.mutateAsync({
              id_user: userId,
              id_tiket: params.id_tiket,
              tanggal: params.activity.tanggal || new Date().toISOString(),
              catatan:
                params.activity.catatan || `Aktivitas tahap ${params.toStageId}`,
              jenis_kegiatan: params.activity.jenis_kegiatan,
              jadwal_follow_up: params.activity.jadwal_follow_up,
            });

            const newAktivitasId = createdRes.data?.id_aktivitas;

            if (newAktivitasId && params.evidenceFile?.rawFile) {
              const targetStageObj = stages.find(
                (s) => s.id_tahap === params.toStageId,
              );
              if (targetStageObj?.jenis_tahap === 'visit') {
                const formData = new FormData();
                formData.append('id_aktivitas', newAktivitasId);
                formData.append('img_url', params.evidenceFile.rawFile);
                if (params.gpsData) {
                  formData.append('latitude', String(params.gpsData.latitude));
                  formData.append('longitude', String(params.gpsData.longitude));
                  formData.append(
                    'jarak_klien',
                    String(params.gpsData.jarak_klien),
                  );
                  formData.append(
                    'dalam_radius',
                    params.gpsData.dalam_radius ? 'true' : 'false',
                  );
                }
                await createBuktiKunjunganMutation.mutateAsync(formData);
              } else {
                const formData = new FormData();
                formData.append('id_aktivitas', newAktivitasId);
                formData.append('file', params.evidenceFile.rawFile);
                formData.append(
                  'tipe',
                  detectFileType(params.evidenceFile.name),
                );
                formData.append('deskripsi', params.evidenceFile.name);
                if (params.activity.catatan) {
                  formData.append('catatan', params.activity.catatan);
                }
                await createEvidenceMutation.mutateAsync(formData);
              }
            }

            // Sync with local store
            addActivity(ticket.id_tiket, params.activity);
            if (params.ticketUpdates && Object.keys(params.ticketUpdates).length > 0) {
              updateTicket(ticket.id_tiket, params.ticketUpdates);
            }

            toast.add({
              title: 'Aktivitas Berhasil Disimpan',
              description: 'Catatan aktivitas dan berkas bukti berhasil diperbarui.',
              type: 'success',
            });
            refetch();
            setActivityDrawerOpen(false);
          } catch (err: unknown) {
            toast.add({
              title: 'Gagal Menyimpan Aktivitas',
              description:
                err instanceof Error ? err.message : 'Terjadi kesalahan sistem.',
              type: 'error',
            });
          } finally {
            setIsSubmittingActivity(false);
          }
        }}
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
    </div>
  );
}

/**
 * Skeleton Loader untuk Halaman Detail Prospek saat data TanStack Query sedang dimuat.
 */
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
          {/* Stepper Skeleton */}
          <div className='order-2 lg:order-1 lg:col-span-12'>
            <Skeleton className='h-24 w-full rounded-2xl' />
          </div>

          {/* Left Column Skeleton */}
          <div className='order-1 lg:order-2 lg:col-span-5 xl:col-span-4 flex flex-col gap-4'>
            <Skeleton className='h-64 w-full rounded-2xl' />
            <Skeleton className='h-28 w-full rounded-2xl' />
          </div>

          {/* Right Column Skeleton */}
          <div className='order-3 lg:col-span-7 xl:col-span-8 flex flex-col gap-3.5'>
            <Skeleton className='h-96 w-full rounded-2xl' />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Tampilan Not Found / Error ramah pengguna jika ID tiket tidak ada di server.
 */
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
