'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Calendar,
    Info,
  Trash2,
  Upload,
} from 'lucide-react';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from '@/components/ui/attachment';
import { FileType } from '@/components/reui/file-type';
import { usePelangganStore } from '@/lib/pelanggan-store';
import { useKanbanStore } from '@/lib/kanban-store';
import { TiketPrioritas, TiketWithDetails } from '@/types/ticket.types';
import { PRIORITY_CONFIG, PRIORITY_ORDER } from '@/constants/kanban-constants';
import { NativeSelect } from '@/components/ui/native-select';
import { cn, formatNumberInput } from '@/lib/utils';

interface ProspekFormViewProps {
  mode: 'create' | 'edit';
  basePath: string;
  initialStageId?: string;
  ticket?: TiketWithDetails;
}

export function ProspekFormView({
  mode,
  basePath,
  initialStageId = 'prospek',
  ticket,
}: ProspekFormViewProps) {
  const router = useRouter();
  const { pelangganList } = usePelangganStore();
  const { addTicket, updateTicket } = useKanbanStore();

  const [judul, setJudul] = React.useState(ticket?.judul ?? '');
  const [selectedOutletId, setSelectedOutletId] = React.useState(
    ticket?.id_pelanggan ?? '',
  );
  const [selectedKontakId, setSelectedKontakId] = React.useState(
    ticket?.id_kontak ?? '',
  );
  const [estimasiDisplay, setEstimasiDisplay] = React.useState(
    ticket?.estimasi_nilai ? formatNumberInput(ticket.estimasi_nilai) : '',
  );
  const [targetClosing, setTargetClosing] = React.useState(
    ticket?.closing_full_label
      ? ticket.closing_full_label
      : ticket?.estimasi_closing
        ? String(ticket.estimasi_closing)
        : '',
  );
  const [prioritas, setPrioritas] = React.useState<TiketPrioritas>(
    ticket?.prioritas ?? 'tinggi',
  );
  const [filePenawaran, setFilePenawaran] = React.useState<{
    name: string;
    size: string;
  } | null>(
    ticket?.file_penawaran ??
      (mode === 'edit' ? { name: 'penawaran.pdf', size: '731 KB' } : null),
  );
  const [submitted, setSubmitted] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const selectedOutlet = React.useMemo(
    () => pelangganList.find((p) => p.id_pelanggan === selectedOutletId),
    [pelangganList, selectedOutletId],
  );

  const kontakOptions = selectedOutlet?.kontak_list ?? [];

  React.useEffect(() => {
    if (selectedOutlet && kontakOptions.length > 0 && !selectedKontakId) {
      setSelectedKontakId(kontakOptions[0].id_kontak);
    }
  }, [selectedOutlet, kontakOptions, selectedKontakId]);

  const errors = {
    judul: submitted && !judul.trim() ? 'Judul tiket wajib diisi' : '',
    outlet:
      submitted && !selectedOutletId ? 'Pilih pelanggan terlebih dahulu' : '',
  };

  const errorCount = (errors.judul ? 1 : 0) + (errors.outlet ? 1 : 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const kb = Math.max(1, Math.round(file.size / 1024));
    setFilePenawaran({
      name: file.name,
      size: `${kb} KB`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!judul.trim() || !selectedOutletId) {
      return;
    }

    const numericValue =
      Number(estimasiDisplay.replace(/\D/g, '')) || 50_000_000;
    const chosenKontak = kontakOptions.find(
      (k) => k.id_kontak === selectedKontakId,
    );

    if (mode === 'edit' && ticket) {
      updateTicket(ticket.id_tiket, {
        judul: judul.trim(),
        id_pelanggan: selectedOutletId,
        nama_faskes: selectedOutlet?.nama_faskes ?? ticket.nama_faskes,
        id_kontak: chosenKontak?.id_kontak ?? ticket.id_kontak,
        nama_pic: chosenKontak?.nama ?? ticket.nama_pic,
        jabatan_pic: chosenKontak?.jabatan ?? ticket.jabatan_pic,
        no_telp_pic: chosenKontak?.no_telp ?? ticket.no_telp_pic,
        estimasi_nilai: numericValue,
        estimasi_closing: targetClosing || '2026-12-05',
        closing_full_label: targetClosing || '05 Des 2026',
        closing_short_label: (targetClosing || '05 Des').slice(0, 6),
        prioritas,
        file_penawaran: filePenawaran,
      });
      router.push(`${basePath}/${ticket.id_tiket}`);
      return;
    }

    const randomNum = Math.floor(130 + Math.random() * 70);
    const newId = `tkt-0${randomNum}-${Date.now().toString().slice(-3)}`;
    const newTicket: TiketWithDetails = {
      id_tiket: newId,
      kode_tiket: `TKT-0${randomNum}`,
      id_pelanggan: selectedOutletId,
      id_user: 'usr-1',
      id_tahap: initialStageId || 'prospek',
      id_kontak: chosenKontak?.id_kontak ?? null,
      judul: judul.trim(),
      nama_faskes: selectedOutlet?.nama_faskes ?? 'RS Harapan Sehat',
      nama_pic: chosenKontak?.nama ?? 'Bpk. Hendra Wijaya',
      jabatan_pic: chosenKontak?.jabatan ?? 'Direktur Umum',
      no_telp_pic: chosenKontak?.no_telp ?? '0812-3456-7890',
      nama_sales: 'Rina Putri',
      inisial_sales: 'MT',
      estimasi_nilai: numericValue,
      estimasi_closing: targetClosing || '2026-11-12',
      closing_short_label: '12 Nov',
      closing_full_label: targetClosing || '12 Nov 2026',
      status: 'open',
      kebutuhan_pelanggan: judul.trim(),
      prioritas,
      posisi: 1,
      tanggal_penawaran_awal: new Date().toISOString(),
      tanggal_closing: null,
      alasan_lost: null,
      file_penawaran: filePenawaran,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      aktivitas_list: [],
      riwayat_list: [],
    };

    addTicket(newTicket);
    router.push(basePath);
  };

  return (
    <div className='mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-card'>
      <SubpageHeader
        title={mode === 'create' ? 'Buat Prospek' : 'Edit Prospek'}
        onBack={() =>
          router.push(
            mode === 'edit' && ticket
              ? `${basePath}/${ticket.id_tiket}`
              : basePath,
          )
        }
      />

      <form
        onSubmit={handleSubmit}
        className='flex flex-1 flex-col justify-between gap-5 px-5 py-4'
      >
        <div className='flex flex-col gap-4'>
          {/* Validation Error Alert Banner */}
          {errorCount > 0 ? (
            <Alert className='flex items-start gap-2.5 rounded-xl border-destructive/30 bg-destructive/8 px-3.5 py-3 text-destructive'>
              <AlertTriangle className='mt-0.5 size-4 shrink-0 text-destructive' />
              <AlertDescription className='text-xs font-medium text-destructive'>
                Ada {errorCount} isian yang perlu diperbaiki sebelum tiket
                disimpan.
              </AlertDescription>
            </Alert>
          ) : (
            mode === 'create' && (
              <Alert className='flex items-start gap-2.5 rounded-xl border-primary/20 bg-primary/8 px-3.5 py-3 text-primary'>
                <Info className='mt-0.5 size-4 shrink-0 text-primary' />
                <AlertDescription className='text-xs font-medium text-primary'>
                  Tiket baru otomatis berstatus OPEN dan masuk ke tahap Prospek.
                </AlertDescription>
              </Alert>
            )
          )}

          {/* ID Tiket (Only in Edit Prospek) */}
          {mode === 'edit' && (
            <div className='flex flex-col gap-1.5'>
              <Label className='text-xs font-semibold text-foreground'>
                ID Tiket <span className='text-destructive'>*</span>
              </Label>
              <Input
                type='text'
                value={ticket?.kode_tiket ?? 'TKT-0142'}
                disabled
                className='h-10 rounded-xl border-border bg-muted px-3.5 text-xs font-medium text-muted-foreground'
              />
            </div>
          )}

          {/* Judul */}
          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs font-semibold text-foreground'>
              Judul <span className='text-destructive'>*</span>
            </Label>
            <Input
              type='text'
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder='Default'
              className={cn(
                'h-10 rounded-xl bg-card px-3.5 text-xs shadow-none',
                errors.judul
                  ? 'border-destructive focus-visible:border-destructive'
                  : 'border-primary/40 focus-visible:border-primary',
              )}
            />
            {errors.judul && (
              <p className='flex items-center gap-1.5 text-[11px] font-medium text-destructive'>
                <AlertTriangle className='size-3 shrink-0' />
                {errors.judul}
              </p>
            )}
          </div>

          {/* Outlet */}
          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs font-semibold text-foreground'>
              Outlet <span className='text-destructive'>*</span>
            </Label>
            <NativeSelect
              value={selectedOutletId}
              onChange={(e) => {
                setSelectedOutletId(e.target.value);
                setSelectedKontakId('');
              }}
              className={errors.outlet ? 'border-destructive text-muted-foreground' : undefined}
            >
              <option value=''>Default</option>
              {pelangganList.map((outlet) => (
                <option key={outlet.id_pelanggan} value={outlet.id_pelanggan}>
                  {outlet.nama_faskes}
                </option>
              ))}
            </NativeSelect>
            {errors.outlet ? (
              <p className='flex items-center gap-1.5 text-[11px] font-medium text-destructive'>
                <AlertTriangle className='size-3 shrink-0' />
                {errors.outlet}
              </p>
            ) : (
              <span className='text-[10px] text-muted-foreground'>
                Sesuai data registrasi master pelanggan Jawa Barat
              </span>
            )}
          </div>

          {/* PIC Outlet */}
          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs font-semibold text-foreground'>
              PIC Outlet <span className='text-destructive'>*</span>
            </Label>
            <NativeSelect
              value={selectedKontakId}
              disabled={!selectedOutletId}
              onChange={(e) => setSelectedKontakId(e.target.value)}
            >
              {!selectedOutletId ? (
                <option value=''>Disable</option>
              ) : kontakOptions.length === 0 ? (
                <option value=''>Belum ada kontak terdaftar</option>
              ) : (
                kontakOptions.map((k) => (
                  <option key={k.id_kontak} value={k.id_kontak}>
                    {k.nama} • {k.jabatan}
                  </option>
                ))
              )}
            </NativeSelect>
            <span className='text-[10px] text-muted-foreground'>
              Daftar kontak muncul setelah pelanggan dipilih
            </span>
          </div>

          {/* Estimasi Nilai Penawaran */}
          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs font-semibold text-foreground'>
              Estimasi Nilai Penawaran{' '}
              <span className='text-destructive'>*</span>
            </Label>
            <InputGroup className='h-10 rounded-xl border-primary/40 bg-card shadow-none'>
              <InputGroupAddon
                align='inline-start'
                className='gap-2.5 pl-3.5 pr-1 text-xs font-semibold text-muted-foreground'
              >
                <span>RP</span>
                <Separator orientation='vertical' className='h-4' />
              </InputGroupAddon>
              <InputGroupInput
                type='text'
                value={estimasiDisplay}
                onChange={(e) =>
                  setEstimasiDisplay(formatNumberInput(e.target.value))
                }
                placeholder='Default'
                className='text-xs font-medium text-foreground'
              />
            </InputGroup>
          </div>

          {/* Target Tanggal Closing */}
          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs font-semibold text-foreground'>
              Target Tanggal Closing <span className='text-destructive'>*</span>
            </Label>
            <InputGroup className='h-10 rounded-xl border-primary/40 bg-card shadow-none'>
              <InputGroupAddon
                align='inline-start'
                className='gap-2.5 pl-3.5 pr-1 text-muted-foreground'
              >
                <Calendar className='size-4' />
                <Separator orientation='vertical' className='h-4' />
              </InputGroupAddon>
              <InputGroupInput
                type='text'
                value={targetClosing}
                onChange={(e) => setTargetClosing(e.target.value)}
                placeholder='Default'
                className='text-xs font-medium text-foreground'
              />
            </InputGroup>
            <span className='text-[10px] text-muted-foreground'>
              Baseline SLA proyeksi Q4 Tahun Anggaran 2024
            </span>
          </div>

          {/* Tingkat Prioritas Prospek */}
          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs font-semibold text-foreground'>
              Tingkat Prioritas Prospek{' '}
              <span className='text-destructive'>*</span>
            </Label>
            <div className='grid grid-cols-3 gap-2.5'>
              {PRIORITY_ORDER.map((id) => {
                const option = PRIORITY_CONFIG[id];
                const isSelected = prioritas === id;
                return (
                  <Button
                    key={id}
                    type='button'
                    variant='outline'
                    onClick={() => setPrioritas(id)}
                    className={cn(
                      'h-10 gap-2 rounded-xl text-xs shadow-none transition-all cursor-pointer',
                      isSelected
                        ? option.activeClass
                        : 'border-border bg-card font-medium text-foreground hover:bg-muted/40',
                    )}
                  >
                    <span
                      className={cn('size-2 rounded-full', option.dotClass)}
                    />
                    {option.formLabel}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Upload File Penawaran */}
          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs font-semibold text-foreground'>
              Upload File Penawaran
            </Label>
            <input
              ref={fileInputRef}
              type='file'
              accept='.pdf,.doc,.docx'
              onChange={handleFileChange}
              className='hidden'
            />

            {filePenawaran ? (
              <Attachment className='w-full rounded-xl border-border bg-card p-1'>
                <AttachmentMedia className='bg-rose-500/10'>
                  <FileType type='pdf' size='xs' />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle className='text-xs font-semibold text-foreground'>
                    {filePenawaran.name}
                  </AttachmentTitle>
                  <AttachmentDescription className='text-[11px] text-muted-foreground'>
                    {filePenawaran.size}
                  </AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions className='pr-2'>
                  <AttachmentAction
                    type='button'
                    onClick={() => setFilePenawaran(null)}
                    className='text-muted-foreground hover:text-destructive cursor-pointer'
                    aria-label='Hapus file penawaran'
                  >
                    <Trash2 className='size-4' />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            ) : (
              <Button
                type='button'
                variant='outline'
                onClick={() => fileInputRef.current?.click()}
                className='h-12 w-full gap-2 rounded-xl border-dashed border-border bg-muted/20 text-xs font-medium text-muted-foreground shadow-none hover:border-primary/40 hover:bg-primary/5 hover:text-primary cursor-pointer'
              >
                <Upload className='size-4' />
                Unggah dokumen penawaran (.PDF)
              </Button>
            )}
          </div>
        </div>

        {/* Bottom Actions: Batal & Simpan */}
        <div className='grid grid-cols-2 gap-3 pt-4 pb-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() =>
              router.push(
                mode === 'edit' && ticket
                  ? `${basePath}/${ticket.id_tiket}`
                  : basePath,
              )
            }
            className='h-11 rounded-xl border-border bg-card text-xs font-semibold text-foreground shadow-none cursor-pointer'
          >
            Batal
          </Button>
          <Button
            type='submit'
            className='h-11 rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer'
          >
            Simpan
          </Button>
        </div>
      </form>
    </div>
  );
}

