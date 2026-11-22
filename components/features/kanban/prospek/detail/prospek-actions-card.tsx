import { CheckCircle2, Pencil, Plus, XCircle } from 'lucide-react';
import { SurfaceCard } from '@/components/ui/surface-card';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { TiketStatus } from '@/types/ticket.types';
import { cn } from '@/lib/utils';

interface ProspekActionsCardProps {
  status?: TiketStatus;
  onNegotiate: () => void;
  onAddActivity: () => void;
}

export function ProspekActionsCard({
  status = 'open',
  onNegotiate,
  onAddActivity,
}: ProspekActionsCardProps) {
  const isDecided = status === 'won' || status === 'lost';
  const isWon = status === 'won';

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

        {isDecided && (
          <div
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold',
              isWon
                ? 'border-emerald-500/30 bg-emerald-50 text-emerald-700'
                : 'border-rose-500/30 bg-rose-50 text-rose-600',
            )}
          >
            {isWon ? (
              <CheckCircle2 className='size-4 shrink-0' />
            ) : (
              <XCircle className='size-4 shrink-0' />
            )}
            <span>
              Hasil Prospek: {isWon ? 'WON' : 'LOST'}
            </span>
          </div>
        )}

        <Button
          type='button'
          variant={isDecided ? 'outline' : 'default'}
          onClick={onNegotiate}
          className={cn(
            'h-10 w-full gap-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer disabled:opacity-50',
            isDecided
              ? 'border-border bg-card text-foreground shadow-2xs hover:bg-secondary'
              : 'bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary text-white shadow-sm',
          )}
        >
          {isDecided && <Pencil className='size-3.5' />}
          <span>
            {isDecided ? 'Ubah Hasil Negosiasi' : 'Tentukan Hasil Negosiasi'}
          </span>
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
