'use client';

import * as React from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Modal, toast } from '@heroui/react';
import { z } from 'zod';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUpdatePelangganContactMutation } from '@/hooks/queries';
import { getErrorMessage } from '@/lib/axios';
import { createContactSchema } from '@/schemas/contact.schema';
import type { Kontak } from '@/types/contact.types';
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
import {
  PelangganAddPicFields,
  PelangganAddPicFooterActions,
  type PelangganAddPicFormState,
} from './pelanggan-add-pic-form';

type EditContactFormValues = z.infer<typeof createContactSchema>;

export interface PelangganEditPicModalProps {
  idPelanggan: string;
  contact: Kontak | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function usePelangganEditPicForm({
  idPelanggan,
  contact,
  open,
  onOpenChange,
}: PelangganEditPicModalProps): PelangganAddPicFormState {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const updateContactMutation = useUpdatePelangganContactMutation(idPelanggan);

  const form = useForm<EditContactFormValues>({
    resolver: zodResolver(createContactSchema) as Resolver<EditContactFormValues>,
    defaultValues: {
      id_pelanggan: idPelanggan,
      nama: contact?.nama ?? '',
      jabatan: contact?.jabatan ?? '',
      no_telp: contact?.no_telp ?? '',
      email: contact?.email ?? '',
      kategori_peran: contact?.kategori_peran ?? '',
    },
    mode: 'onTouched',
  });

  React.useEffect(() => {
    if (open && contact) {
      form.reset({
        id_pelanggan: idPelanggan,
        nama: contact.nama,
        jabatan: contact.jabatan,
        no_telp: contact.no_telp,
        email: contact.email,
        kategori_peran: contact.kategori_peran ?? '',
      });
    }
  }, [open, contact, idPelanggan, form]);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setServerError(null);
    }
    onOpenChange(newOpen);
  };

  const onSubmit = async (values: EditContactFormValues) => {
    if (!contact) return;

    try {
      setServerError(null);
      const trimmedKategori = values.kategori_peran?.trim() ?? '';
      await updateContactMutation.mutateAsync({
        idKontak: contact.id_kontak,
        data: {
          nama: values.nama.trim(),
          jabatan: values.jabatan.trim(),
          no_telp: values.no_telp.trim(),
          email: values.email.trim(),
          kategori_peran: trimmedKategori || (contact.kategori_peran ? '' : undefined),
        },
      });

      toast.success('Kontak PIC berhasil diperbarui', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            Perubahan data kontak <strong>{values.nama.trim()}</strong> telah disimpan.
          </span>
        ),
      });
      onOpenChange(false);
    } catch (err) {
      const msg = getErrorMessage(err);
      setServerError(msg || 'Gagal memperbarui kontak PIC. Silakan coba lagi.');
      toast.danger('Gagal Memperbarui Kontak', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            {msg || 'Terjadi kesalahan sistem.'}
          </span>
        ),
      });
    }
  };

  return {
    form,
    serverError,
    isPending: updateContactMutation.isPending,
    onSubmit: form.handleSubmit(onSubmit),
    handleOpenChange,
  };
}

function PelangganEditPicDialog({
  open,
  formState,
}: {
  open: boolean;
  formState: PelangganAddPicFormState;
}) {
  const { onSubmit, handleOpenChange, isPending } = formState;

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={handleOpenChange} variant='blur'>
      <Modal.Container>
        <Modal.Dialog className='sm:max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl p-0'>
          <Modal.CloseTrigger className='text-secondary-foreground' />
          <Modal.Header className='shrink-0 flex flex-col gap-0.5 px-6 pt-5 pb-3 border-b border-border/70 text-left items-start'>
            <Modal.Heading className='text-base sm:text-lg font-bold text-foreground'>
              Edit Kontak PIC
            </Modal.Heading>
            <p className='text-xs sm:text-sm text-secondary-foreground'>
              Perbarui informasi kontak person-in-charge untuk outlet pelanggan ini.
            </p>
          </Modal.Header>

          <form
            onSubmit={onSubmit}
            className='flex flex-col flex-1 min-h-0 overflow-hidden'
          >
            <Modal.Body className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-6 py-4'>
              <PelangganAddPicFields formState={formState} />
            </Modal.Body>

            <Modal.Footer className='sticky bottom-0 z-10 shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-md px-6 py-3 flex items-center justify-end gap-3'>
              <PelangganAddPicFooterActions
                onCancel={() => handleOpenChange(false)}
                isPending={isPending}
                submitLabel='Simpan Perubahan'
              />
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

function PelangganEditPicDrawer({
  open,
  formState,
}: {
  open: boolean;
  formState: PelangganAddPicFormState;
}) {
  const { onSubmit, handleOpenChange, isPending } = formState;

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} showSwipeHandle>
      <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full max-h-[92dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
        <DrawerHeader className='shrink-0 flex flex-row items-start justify-between px-5 pt-3 pb-2 text-left border-b border-border/60 bg-card'>
          <div className='flex flex-col gap-0.5'>
            <DrawerTitle className='text-base font-bold text-foreground text-left'>
              Edit Kontak PIC
            </DrawerTitle>
            <DrawerDescription className='text-xs sm:text-sm text-secondary-foreground text-left'>
              Perbarui informasi kontak person-in-charge untuk outlet pelanggan ini.
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
          onSubmit={onSubmit}
          className='flex flex-col flex-1 min-h-0 overflow-hidden'
        >
          <div className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-5 py-4 pb-6'>
            <PelangganAddPicFields formState={formState} />
          </div>

          <DrawerFooter className='sticky bottom-0 z-20 shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-md px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]'>
            <PelangganAddPicFooterActions
              onCancel={() => handleOpenChange(false)}
              isPending={isPending}
              submitLabel='Simpan Perubahan'
            />
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

export function PelangganEditPicModal(props: PelangganEditPicModalProps) {
  const isMobile = useIsMobile();
  const formState = usePelangganEditPicForm(props);

  if (isMobile) {
    return <PelangganEditPicDrawer open={props.open} formState={formState} />;
  }

  return <PelangganEditPicDialog open={props.open} formState={formState} />;
}
