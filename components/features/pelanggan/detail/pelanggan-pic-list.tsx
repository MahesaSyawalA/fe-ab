'use client';

import * as React from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from '@heroui/react';
import { Kontak } from '@/types/contact.types';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/axios';
import { useDeletePelangganContactMutation } from '@/hooks/queries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { PicCard } from '@/components/ui/pic-card';
import { PelangganAddPicModal } from './pelanggan-add-pic-modal';
import { PelangganEditPicModal } from './pelanggan-edit-pic-modal';

interface PelangganPicListProps {
  idPelanggan: string;
  contacts: Kontak[];
  canEdit?: boolean;
  className?: string;
}

export function PelangganPicList({
  idPelanggan,
  contacts,
  canEdit = false,
  className,
}: PelangganPicListProps) {
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [editingContact, setEditingContact] = React.useState<Kontak | null>(null);
  const [deletingContact, setDeletingContact] = React.useState<Kontak | null>(null);
  const deleteContactMutation = useDeletePelangganContactMutation(idPelanggan);

  const handleDeleteContact = async () => {
    if (!deletingContact) return;
    try {
      await deleteContactMutation.mutateAsync(deletingContact.id_kontak);
      toast.success('Kontak PIC berhasil dihapus', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            Kontak <strong>{deletingContact.nama}</strong> telah dihapus dari daftar PIC.
          </span>
        ),
      });
      setDeletingContact(null);
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.danger('Gagal Menghapus Kontak', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            {msg || 'Terjadi kesalahan sistem saat menghapus kontak PIC.'}
          </span>
        ),
      });
    }
  };

  return (
    <div className={cn('flex flex-col gap-3.5', className)}>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <h3 className='text-sm sm:text-base font-bold text-foreground'>
            Daftar PIC
          </h3>
          <Badge
            variant='secondary'
            className='size-5 rounded-full bg-primary/12 p-0 text-[11px] font-bold text-primary flex items-center justify-center'
          >
            {contacts.length}
          </Badge>
        </div>

        {canEdit && (
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => setIsAddOpen(true)}
            className='h-8 gap-1 rounded-lg border-primary/30 bg-primary/5 px-2.5 text-xs font-semibold text-primary hover:bg-primary/10 cursor-pointer shadow-none'
          >
            <Plus className='size-3.5' />
            <span>Tambah PIC</span>
          </Button>
        )}
      </div>

      {contacts.length > 0 ? (
        <div className='flex flex-col gap-3'>
          {contacts.map((contact) => (
            <PicCard
              key={contact.id_kontak}
              nama={contact.nama}
              jabatan={contact.jabatan}
              noTelp={contact.no_telp}
              email={contact.email}
              kategoriPeran={contact.kategori_peran}
              inisial={contact.inisial}
              actions={
                canEdit ? (
                  <>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon-sm'
                      onClick={() => setEditingContact(contact)}
                      aria-label={`Edit ${contact.nama}`}
                      className='h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer'
                    >
                      <Pencil className='size-3.5' />
                    </Button>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon-sm'
                      onClick={() => setDeletingContact(contact)}
                      aria-label={`Hapus ${contact.nama}`}
                      className='h-8 w-8 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/15 cursor-pointer'
                    >
                      <Trash2 className='size-3.5' />
                    </Button>
                  </>
                ) : undefined
              }
            />
          ))}
        </div>
      ) : (
        <Card
          size='sm'
          className='rounded-2xl border border-border ring-0 py-8 text-center shadow-none bg-card'
        >
          <CardContent className='text-xs text-muted-foreground'>
            Belum ada PIC yang didaftarkan untuk outlet ini.
          </CardContent>
        </Card>
      )}

      {canEdit && (
        <>
          <PelangganAddPicModal
            idPelanggan={idPelanggan}
            open={isAddOpen}
            onOpenChange={setIsAddOpen}
          />

          <PelangganEditPicModal
            idPelanggan={idPelanggan}
            contact={editingContact}
            open={Boolean(editingContact)}
            onOpenChange={(open) => {
              if (!open) setEditingContact(null);
            }}
          />

          <ConfirmModal
            open={Boolean(deletingContact)}
            onOpenChange={(open) => {
              if (!open) setDeletingContact(null);
            }}
            title='Hapus Kontak PIC?'
            description={`Kontak "${deletingContact?.nama ?? ''}" akan dihapus secara permanen dari daftar PIC outlet ini.`}
            confirmLabel='Hapus'
            cancelLabel='Batal'
            icon={<Trash2 className='size-7 text-rose-600' />}
            onConfirm={handleDeleteContact}
            isLoading={deleteContactMutation.isPending}
          />
        </>
      )}
    </div>
  );
}
