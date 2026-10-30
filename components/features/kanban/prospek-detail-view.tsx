'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Calendar,
  Check,
  CircleDot,
  LayoutGrid,
  Pencil,
  Plus,
  Camera,
  Mic,
  FileText,
  AlignLeft,
  Paperclip,
  Volume2,
} from 'lucide-react';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { PRIORITY_CONFIG, PROGRES_TAHAP_STEPS } from '@/constants/kanban-constants';
import { useKanbanStore } from '@/lib/kanban-store';
import { TiketWithDetails } from '@/types/ticket.types';
import { cn, formatFullRupiah } from '@/lib/utils';

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

  const [petugasName, setPetugasName] = React.useState('Dimas Arya');
  const [picDitemui, setPicDitemui] = React.useState(
    ticket.nama_pic || 'dr. Hendra Sp.PD-KGH',
  );
  const [catatanAktivitas, setCatatanAktivitas] = React.useState(
    'Presentasi spesifikasi mesin hemodialisa generasi terbaru. Tim teknis RS sangat tertarik dengan fitur ultrafiltrasi presisi tinggi. Memerlukan simulasi penawaran resmi dan agenda demo kalibrasi.',
  );

  const stageObj = stages.find((s) => s.id_tahap === ticket.id_tahap);
  const stageLabel = stageObj?.nama_tahap ?? 'Penawaran';

  const currentStepIdx = Math.max(
    0,
    PROGRES_TAHAP_STEPS.findIndex((s) => s.id === ticket.id_tahap),
  );

  const priority = PRIORITY_CONFIG[ticket.prioritas];

  const aktivitasList = ticket.aktivitas_list ?? [];
  const riwayatList = ticket.riwayat_list ?? [];

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catatanAktivitas.trim()) return;

    addActivity(ticket.id_tiket, {
      id_aktivitas: `akt-${Date.now()}`,
      id_user: 'usr-2',
      id_tiket: ticket.id_tiket,
      tanggal: new Date().toISOString(),
      waktu_label: '24 Okt • 10:15 WIB',
      nama_petugas: petugasName || 'Dimas Arya',
      pic_ditemui: picDitemui || 'dr. Hendra Sp.PD-KGH',
      jenis_kegiatan: 'kunjungan',
      catatan: catatanAktivitas.trim(),
      jadwal_follow_up: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setActivityDrawerOpen(false);
  };

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
    <div className='mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-muted/25'>
      <SubpageHeader
        title='Detail Prospek'
        onBack={() => router.push(basePath)}
        rightAction={
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            onClick={() => router.push(`${basePath}/${ticket.id_tiket}/edit`)}
            className='size-8 rounded-full text-foreground hover:bg-muted cursor-pointer'
            aria-label='Edit Prospek'
          >
            <Pencil className='size-4' />
          </Button>
        }
      />

      <div className='flex flex-1 flex-col justify-between gap-4 px-4 py-4'>
        <div className='flex flex-col gap-3.5'>
          {/* Ticket Summary Card */}
          <Card className='rounded-2xl border-border/70 bg-card py-0 shadow-xs ring-0'>
            <CardContent className='flex flex-col gap-3 p-4'>
              <div className='flex flex-col gap-1'>
                <span className='text-[11px] font-normal text-muted-foreground'>
                  {ticket.kode_tiket}
                </span>
                <h2 className='text-base font-bold text-foreground'>
                  {ticket.judul}
                </h2>
                <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                  <Building2 className='size-3.5 shrink-0' />
                  <span>{ticket.nama_faskes}</span>
                </div>
              </div>

              <Separator className='bg-border/60' />

              <div className='flex items-center justify-between gap-2'>
                <div className='flex flex-col gap-0.5'>
                  <span className='text-[11px] text-muted-foreground'>
                    Estimasi Revenue
                  </span>
                  <span className='text-base font-bold text-primary'>
                    {formatFullRupiah(ticket.estimasi_nilai)}
                  </span>
                </div>

                <div className='flex flex-col items-end gap-0.5'>
                  <span className='text-[11px] text-muted-foreground'>
                    Estimasi Closing
                  </span>
                  <div className='flex items-center gap-1.5 text-xs font-medium text-foreground'>
                    <Calendar className='size-3.5 text-muted-foreground' />
                    <span>{ticket.closing_full_label || '31 Okt 2026'}</span>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-2 pt-0.5'>
                <Badge className='h-5 rounded-md border-0 bg-violet-600 px-2.5 text-[11px] font-medium text-white'>
                  {stageLabel}
                </Badge>
                <Badge
                  className={cn(
                    'h-5 gap-1.5 rounded-full px-2.5 text-[11px] font-semibold',
                    priority.badgeClass,
                  )}
                >
                  <span className={cn('size-1.5 rounded-full', priority.dotClass)} />
                  {priority.label}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Progres Tahap Card */}
          <Card className='rounded-2xl border-border/70 bg-card py-0 shadow-xs ring-0'>
            <CardContent className='flex flex-col gap-3 p-4'>
              <span className='text-xs font-semibold text-foreground'>
                Progres tahap
              </span>

              <div className='flex items-center justify-between px-1'>
                {PROGRES_TAHAP_STEPS.map((step, index) => {
                  const isCompleted = index <= currentStepIdx;
                  const isLast = index === PROGRES_TAHAP_STEPS.length - 1;

                  return (
                    <React.Fragment key={step.id}>
                      <div className='flex flex-col items-center gap-1.5'>
                        <div
                          className={cn(
                            'flex size-6 items-center justify-center rounded-full text-xs transition-colors',
                            isCompleted
                              ? 'bg-primary text-primary-foreground'
                              : 'border border-muted-foreground/40 bg-card text-muted-foreground',
                          )}
                        >
                          {isCompleted ? (
                            <Check className='size-3.5 stroke-[2.5]' />
                          ) : (
                            <CircleDot className='size-3.5' />
                          )}
                        </div>
                        <span
                          className={cn(
                            'text-[10px] font-medium',
                            isCompleted
                              ? 'text-foreground'
                              : 'text-muted-foreground',
                          )}
                        >
                          {step.label}
                        </span>
                      </div>

                      {!isLast && (
                        <div
                          className={cn(
                            'mb-4 h-0.5 flex-1 mx-1.5 rounded-full',
                            index < currentStepIdx
                              ? 'bg-primary'
                              : 'bg-border',
                          )}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tabs Navigation (`Info` | `Riwayat` | `Aktivitas`) */}
          <div className='grid grid-cols-3 border-b border-border bg-transparent'>
            {(
              [
                { id: 'info', label: 'Info' },
                { id: 'riwayat', label: 'Riwayat' },
                { id: 'aktivitas', label: 'Aktivitas' },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type='button'
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'relative py-2.5 text-center text-xs font-semibold transition-colors cursor-pointer',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tab.label}
                  {isActive && (
                    <span className='absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-primary' />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content: INFO */}
          {activeTab === 'info' && (
            <Card className='rounded-2xl border-border/70 bg-card py-0 shadow-xs ring-0'>
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
                  },
                  {
                    label: 'Sales PIC',
                    value: ticket.nama_sales || 'Rina Putri',
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className='flex items-center justify-between gap-4 px-4 py-3.5 text-xs'
                  >
                    <span className='text-muted-foreground'>{row.label}</span>
                    <span className='text-right font-semibold text-foreground'>
                      {row.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Tab Content: RIWAYAT */}
          {activeTab === 'riwayat' && (
            <Card className='rounded-2xl border-border/70 bg-card py-0 shadow-xs ring-0'>
              <CardContent className='flex flex-col gap-3 p-4'>
                {riwayatList.length === 0 ? (
                  <p className='py-6 text-center text-xs text-muted-foreground'>
                    Belum ada riwayat perpindahan tahap.
                  </p>
                ) : (
                  riwayatList.map((item) => (
                    <div
                      key={item.id_riwayat}
                      className='flex items-start justify-between gap-3 border-b border-border/50 pb-3 last:border-b-0 last:pb-0'
                    >
                      <div className='flex flex-col gap-0.5'>
                        <span className='text-xs font-semibold text-foreground'>
                          {item.nama_tahap_asal
                            ? `${item.nama_tahap_asal} → ${item.nama_tahap_tujuan}`
                            : `Tiket dibuat di tahap ${item.nama_tahap_tujuan}`}
                        </span>
                        <span className='text-[11px] text-muted-foreground'>
                          Oleh {item.nama_user}
                        </span>
                      </div>
                      <span className='text-[11px] text-muted-foreground'>
                        {item.waktu_label}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {/* Tab Content: AKTIVITAS (Matches Screen 5 Empty State & Screen 6 Populated Card) */}
          {activeTab === 'aktivitas' && (
            <div className='flex flex-col gap-3'>
              {aktivitasList.length === 0 ? (
                <Card className='rounded-2xl border-border/70 bg-card py-0 shadow-xs ring-0'>
                  <CardContent className='flex flex-col items-center justify-center gap-3 px-6 py-10 text-center'>
                    <div className='flex size-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500'>
                      <LayoutGrid className='size-5' />
                    </div>
                    <div className='flex flex-col gap-1'>
                      <h3 className='text-sm font-bold text-foreground'>
                        Belum ada data aktivitas
                      </h3>
                      <p className='text-[11px] text-muted-foreground'>
                        Ketuk tombol dibawah untuk menambahkan aktivitas.
                      </p>
                    </div>
                    <Button
                      type='button'
                      onClick={() => setActivityDrawerOpen(true)}
                      className='mt-1 h-9 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer'
                    >
                      Tambah Aktivitas
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {aktivitasList.map((akt) => (
                    <Card
                      key={akt.id_aktivitas}
                      className='rounded-2xl border-border/70 bg-card py-0 shadow-xs ring-0'
                    >
                      <CardContent className='flex flex-col gap-3 p-4'>
                        <div className='flex items-center justify-between gap-2'>
                          <span className='text-xs font-bold tracking-wide text-primary uppercase'>
                            {akt.jenis_kegiatan}
                          </span>
                          <span className='text-[11px] text-muted-foreground'>
                            {akt.waktu_label}
                          </span>
                        </div>

                        <div className='flex flex-col gap-1.5 text-xs'>
                          <div className='flex items-center gap-3'>
                            <span className='w-24 text-muted-foreground'>
                              Petugas:
                            </span>
                            <span className='font-semibold text-foreground'>
                              {akt.nama_petugas}
                            </span>
                          </div>
                          <div className='flex items-center gap-3'>
                            <span className='w-24 text-muted-foreground'>
                              PIC Ditemui:
                            </span>
                            <span className='font-semibold text-foreground'>
                              {akt.pic_ditemui}
                            </span>
                          </div>
                        </div>

                        <Separator className='bg-border/60' />

                        <div className='flex flex-col gap-1'>
                          <span className='text-xs font-bold text-foreground'>
                            Catatan & Pembahasan:
                          </span>
                          <p className='text-xs leading-relaxed text-muted-foreground'>
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
                            <div className='mt-2 flex flex-col gap-1.5 rounded-xl border border-primary/20 bg-primary/5 p-2.5 text-xs'>
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-1.5 font-semibold text-primary text-[11px]'>
                                  {evType === 'foto' && <Camera className='size-3.5' />}
                                  {evType === 'audio' && <Mic className='size-3.5' />}
                                  {evType === 'dokumen' && <FileText className='size-3.5' />}
                                  {evType === 'teks' && <AlignLeft className='size-3.5' />}
                                  <span>File Bukti ({evType.toUpperCase()})</span>
                                </div>
                                <span className='text-[10px] text-muted-foreground'>
                                  {akt.evidence.waktu_upload || akt.waktu_label}
                                </span>
                              </div>

                              {evFile && (
                                <div className='flex items-center gap-1.5 text-[11px] text-foreground font-medium'>
                                  <Paperclip className='size-3 text-muted-foreground' />
                                  <span className='truncate'>{evFile}</span>
                                  {evSize && (
                                    <span className='text-[10px] text-muted-foreground'>
                                      ({evSize})
                                    </span>
                                  )}
                                </div>
                              )}

                              {evDuration && (
                                <div className='flex items-center gap-2 rounded-lg bg-background/80 px-2.5 py-1.5 border border-border/50'>
                                  <Volume2 className='size-3.5 text-primary' />
                                  <span className='text-[11px] font-semibold text-foreground'>
                                    Rekaman Suara Lapangan
                                  </span>
                                  <span className='text-[10px] font-mono text-muted-foreground ml-auto'>
                                    {evDuration}
                                  </span>
                                </div>
                              )}

                              {evDesc && (
                                <p className='text-[11px] text-foreground/80 italic bg-background/50 p-1.5 rounded-lg border border-border/40'>
                                  "{evDesc}"
                                </p>
                              )}

                              {evPreview && (
                                <div className='mt-1 overflow-hidden rounded-lg border border-border/60 max-w-[180px]'>
                                  <img
                                    src={evPreview}
                                    alt='Evidence'
                                    className='h-24 w-full object-cover'
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
                    className='h-9 w-full gap-1.5 rounded-xl border-dashed border-primary/40 bg-primary/5 text-xs font-semibold text-primary shadow-none hover:bg-primary/10 cursor-pointer'
                  >
                    <Plus className='size-3.5' />
                    Tambah Aktivitas
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Sticky Bottom CTA: Tentukan Hasil Negosiasi */}
        <div className='pt-4 pb-2'>
          <Button
            type='button'
            onClick={() => setNegotiationDrawerOpen(true)}
            className='h-11 w-full rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer'
          >
            Tentukan Hasil Negosiasi
          </Button>
        </div>
      </div>

      {/* Drawer: Tambah Aktivitas */}
      <Drawer
        open={activityDrawerOpen}
        onOpenChange={setActivityDrawerOpen}
        showSwipeHandle
      >
        <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full sm:max-w-lg max-h-[92dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
          <DrawerHeader className='shrink-0 px-5 pt-2 pb-1 text-left border-b border-border/60 bg-card'>
            <DrawerTitle className='text-base font-bold text-foreground'>
              Tambah Aktivitas Kunjungan
            </DrawerTitle>
          </DrawerHeader>
          <form
            onSubmit={handleSaveActivity}
            className='flex flex-col gap-3.5 px-5 py-3'
          >
            <div className='flex flex-col gap-1.5'>
              <Label className='text-xs font-semibold'>Nama Petugas</Label>
              <Input
                value={petugasName}
                onChange={(e) => setPetugasName(e.target.value)}
                className='h-10 rounded-xl text-xs'
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label className='text-xs font-semibold'>PIC Ditemui</Label>
              <Input
                value={picDitemui}
                onChange={(e) => setPicDitemui(e.target.value)}
                className='h-10 rounded-xl text-xs'
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label className='text-xs font-semibold'>
                Catatan & Pembahasan
              </Label>
              <Textarea
                rows={4}
                value={catatanAktivitas}
                onChange={(e) => setCatatanAktivitas(e.target.value)}
                className='rounded-xl text-xs'
              />
            </div>
            <DrawerFooter className='grid grid-cols-2 gap-3 px-0 pt-2 pb-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setActivityDrawerOpen(false)}
                className='h-10 rounded-xl text-xs font-semibold cursor-pointer'
              >
                Batal
              </Button>
              <Button
                type='submit'
                className='h-10 rounded-xl bg-primary text-xs font-semibold text-primary-foreground cursor-pointer'
              >
                Simpan Aktivitas
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>

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

