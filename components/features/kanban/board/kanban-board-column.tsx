import { MoreHorizontal, Plus } from 'lucide-react';
import {
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
} from '@/components/reui/kanban';
import { Button } from '@/components/ui/button';
import { KanbanTicketCard } from './cards/kanban-ticket-card';
import { KanbanStageColumn } from '@/constants/kanban-constants';
import { TiketWithDetails } from '@/types/ticket.types';
import { cn } from '@/lib/utils';

interface KanbanBoardColumnProps {
  stage: KanbanStageColumn;
  items: TiketWithDetails[];
  isLoading?: boolean;
  isFocused: boolean;
  isHolding: boolean;
  activeDraggedTicketId: string | null;
  columnRef: (el: HTMLElement | null) => void;
  onTicketClick: (ticket: TiketWithDetails) => void;
  onAddCard: () => void;
  onOpenOptions: () => void;
}

export function KanbanBoardColumn({
  stage,
  items,
  isLoading = false,
  isFocused,
  isHolding,
  activeDraggedTicketId,
  columnRef,
  onTicketClick,
  onAddCard,
  onOpenOptions,
}: KanbanBoardColumnProps) {
  return (
    <div ref={columnRef} className='w-[290px] shrink-0 sm:w-[310px]'>
      <KanbanColumn
        value={stage.id_tahap}
        className={cn(
          'flex flex-col gap-3 rounded-2xl border p-3 transition-all',
          isHolding
            ? 'border-2 border-dashed border-[#2563EB] bg-[#EFF6FF]/70'
            : isFocused
              ? 'border-primary/30 bg-[#EEF2F6]'
              : 'border-border/60 bg-[#F1F5F9]/80',
        )}
      >
        {/* Column Header */}
        <div className='flex items-center justify-between px-1 pt-0.5'>
          <div className='flex items-center gap-2'>
            <span
              className='size-2.5 rounded-full'
              style={{ backgroundColor: stage.dotColor }}
            />
            <h3 className='text-xs font-bold text-foreground'>
              {stage.nama_tahap} ({isLoading ? '…' : items.length})
            </h3>
          </div>
          <button
            type='button'
            onClick={onOpenOptions}
            className='rounded-lg p-1 text-muted-foreground hover:bg-background/60 hover:text-foreground cursor-pointer'
            aria-label={`Opsi kolom ${stage.nama_tahap}`}
          >
            <MoreHorizontal className='size-4' />
          </button>
        </div>

        {/* Ticket Cards List */}
        <KanbanColumnContent
          value={stage.id_tahap}
          className={cn(
            'flex flex-col gap-2.5',
            !isLoading && items.length === 0 && '-mb-1',
          )}
        >
          {isLoading ? (
            <div className='flex flex-col gap-2.5'>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className='flex flex-col gap-2.5 rounded-2xl border border-border/60 bg-white p-3.5 shadow-2xs animate-pulse'
                >
                  <div className='flex items-center justify-between'>
                    <div className='h-3.5 w-24 rounded-md bg-muted' />
                    <div className='h-4 w-12 rounded-full bg-muted' />
                  </div>
                  <div className='h-4 w-36 rounded-md bg-muted' />
                  <div className='flex items-center justify-between pt-1'>
                    <div className='h-3.5 w-20 rounded-md bg-muted' />
                    <div className='size-5 rounded-full bg-muted' />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-white/40 py-8 px-3 text-center'>
              <p className='text-xs font-medium text-muted-foreground'>
                Belum ada prospek di tahap ini
              </p>
            </div>
          ) : (
            items.map((ticket) => (
              <KanbanItem
                key={ticket.id_tiket}
                value={ticket.id_tiket}
                className='rounded-2xl'
              >
                <KanbanItemHandle className='rounded-2xl'>
                  {ticket.id_tiket === activeDraggedTicketId ? (
                    <div className='h-[126px] w-full rounded-2xl bg-[#3B82F6] transition-all' />
                  ) : (
                    <KanbanTicketCard
                      ticket={ticket}
                      onClick={() => onTicketClick(ticket)}
                    />
                  )}
                </KanbanItemHandle>
              </KanbanItem>
            ))
          )}
        </KanbanColumnContent>

        {/* + Add Card Button -> Automatically opens stage-specific form drawer! */}
        <Button
          type='button'
          variant='outline'
          onClick={onAddCard}
          className='h-9 w-full gap-1.5 rounded-xl border-dashed border-border bg-white text-xs font-semibold text-muted-foreground shadow-none hover:border-primary/40 hover:bg-primary/5 hover:text-primary cursor-pointer'
        >
          <Plus className='size-3.5' />
          Add Card
        </Button>
      </KanbanColumn>
    </div>
  );
}
