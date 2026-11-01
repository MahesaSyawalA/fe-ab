import { LayoutGrid, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProspekAktivitasEmpty({ onAdd }: { onAdd: () => void }) {
  return (
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
        onClick={onAdd}
        className='mt-2 h-9 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer'
      >
        <Plus className='size-3.5 mr-1.5' />
        Tambah Aktivitas
      </Button>
    </div>
  );
}
