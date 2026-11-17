import { ArrowRight, Plus, X } from 'lucide-react';
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { PRIORITY_CONFIG, KanbanStageColumn } from '@/constants/kanban-constants';
import { TiketWithDetails } from '@/types/ticket.types';
import { cn } from '@/lib/utils';
import { StageDrawerMode } from '../types';

interface StageDrawerHeaderProps {
  mode: StageDrawerMode;
  ticket?: TiketWithDetails | null;
  targetStage: KanbanStageColumn;
  fromStage: KanbanStageColumn | null;
  isSameStage: boolean;
  onClose: () => void;
}

export function StageDrawerHeader({
  mode,
  ticket,
  targetStage,
  fromStage,
  isSameStage,
  onClose,
}: StageDrawerHeaderProps) {
  return (
    <DrawerHeader className='shrink-0 px-4 sm:px-6 py-2.5 border-b border-border/70 bg-card text-left items-start group-data-[swipe-axis=y]/drawer-popup:text-left group-data-[swipe-axis=y]/drawer-popup:items-start'>
      <div className='flex items-center justify-between gap-2 mb-1 w-full'>
        {mode === 'move' ? (
          <div className='flex items-center gap-1.5 min-w-0 flex-wrap'>
            {!isSameStage && fromStage && (
              <>
                <Badge
                  variant='outline'
                  className='h-5 gap-1 rounded-full border-border bg-muted/40 px-2 text-[10px] font-medium text-muted-foreground'
                >
                  <span
                    className='size-1.5 rounded-full'
                    style={{ backgroundColor: fromStage.dotColor }}
                  />
                  {fromStage.nama_tahap}
                </Badge>
                <ArrowRight className='size-3 text-muted-foreground shrink-0' />
              </>
            )}

            <Badge
              className='h-5 gap-1 rounded-full px-2 text-[10px] font-semibold text-white shadow-xs'
              style={{ backgroundColor: targetStage.dotColor }}
            >
              <span className='size-1.5 rounded-full bg-white/80' />
              {isSameStage ? `Aktivitas: ${targetStage.nama_tahap}` : targetStage.nama_tahap}
            </Badge>
          </div>
        ) : (
          <Badge
            className='h-5 gap-1 rounded-full px-2 text-[10px] font-semibold text-white shadow-xs'
            style={{ backgroundColor: targetStage.dotColor }}
          >
            <Plus className='size-3' />
            Tambah Card: {targetStage.nama_tahap}
          </Badge>
        )}

        <button
          type='button'
          onClick={onClose}
          className='size-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0 ml-auto'
          title='Tutup Drawer'
        >
          <X className='size-4' />
        </button>
      </div>

      <DrawerTitle className='text-sm sm:text-base font-bold text-foreground text-left w-full'>
        {mode === 'move' && ticket ? (
          <span className='flex items-center gap-1.5 truncate text-left'>
            <span className='text-foreground'>{ticket.kode_tiket}</span>
            <span className='text-muted-foreground font-normal'>—</span>
            <span className='truncate font-semibold'>{ticket.judul}</span>
          </span>
        ) : (
          `Tambah Card ke Tahap ${targetStage.nama_tahap}`
        )}
      </DrawerTitle>

      <DrawerDescription className='text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 text-left w-full'>
        {mode === 'move' && ticket ? (
          <span className='flex flex-wrap items-center gap-1.5 text-[11px] text-left'>
            <span className='text-primary font-medium'>{ticket.nama_outlet}</span>
            <span>·</span>
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[10px] font-medium',
                PRIORITY_CONFIG[ticket.prioritas]?.badgeClass || 'bg-muted text-muted-foreground',
              )}
            >
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  PRIORITY_CONFIG[ticket.prioritas]?.dotClass,
                )}
              />
              {PRIORITY_CONFIG[ticket.prioritas]?.label || ticket.prioritas}
            </span>
            <span>·</span>
            <span className='text-secondary-foreground'>{ticket.nama_pic || 'PIC Outlet'}</span>
          </span>
        ) : (
          <span className='text-[11px] text-secondary-foreground text-left'>
            Lengkapi data prospek baru dan unggah bukti pendukung awal
          </span>
        )}
      </DrawerDescription>
    </DrawerHeader>
  );
}
