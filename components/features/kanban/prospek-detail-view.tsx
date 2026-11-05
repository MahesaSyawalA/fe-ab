import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Pencil } from 'lucide-react';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { SurfaceCard } from '@/components/ui/surface-card';
import { Button } from '@/components/ui/button';
import { INITIAL_KANBAN_STAGES } from '@/constants/kanban-constants';
import { useKanbanStore } from '@/lib/kanban-store';
import { StageActivityDrawer } from './stage-activity-drawer';
import {
  ProspekActionsCard,
  ProspekDetailTabs,
  ProspekNegotiationDrawer,
  ProspekProgressCard,
  ProspekSummaryCard,
} from './prospek/detail';
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
  ticket,
  basePath,
}: ProspekDetailViewProps) {
  const router = useRouter();
  const { stages, addActivity, moveTicketToStage, updateTicket } =
    useKanbanStore();

  const [activeTab, setActiveTab] = React.useState<DetailTab>('info');
  const [activityDrawerOpen, setActivityDrawerOpen] = React.useState(false);
  const [negotiationDrawerOpen, setNegotiationDrawerOpen] =
    React.useState(false);

  const currentStage = React.useMemo(() => {
    return (
      stages.find((s) => s.id_tahap === ticket.id_tahap) ||
      INITIAL_KANBAN_STAGES.find((s) => s.id_tahap === ticket.id_tahap) ||
      stages[0]
    );
  }, [stages, ticket.id_tahap]);

  const stageLabel = currentStage?.nama_tahap ?? 'Penawaran';

  const handleNegotiationResult = (result: NegotiationResult) => {
    if (result === 'negosiasi') {
      moveTicketToStage(ticket.id_tiket, 'follow_up');
    } else if (result === 'won') {
      updateTicket(ticket.id_tiket, { status: 'won', id_tahap: 'revenue' });
    } else {
      updateTicket(ticket.id_tiket, { status: 'lost', id_tahap: 'revenue' });
    }
    setNegotiationDrawerOpen(false);
  };

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
              onClick={() => router.push(`${basePath}/${ticket.id_tiket}/edit`)}
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
              onClick={() => router.push(`${basePath}/${ticket.id_tiket}/edit`)}
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
        onConfirmMove={({ activity, ticketUpdates }) => {
          addActivity(ticket.id_tiket, activity);
          if (ticketUpdates && Object.keys(ticketUpdates).length > 0) {
            updateTicket(ticket.id_tiket, ticketUpdates);
          }
          setActivityDrawerOpen(false);
        }}
        onCancelMove={() => setActivityDrawerOpen(false)}
      />

      <ProspekNegotiationDrawer
        open={negotiationDrawerOpen}
        onOpenChange={setNegotiationDrawerOpen}
        onSelect={handleNegotiationResult}
      />
    </div>
  );
}
