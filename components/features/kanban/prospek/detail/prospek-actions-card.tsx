import { Plus } from 'lucide-react';
import { SurfaceCard } from '@/components/ui/surface-card';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProspekActionsCardProps {
  onNegotiate: () => void;
  onAddActivity: () => void;
}

export function ProspekActionsCard({
  onNegotiate,
  onAddActivity,
}: ProspekActionsCardProps) {
  return (
    <SurfaceCard className='hidden lg:flex'>
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
          onClick={onNegotiate}
          className='h-10 w-full rounded-md bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary text-xs font-semibold text-white shadow-sm disabled:opacity-50 transition-all cursor-pointer'
        >
          Tentukan Hasil Negosiasi
        </Button>

        <Button
          type='button'
          variant='outline'
          onClick={onAddActivity}
          className='h-9 w-full gap-1.5 rounded-md border-dashed border-primary/40 bg-primary/5 text-xs font-semibold text-primary shadow-none hover:bg-primary/10 cursor-pointer'
        >
          <Plus className='size-3.5' />
          Tambah Aktivitas Baru
        </Button>
      </CardContent>
    </SurfaceCard>
  );
}
