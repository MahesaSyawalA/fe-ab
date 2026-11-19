'use client';

import * as React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from '@heroui/react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useDeleteAktivitasMutation } from '@/hooks/queries/use-kanban-query';
import { getErrorMessage } from '@/lib/axios';
import type { AktivitasWithDetails, TiketWithDetails } from '@/types/ticket.types';
import { ProspekAktivitasCard } from './prospek-aktivitas-card';
import { ProspekAktivitasEmpty } from './prospek-aktivitas-empty';
import { ProspekEditAktivitasModal } from './prospek-edit-aktivitas-modal';

interface ProspekTabAktivitasProps {
  ticket: TiketWithDetails;
  canEdit?: boolean;
  onAdd: () => void;
}

export function ProspekTabAktivitas({
  ticket,
  canEdit = false,
  onAdd,
}: ProspekTabAktivitasProps) {
  const aktivitasList = ticket.aktivitas_list ?? [];
  const [editingAktivitas, setEditingAktivitas] = React.useState<AktivitasWithDetails | null>(null);
  const [deletingAktivitas, setDeletingAktivitas] = React.useState<AktivitasWithDetails | null>(null);
  const deleteAktivitasMutation = useDeleteAktivitasMutation(ticket.id_tiket);

  const handleDeleteAktivitas = async () => {
    if (!deletingAktivitas) return;
    try {
      await deleteAktivitasMutation.mutateAsync(deletingAktivitas.id_aktivitas);
      toast.success('Aktivitas Berhasil Dihapus', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            Catatan aktivitas telah dihapus dari prospek ini.
          </span>
        ),
      });
      setDeletingAktivitas(null);
    } catch (err) {
      toast.danger('Gagal Menghapus Aktivitas', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            {getErrorMessage(err) || 'Terjadi kesalahan sistem saat menghapus aktivitas.'}
          </span>
        ),
      });
    }
  };

  return (
    <div className='flex flex-col gap-3.5 p-3.5 sm:p-5'>
      {aktivitasList.length === 0 ? (
        <ProspekAktivitasEmpty onAdd={onAdd} />
      ) : (
        <>
          {aktivitasList.map((akt) => (
            <ProspekAktivitasCard
              key={akt.id_aktivitas}
              akt={akt}
              canEdit={canEdit}
              onEdit={setEditingAktivitas}
              onDelete={setDeletingAktivitas}
            />
          ))}

          {canEdit && (
            <Button
              type='button'
              variant='outline'
              onClick={onAdd}
              className='h-10 w-full gap-1.5 rounded-md border-dashed border-primary/40 bg-primary/5 text-xs font-semibold text-primary shadow-none hover:bg-primary/10 cursor-pointer'
            >
              <Plus className='size-3.5' />
              Tambah Aktivitas
            </Button>
          )}
        </>
      )}

      {canEdit && (
        <>
          <ProspekEditAktivitasModal
            idTiket={ticket.id_tiket}
            aktivitas={editingAktivitas}
            open={Boolean(editingAktivitas)}
            onOpenChange={(open) => {
              if (!open) setEditingAktivitas(null);
            }}
          />

          <ConfirmModal
            open={Boolean(deletingAktivitas)}
            onOpenChange={(open) => {
              if (!open) setDeletingAktivitas(null);
            }}
            title='Hapus Aktivitas?'
            description='Catatan aktivitas dan berkas terkait akan dihapus secara permanen dari riwayat prospek ini.'
            confirmLabel='Hapus'
            cancelLabel='Batal'
            icon={<Trash2 className='size-7 text-rose-600' />}
            onConfirm={handleDeleteAktivitas}
            isLoading={deleteAktivitasMutation.isPending}
          />
        </>
      )}
    </div>
  );
}
