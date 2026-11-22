'use client';

import * as React from 'react';
import { Loader2, X } from 'lucide-react';
import { TriangleExclamation } from '@gravity-ui/icons';
import { Modal, toast } from '@heroui/react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUpdateAktivitasMutation } from '@/hooks/queries/use-kanban-query';
import { getErrorMessage } from '@/lib/axios';
import { cn } from '@/lib/utils';
import { AKTIVITAS_STAGE_CONFIG } from '@/constants/kanban-constants';
import type { AktivitasWithDetails } from '@/types/ticket.types';
import { Badge } from '@/components/ui/badge';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { StageTextAreaInput } from '../../../stage-drawer/inputs';

export interface ProspekEditAktivitasModalProps {
  idTiket: string;
  aktivitas: AktivitasWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function useProspekEditAktivitasForm({
  idTiket,
  aktivitas,
  onOpenChange,
}: Omit<ProspekEditAktivitasModalProps, 'open'>) {
  const [catatan, setCatatan] = React.useState(aktivitas?.catatan ?? '');
  const [catatanTouched, setCatatanTouched] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const updateAktivitasMutation = useUpdateAktivitasMutation(idTiket);

  const catatanTrimmed = catatan.trim();
  const isCatatanValid = catatanTrimmed.length >= 5 && catatanTrimmed.length <= 1000;
  const catatanError =
    catatanTouched && !isCatatanValid
      ? catatanTrimmed.length === 0
        ? 'Catatan wajib diisi'
        : catatanTrimmed.length > 1000
          ? 'Catatan maksimal 1000 karakter'
          : 'Catatan minimal 5 karakter'
      : undefined;

  const stageConfig = aktivitas
    ? AKTIVITAS_STAGE_CONFIG[aktivitas.jenis_kegiatan] || {
        label: aktivitas.jenis_kegiatan,
        badgeClass: 'bg-primary/10 text-primary border-primary/20',
        dotColor: '#2563EB',
      }
    : null;

  const hasAttachment = Boolean(
    aktivitas &&
      ((Array.isArray(aktivitas.evidence)
        ? aktivitas.evidence.length > 0
        : Boolean(aktivitas.evidence)) ||
        (Array.isArray(aktivitas.bukti_kunjungan)
          ? aktivitas.bukti_kunjungan.length > 0
          : Boolean(aktivitas.bukti_kunjungan))),
  );

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setServerError(null);
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatatanTouched(true);

    if (!aktivitas || !isCatatanValid) return;

    try {
      setServerError(null);
      await updateAktivitasMutation.mutateAsync({
        id: aktivitas.id_aktivitas,
        data: {
          catatan: catatanTrimmed,
        },
      });

      toast.success('Aktivitas Berhasil Diperbarui', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            Perubahan catatan aktivitas telah disimpan.
          </span>
        ),
      });
      onOpenChange(false);
    } catch (err) {
      const msg = getErrorMessage(err);
      setServerError(msg || 'Gagal memperbarui aktivitas.');
      toast.danger('Gagal Memperbarui Aktivitas', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            {msg || 'Terjadi kesalahan sistem.'}
          </span>
        ),
      });
    }
  };

  return {
    catatan,
    setCatatan,
    catatanTouched,
    setCatatanTouched,
    catatanError,
    serverError,
    stageConfig,
    hasAttachment,
    isPending: updateAktivitasMutation.isPending,
    handleSubmit,
    handleOpenChange,
  };
}

type EditAktivitasFormState = ReturnType<typeof useProspekEditAktivitasForm>;

function EditAktivitasFields({ formState }: { formState: EditAktivitasFormState }) {
  return (
    <div className='flex flex-col gap-4 pt-1'>
      {formState.serverError && (
        <div className='flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-destructive'>
          <TriangleExclamation className='size-4 shrink-0 mt-0.5' />
          <p className='text-xs font-medium leading-relaxed'>{formState.serverError}</p>
        </div>
      )}

      <div className='flex flex-col gap-1'>
        <StageTextAreaInput
          label='Catatan & Pembahasan'
          isRequired
          rows={4}
          value={formState.catatan}
          onChange={(val) => {
            formState.setCatatan(val);
            if (!formState.catatanTouched) {
              formState.setCatatanTouched(true);
            }
          }}
          isInvalid={Boolean(formState.catatanError)}
          errorMessage={formState.catatanError}
          placeholder='Tuliskan catatan aktivitas (minimal 5 karakter)...'
        />
        <div className='flex justify-end text-[10px] text-muted-foreground pr-1'>
          {formState.catatan.length}/1000 Characters
        </div>
        {formState.hasAttachment && (
          <p className='text-[11px] text-muted-foreground pt-1'>
            Lampiran berkas bukti yang sudah diunggah tetap dipertahankan.
          </p>
        )}
      </div>
    </div>
  );
}

function EditAktivitasFooterActions({
  onCancel,
  isPending,
}: {
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className='grid grid-cols-2 gap-3 w-full sm:flex sm:w-auto sm:justify-end sm:items-center sm:gap-2.5'>
      <Button
        type='button'
        variant='outline'
        onClick={onCancel}
        disabled={isPending}
        className='h-10 sm:h-9 w-full sm:w-28 rounded-md text-xs font-semibold cursor-pointer border-border bg-card shadow-none hover:bg-muted/50'
      >
        Batal
      </Button>
      <Button
        type='submit'
        disabled={isPending}
        className='h-10 sm:h-9 w-full sm:w-auto sm:min-w-[140px] sm:px-5 rounded-md text-xs font-semibold text-white shadow-sm bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary transition-all cursor-pointer disabled:opacity-60'
      >
        {isPending && <Loader2 className='mr-1.5 size-3.5 animate-spin' />}
        <span>{isPending ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
      </Button>
    </div>
  );
}

function ProspekEditAktivitasModalContent(props: ProspekEditAktivitasModalProps) {
  const isMobile = useIsMobile();
  const formState = useProspekEditAktivitasForm(props);

  const stageBadge = formState.stageConfig ? (
    <Badge
      variant='outline'
      className={cn(
        'h-5 gap-1.5 rounded-full border px-2.5 text-[10px] font-bold uppercase tracking-wider mb-0.5',
        formState.stageConfig.badgeClass,
      )}
    >
      <span
        className='size-1.5 rounded-full'
        style={{ backgroundColor: formState.stageConfig.dotColor }}
      />
      Aktivitas · {formState.stageConfig.label}
    </Badge>
  ) : null;

  if (isMobile) {
    return (
      <Drawer open={props.open} onOpenChange={formState.handleOpenChange} showSwipeHandle>
        <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full max-h-[92dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
          <DrawerHeader className='shrink-0 flex flex-row items-start justify-between px-5 pt-3 pb-2 text-left border-b border-border/60 bg-card'>
            <div className='flex flex-col gap-0.5 items-start'>
              {stageBadge}
              <DrawerTitle className='text-base font-bold text-foreground text-left'>
                Edit Aktivitas
              </DrawerTitle>
              <DrawerDescription className='text-xs sm:text-sm text-secondary-foreground text-left'>
                Perbarui catatan pembahasan aktivitas prospek ini.
              </DrawerDescription>
            </div>
            <DrawerClose
              render={
                <Button
                  type='button'
                  variant='ghost'
                  size='icon-sm'
                  className='size-8 rounded-md text-muted-foreground hover:bg-muted cursor-pointer'
                >
                  <X className='size-4' />
                </Button>
              }
            />
          </DrawerHeader>

          <form
            onSubmit={formState.handleSubmit}
            className='flex flex-col flex-1 min-h-0 overflow-hidden'
          >
            <div className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-5 py-4 pb-6'>
              <EditAktivitasFields formState={formState} />
            </div>

            <DrawerFooter className='sticky bottom-0 z-20 shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-md px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]'>
              <EditAktivitasFooterActions
                onCancel={() => formState.handleOpenChange(false)}
                isPending={formState.isPending}
              />
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal.Backdrop isOpen={props.open} onOpenChange={formState.handleOpenChange} variant='blur'>
      <Modal.Container>
        <Modal.Dialog className='sm:max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl p-0'>
          <Modal.CloseTrigger className='text-secondary-foreground' />
          <Modal.Header className='shrink-0 flex flex-col gap-0.5 px-6 pt-5 pb-3 border-b border-border/70 text-left items-start'>
            {stageBadge}
            <Modal.Heading className='text-base sm:text-lg font-bold text-foreground'>
              Edit Aktivitas
            </Modal.Heading>
            <p className='text-xs sm:text-sm text-secondary-foreground'>
              Perbarui catatan pembahasan aktivitas prospek ini.
            </p>
          </Modal.Header>

          <form
            onSubmit={formState.handleSubmit}
            className='flex flex-col flex-1 min-h-0 overflow-hidden'
          >
            <Modal.Body className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-6 py-4'>
              <EditAktivitasFields formState={formState} />
            </Modal.Body>

            <Modal.Footer className='sticky bottom-0 z-10 shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-md px-6 py-3 flex items-center justify-end gap-3'>
              <EditAktivitasFooterActions
                onCancel={() => formState.handleOpenChange(false)}
                isPending={formState.isPending}
              />
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

export function ProspekEditAktivitasModal(props: ProspekEditAktivitasModalProps) {
  return (
    <ProspekEditAktivitasModalContent
      key={`${props.open ? 'open' : 'closed'}-${props.aktivitas?.id_aktivitas ?? 'none'}`}
      {...props}
    />
  );
}
