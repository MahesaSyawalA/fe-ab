import { KanbanOverlay } from '@/components/reui/kanban';
import { KanbanTicketCard } from './cards/kanban-ticket-card';
import { TiketWithDetails } from '@/types/ticket.types';

export function KanbanDragOverlay({
  ticketsByStage,
}: {
  ticketsByStage: Record<string, TiketWithDetails[]>;
}) {
  return (
    <KanbanOverlay>
      {({ value, variant }) => {
        if (variant === 'column') return null;
        const draggedTicket = Object.values(ticketsByStage)
          .flat()
          .find((t) => t.id_tiket === value);
        if (!draggedTicket) return null;
        return (
          <div className='w-[290px] rotate-[2deg] scale-[1.02] transition-transform sm:w-[310px] pointer-events-none'>
            <KanbanTicketCard
              ticket={draggedTicket}
              isSelected
              className='border-2 border-primary/40 bg-white shadow-2xl'
            />
          </div>
        );
      }}
    </KanbanOverlay>
  );
}
