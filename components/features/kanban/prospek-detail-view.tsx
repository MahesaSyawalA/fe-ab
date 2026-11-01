import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  AlignLeft,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  Check,
  CircleDot,
  FileText,
  LayoutGrid,
  Mic,
  Paperclip,
  Pencil,
  Phone,
  Plus,
  User,
  Volume2,
} from 'lucide-react';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  AKTIVITAS_STAGE_CONFIG,
  INITIAL_KANBAN_STAGES,
  PRIORITY_CONFIG,
  PROGRES_TAHAP_STEPS,
} from '@/constants/kanban-constants';
import { useKanbanStore } from '@/lib/kanban-store';
import { TiketWithDetails } from '@/types/ticket.types';
import { cn, formatFullRupiah } from '@/lib/utils';
import { StageActivityDrawer } from './stage-activity-drawer';

interface ProspekDetailViewProps {
  ticket: TiketWithDetails;
  basePath: string;
}

type DetailTab = 'info' | 'riwayat' | 'aktivitas';

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

  const currentStepIdx = Math.max(
    0,
    PROGRES_TAHAP_STEPS.findIndex((s) => s.id === ticket.id_tahap),
  );

  const priority = PRIORITY_CONFIG[ticket.prioritas];

  const aktivitasList = ticket.aktivitas_list ?? [];
  const riwayatList = ticket.riwayat_list ?? [];

  const handleNegotiationResult = (result: 'negosiasi' | 'won' | 'lost') => {
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
    <div className='mx-auto flex min-h-dvh md:min-h-0 w-full max-w-lg lg:max-w-7xl min-w-0 flex-col bg-muted/25 lg:bg-transparent pb-10'>
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
          {/* 1. Progres Tahap Stepper Card (Full-width across desktop, scrollable on mobile) */}
          <Card className='rounded-2xl border-border/70 bg-card py-0 shadow-xs ring-0 order-2 lg:order-1 lg:col-span-12'>
            <CardContent className='flex flex-col gap-3 p-3.5 sm:p-4 lg:p-5'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <span className='text-xs lg:text-sm font-bold text-foreground'>
                    Progres Tahap
                  </span>
                  <Badge
                    variant='outline'
                    className='hidden sm:inline-flex text-[11px] font-semibold text-primary border-primary/20 bg-primary/5'
                  >
                    {stageLabel}
                  </Badge>
                </div>
                <span className='text-[10px] lg:text-xs text-muted-foreground font-medium'>
                  Tahap {Math.min(currentStepIdx + 1, PROGRES_TAHAP_STEPS.length)} dari {PROGRES_TAHAP_STEPS.length}
                </span>
              </div>

              {/* Stepper Track */}
              <div className='overflow-x-auto lg:overflow-x-visible no-scrollbar -mx-1 px-1 py-1.5'>
                <div className='flex items-start min-w-[580px] lg:min-w-0 lg:w-full'>
                  {PROGRES_TAHAP_STEPS.map((step, index) => {
                    const isCompleted = index <= currentStepIdx;
                    const isCurrent = index === currentStepIdx;
                    const isLast = index === PROGRES_TAHAP_STEPS.length - 1;

                    return (
                      <React.Fragment key={step.id}>
                        <div className='flex flex-col items-center shrink-0 lg:shrink-0 w-16 lg:w-20'>
                          <div
                            className={cn(
                              'flex size-6 lg:size-7 items-center justify-center rounded-full text-xs font-semibold transition-all shrink-0',
                              isCompleted
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'border border-muted-foreground/30 bg-muted/30 text-muted-foreground',
                              isCurrent && 'ring-2 ring-primary/25 ring-offset-1',
                            )}
                          >
                            {isCompleted ? (
                              <Check className='size-3.5 lg:size-4 stroke-[2.5]' />
                            ) : (
                              <CircleDot className='size-3 lg:size-3.5' />
                            )}
                          </div>
                          <span
                            className={cn(
                              'mt-1.5 text-[10px] lg:text-[11px] font-medium whitespace-nowrap text-center transition-colors',
                              isCurrent
                                ? 'text-primary font-bold'
                                : isCompleted
                                  ? 'text-foreground font-medium'
                                  : 'text-muted-foreground',
                            )}
                          >
                            {step.label}
                          </span>
                        </div>

                        {!isLast && (
                          <div
                            className={cn(
                              'h-[2px] flex-1 min-w-8 lg:min-w-6 mt-3 lg:mt-3.5 rounded-full mx-1 transition-colors',
                              index < currentStepIdx
                                ? 'bg-primary'
                                : 'bg-slate-200 dark:bg-slate-700',
                            )}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Left Column: Summary & Quick Actions */}
          <div className='order-1 lg:order-2 lg:col-span-5 xl:col-span-4 flex flex-col gap-4 lg:sticky lg:top-20'>
            {/* Ticket Summary Card */}
            <Card className='rounded-2xl border-border/70 bg-card py-0 shadow-xs ring-0'>
              <CardContent className='flex flex-col gap-3 p-4 lg:p-5'>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='text-[11px] font-mono font-medium text-muted-foreground'>
                      {ticket.kode_tiket}
                    </span>
                    <div className='flex items-center gap-1.5'>
                      <Badge className='h-5 rounded-md border-0 bg-violet-600 px-2 text-[10px] font-medium text-white'>
                        {stageLabel}
                      </Badge>
                      <Badge
                        className={cn(
                          'h-5 gap-1.5 rounded-full px-2 text-[10px] font-semibold',
                          priority.badgeClass,
                        )}
                      >
                        <span
                          className={cn('size-1.5 rounded-full', priority.dotClass)}
                        />
                        {priority.label}
                      </Badge>
                    </div>
                  </div>

                  <h2 className='text-base lg:text-lg font-bold text-foreground leading-snug pt-0.5'>
                    {ticket.judul}
                  </h2>
                  <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                    <Building2 className='size-3.5 shrink-0 text-muted-foreground/80' />
                    <span className='truncate'>{ticket.nama_faskes}</span>
                  </div>
                </div>

                <Separator className='bg-border/60' />

                <div className='grid grid-cols-2 gap-3 rounded-xl bg-muted/40 p-3 border border-border/40'>
                  <div className='flex flex-col gap-0.5'>
                    <span className='text-[10px] text-muted-foreground uppercase tracking-wider font-semibold'>
                      Estimasi Revenue
                    </span>
                    <span className='text-sm sm:text-base font-bold text-primary truncate'>
                      {formatFullRupiah(ticket.estimasi_nilai)}
                    </span>
                  </div>

                  <div className='flex flex-col gap-0.5'>
                    <span className='text-[10px] text-muted-foreground uppercase tracking-wider font-semibold'>
                      Estimasi Closing
                    </span>
                    <div className='flex items-center gap-1 text-xs font-semibold text-foreground pt-0.5'>
                      <Calendar className='size-3.5 text-muted-foreground shrink-0' />
                      <span className='truncate'>
                        {ticket.closing_full_label || '31 Okt 2026'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Desktop Actions Card (Always accessible on Desktop) */}
            <Card className='hidden lg:flex rounded-2xl border-border/70 bg-card py-0 shadow-xs ring-0'>
              <CardContent className='flex flex-col gap-2.5 p-4 lg:p-5 w-full'>
                <div className='flex items-center justify-between pb-1'>
                  <span className='text-xs font-bold text-foreground'>
                    Tindakan Prospek
                  </span>
                  <span className='text-[10px] text-muted-foreground font-medium'>
                    Aksi Cepat
                  </span>
                </div>

                <Button
                  type='button'
                  onClick={() => setNegotiationDrawerOpen(true)}
                  className='h-10 w-full rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer'
                >
                  Tentukan Hasil Negosiasi
                </Button>

                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setActivityDrawerOpen(true)}
                  className='h-9 w-full gap-1.5 rounded-xl border-dashed border-primary/40 bg-primary/5 text-xs font-semibold text-primary shadow-none hover:bg-primary/10 cursor-pointer'
                >
                  <Plus className='size-3.5' />
                  Tambah Aktivitas Baru
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 3. Right Column: Tabs Navigation & Content */}
          <div className='order-3 lg:col-span-7 xl:col-span-8 flex flex-col gap-3.5'>
            <Card className='rounded-2xl border-border/70 bg-card py-0 shadow-xs ring-0 overflow-hidden'>
              {/* Tabs Navigation */}
              <div className='grid grid-cols-3 border-b border-border/70 bg-muted/20'>
                {(
                  [
                    { id: 'info', label: 'Info' },
                    { id: 'riwayat', label: `Riwayat (${riwayatList.length})` },
                    { id: 'aktivitas', label: `Aktivitas (${aktivitasList.length})` },
                  ] as const
                ).map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type='button'
                      onClick={() => setActiveTab(tab.id as DetailTab)}
                      className={cn(
                        'relative py-3 text-center text-xs sm:text-sm font-semibold transition-colors cursor-pointer',
                        isActive
                          ? 'text-primary bg-card'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40',
                      )}
                    >
                      {tab.label}
                      {isActive && (
                        <span className='absolute inset-x-6 sm:inset-x-10 bottom-0 h-0.5 rounded-full bg-primary' />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content: INFO */}
              {activeTab === 'info' && (
                <CardContent className='flex flex-col divide-y divide-border/60 p-0'>
                  {[
                    { label: 'Pelanggan', value: ticket.nama_faskes },
                    {
                      label: 'Kontak PIC',
                      value: ticket.nama_pic || 'Bpk. Hendra Wijaya',
                    },
                    {
                      label: 'Jabatan',
                      value: ticket.jabatan_pic || 'Direktur Umum',
                    },
                    {
                      label: 'Telepon',
                      value: ticket.no_telp_pic || '0812-3456-7890',
                      isPhone: true,
                    },
                    {
                      label: 'Sales PIC',
                      value: ticket.nama_sales || 'Rina Putri',
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className='flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5 text-xs sm:text-sm'
                    >
                      <span className='text-muted-foreground font-medium'>
                        {row.label}
                      </span>
                      {row.isPhone ? (
                        <a
                          href={`tel:${row.value.replace(/[^0-9+]/g, '')}`}
                          className='text-right font-semibold text-primary hover:underline'
                        >
                          {row.value}
                        </a>
                      ) : (
                        <span className='text-right font-semibold text-foreground'>
                          {row.value}
                        </span>
                      )}
                    </div>
                  ))}
                </CardContent>
              )}

              {/* Tab Content: RIWAYAT */}
              {activeTab === 'riwayat' && (
                <CardContent className='flex flex-col gap-3 p-4 sm:p-6'>
                  {riwayatList.length === 0 ? (
                    <p className='py-8 text-center text-xs sm:text-sm text-muted-foreground'>
                      Belum ada riwayat perpindahan tahap.
                    </p>
                  ) : (
                    riwayatList.map((item) => (
                      <div
                        key={item.id_riwayat}
                        className='flex items-start justify-between gap-3 border-b border-border/50 pb-3 last:border-b-0 last:pb-0'
                      >
                        <div className='flex flex-col gap-0.5'>
                          <span className='text-xs sm:text-sm font-semibold text-foreground'>
                            {item.nama_tahap_asal
                              ? `${item.nama_tahap_asal} → ${item.nama_tahap_tujuan}`
                              : `Tiket dibuat di tahap ${item.nama_tahap_tujuan}`}
                          </span>
                          <span className='text-[11px] sm:text-xs text-muted-foreground'>
                            Oleh {item.nama_user}
                          </span>
                        </div>
                        <span className='text-[11px] sm:text-xs text-muted-foreground shrink-0'>
                          {item.waktu_label}
                        </span>
                      </div>
                    ))
                  )}
                </CardContent>
              )}

              {/* Tab Content: AKTIVITAS */}
              {activeTab === 'aktivitas' && (
                <div className='flex flex-col gap-3.5 p-3.5 sm:p-5'>
                  {aktivitasList.length === 0 ? (
                    <div className='flex flex-col items-center justify-center gap-3 px-6 py-12 text-center'>
                      <div className='flex size-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500'>
                        <LayoutGrid className='size-5' />
                      </div>
                      <div className='flex flex-col gap-1'>
                        <h3 className='text-sm sm:text-base font-bold text-foreground'>
                          Belum ada data aktivitas
                        </h3>
                        <p className='text-xs text-muted-foreground max-w-sm'>
                          Catat interaksi dengan pelanggan, log kunjungan, penawaran, atau unggah bukti kegiatan.
                        </p>
                      </div>
                      <Button
                        type='button'
                        onClick={() => setActivityDrawerOpen(true)}
                        className='mt-2 h-9 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer'
                      >
                        <Plus className='size-3.5 mr-1.5' />
                        Tambah Aktivitas
                      </Button>
                    </div>
                  ) : (
                    <>
                      {aktivitasList.map((akt) => (
                        <Card
                          key={akt.id_aktivitas}
                          className='rounded-xl border border-border/70 bg-card py-0 shadow-2xs'
                        >
                          <CardContent className='flex flex-col gap-3 p-4 sm:p-5'>
                            <div className='flex items-center justify-between gap-2'>
                              {(() => {
                                const config = AKTIVITAS_STAGE_CONFIG[akt.jenis_kegiatan] || {
                                  label: akt.jenis_kegiatan,
                                  badgeClass: 'bg-primary/10 text-primary border-primary/20',
                                };
                                return (
                                  <Badge
                                    variant='outline'
                                    className={cn(
                                      'h-5 px-2 text-[10px] font-bold uppercase tracking-wider rounded-md border',
                                      config.badgeClass,
                                    )}
                                  >
                                    {config.label}
                                  </Badge>
                                );
                              })()}
                              <span className='text-[11px] sm:text-xs text-muted-foreground'>
                                {akt.waktu_label}
                              </span>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm bg-muted/30 p-2.5 sm:p-3 rounded-xl border border-border/40'>
                              <div className='flex items-center gap-2'>
                                <span className='text-muted-foreground'>Petugas:</span>
                                <span className='font-semibold text-foreground'>{akt.nama_petugas}</span>
                              </div>
                              <div className='flex items-center gap-2'>
                                <span className='text-muted-foreground'>PIC Ditemui:</span>
                                <span className='font-semibold text-foreground'>{akt.pic_ditemui}</span>
                              </div>
                            </div>

                            <div className='flex flex-col gap-1'>
                              <span className='text-xs font-bold text-foreground'>
                                Catatan & Pembahasan:
                              </span>
                              <p className='text-xs sm:text-sm leading-relaxed text-muted-foreground'>
                                {akt.catatan}
                              </p>
                            </div>

                            {akt.evidence && (() => {
                              const evType = akt.evidence.tipe || akt.evidence.jenis || 'foto';
                              const evDesc = akt.evidence.deskripsi || akt.evidence.catatan || '';
                              const evFile = akt.evidence.nama_file;
                              const evSize = akt.evidence.ukuran_file || akt.evidence.file_size;
                              const evDuration = akt.evidence.durasi_audio || (akt.evidence.durasi_detik ? `00:${String(akt.evidence.durasi_detik).padStart(2, '0')}` : undefined);
                              const evPreview = akt.evidence.url_preview || akt.evidence.url_file;

                              return (
                                <div className='mt-1 flex flex-col gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs sm:text-sm'>
                                  <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-1.5 font-semibold text-primary text-xs'>
                                      {evType === 'foto' && <Camera className='size-3.5' />}
                                      {evType === 'audio' && <Mic className='size-3.5' />}
                                      {evType === 'dokumen' && <FileText className='size-3.5' />}
                                      {evType === 'teks' && <AlignLeft className='size-3.5' />}
                                      <span>File Bukti ({evType.toUpperCase()})</span>
                                    </div>
                                    <span className='text-[10px] sm:text-xs text-muted-foreground'>
                                      {akt.evidence.waktu_upload || akt.waktu_label}
                                    </span>
                                  </div>

                                  {evFile && (
                                    <div className='flex items-center gap-1.5 text-xs text-foreground font-medium'>
                                      <Paperclip className='size-3.5 text-muted-foreground' />
                                      <span className='truncate'>{evFile}</span>
                                      {evSize && (
                                        <span className='text-[11px] text-muted-foreground'>
                                          ({evSize})
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {evDuration && (
                                    <div className='flex items-center gap-2 rounded-lg bg-background/80 px-3 py-2 border border-border/50'>
                                      <Volume2 className='size-4 text-primary' />
                                      <span className='text-xs font-semibold text-foreground'>
                                        Rekaman Suara Lapangan
                                      </span>
                                      <span className='text-xs font-mono text-muted-foreground ml-auto'>
                                        {evDuration}
                                      </span>
                                    </div>
                                  )}

                                  {evDesc && (
                                    <p className='text-xs text-foreground/80 italic bg-background/60 p-2 rounded-lg border border-border/40'>
                                      "{evDesc}"
                                    </p>
                                  )}

                                  {evPreview && (
                                    <div className='mt-1 overflow-hidden rounded-xl border border-border/60 max-w-xs sm:max-w-sm'>
                                      <img
                                        src={evPreview}
                                        alt='Evidence'
                                        className='h-36 sm:h-44 w-full object-cover hover:scale-105 transition-transform duration-300'
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </CardContent>
                        </Card>
                      ))}

                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => setActivityDrawerOpen(true)}
                        className='h-10 w-full gap-1.5 rounded-xl border-dashed border-primary/40 bg-primary/5 text-xs font-semibold text-primary shadow-none hover:bg-primary/10 cursor-pointer'
                      >
                        <Plus className='size-3.5' />
                        Tambah Aktivitas
                      </Button>
                    </>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* 4. Mobile Bottom CTA: Tentukan Hasil Negosiasi (Hidden on Desktop) */}
          <div className='order-4 lg:hidden pt-2 pb-2'>
            <Button
              type='button'
              onClick={() => setNegotiationDrawerOpen(true)}
              className='h-11 w-full rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer'
            >
              Tentukan Hasil Negosiasi
            </Button>
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

      {/* Drawer: Tentukan Hasil Negosiasi */}
      <Drawer
        open={negotiationDrawerOpen}
        onOpenChange={setNegotiationDrawerOpen}
        showSwipeHandle
      >
        <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full sm:max-w-lg max-h-[92dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
          <DrawerHeader className='shrink-0 px-5 pt-2 pb-2 text-left border-b border-border/60 bg-card'>
            <DrawerTitle className='text-base font-bold text-foreground'>
              Tentukan Hasil Negosiasi
            </DrawerTitle>
          </DrawerHeader>
          <div className='flex flex-col gap-2.5 px-5 py-3 pb-6'>
            <Button
              type='button'
              onClick={() => handleNegotiationResult('negosiasi')}
              className='h-11 w-full rounded-xl bg-primary text-xs font-semibold text-primary-foreground cursor-pointer'
            >
              Pindahkan ke Tahap Negosiasi
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleNegotiationResult('won')}
              className='h-11 w-full rounded-xl border-emerald-500/40 bg-emerald-500/10 text-xs font-semibold text-emerald-700 hover:bg-emerald-500/15 cursor-pointer'
            >
              Menang (WON) — Masuk ke Tahap Selesai
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleNegotiationResult('lost')}
              className='h-11 w-full rounded-xl border-rose-500/40 bg-rose-500/10 text-xs font-semibold text-rose-600 hover:bg-rose-500/15 cursor-pointer'
            >
              Kalah (LOST) — Tutup Tiket
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

