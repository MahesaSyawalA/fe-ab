import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TiketWithDetails } from '@/types/ticket.types';
import { ProspekAktivitasCard } from './prospek-aktivitas-card';
import { ProspekAktivitasEmpty } from './prospek-aktivitas-empty';

interface ProspekTabAktivitasProps {
  ticket: TiketWithDetails;
  onAdd: () => void;
}

export function ProspekTabAktivitas({ ticket, onAdd }: ProspekTabAktivitasProps) {
  const aktivitasList = ticket.aktivitas_list ?? [];

  return (
    <div className='flex flex-col gap-3.5 p-3.5 sm:p-5'>
      {aktivitasList.length === 0 ? (
        <ProspekAktivitasEmpty onAdd={onAdd} />
      ) : (
        <>
          {aktivitasList.map((akt) => (
            <ProspekAktivitasCard key={akt.id_aktivitas} akt={akt} />
          ))}

          <Button
            type='button'
            variant='outline'
            onClick={onAdd}
            className='h-10 w-full gap-1.5 rounded-xl border-dashed border-primary/40 bg-primary/5 text-xs font-semibold text-primary shadow-none hover:bg-primary/10 cursor-pointer'
          >
            <Plus className='size-3.5' />
            Tambah Aktivitas
          </Button>
        </>
      )}
    </div>
  );
}
