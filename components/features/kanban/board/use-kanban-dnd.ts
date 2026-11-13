import * as React from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import type {
  KanbanMoveEvent,
  KanbanRootProps,
} from '@/components/reui/kanban';
import type { KanbanStageColumn } from '@/constants/kanban-constants';
import type { TiketWithDetails } from '@/types/ticket.types';

type KanbanProps = KanbanRootProps<TiketWithDetails>;
type DragStartEvent = Parameters<NonNullable<KanbanProps['onDragStart']>>[0];
type DragEndEvent = Parameters<NonNullable<KanbanProps['onDragEnd']>>[0];

export interface PendingStageMove {
  ticket: TiketWithDetails;
  fromStage: KanbanStageColumn | null;
  targetStage: KanbanStageColumn;
  targetIndex?: number;
}

export interface UseKanbanDndProps {
  stages: KanbanStageColumn[];
  normalizedTicketsByStage: Record<string, TiketWithDetails[]>;
  setTicketsByStage: (tickets: Record<string, TiketWithDetails[]>) => void;
  startMove: (pending: PendingStageMove) => void;
}

export function useKanbanDnd({
  stages,
  normalizedTicketsByStage,
  setTicketsByStage,
  startMove,
}: UseKanbanDndProps) {
  const [activeDraggedTicketId, setActiveDraggedTicketId] = React.useState<string | null>(null);
  const dragSourceStageRef = React.useRef<string | null>(null);

  const activeHoldingStageId = React.useMemo(() => {
    if (!activeDraggedTicketId) return null;
    for (const [stageId, list] of Object.entries(normalizedTicketsByStage)) {
      if (list.some((item) => item.id_tiket === activeDraggedTicketId)) {
        return stageId;
      }
    }
    return null;
  }, [activeDraggedTicketId, normalizedTicketsByStage]);

  const handleDragOrMoveEnd = (
    activeId: string,
    overId: string | undefined,
  ) => {
    if (!overId) return;

    let fromStageId = dragSourceStageRef.current;
    let draggedTicket: TiketWithDetails | null = null;

    for (const [stageId, list] of Object.entries(normalizedTicketsByStage)) {
      const match = list.find((t) => t.id_tiket === activeId);
      if (match) {
        if (!fromStageId) fromStageId = stageId;
        draggedTicket = match;
        break;
      }
    }

    let toStageId: string | null = null;
    if (stages.some((s) => s.id_tahap === overId)) {
      toStageId = overId;
    } else {
      for (const [stageId, list] of Object.entries(normalizedTicketsByStage)) {
        if (list.some((t) => t.id_tiket === overId)) {
          toStageId = stageId;
          break;
        }
      }
    }

    if (!fromStageId || !toStageId || !draggedTicket) return;

    if (fromStageId === toStageId) {
      const list = [...(normalizedTicketsByStage[fromStageId] ?? [])];
      const oldIdx = list.findIndex((t) => t.id_tiket === activeId);
      const newIdx = list.findIndex((t) => t.id_tiket === overId);
      if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
        setTicketsByStage({
          ...normalizedTicketsByStage,
          [fromStageId]: arrayMove(list, oldIdx, newIdx),
        });
      }
      return;
    }

    const fromStageObj = stages.find((s) => s.id_tahap === fromStageId) ?? null;
    const toStageObj = stages.find((s) => s.id_tahap === toStageId) ?? null;

    if (toStageObj) {
      startMove({
        ticket: draggedTicket,
        fromStage: fromStageObj,
        targetStage: toStageObj,
        targetIndex: 0,
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id as string;
    setActiveDraggedTicketId(activeId);
    for (const [stageId, list] of Object.entries(normalizedTicketsByStage)) {
      if (list.some((t) => t.id_tiket === activeId)) {
        dragSourceStageRef.current = stageId;
        break;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDraggedTicketId(null);
    if (event.over) {
      handleDragOrMoveEnd(String(event.active.id), String(event.over.id));
    }
    dragSourceStageRef.current = null;
  };

  const handleDragCancel = () => {
    setActiveDraggedTicketId(null);
    dragSourceStageRef.current = null;
  };

  const handleMove = ({
    activeContainer,
    activeIndex,
    overContainer,
    overIndex,
  }: KanbanMoveEvent) => {
    if (activeContainer === overContainer) {
      const list = normalizedTicketsByStage[activeContainer] ?? [];
      setTicketsByStage({
        ...normalizedTicketsByStage,
        [activeContainer]: arrayMove(list, activeIndex, overIndex),
      });
      return;
    }

    const fromStageObj =
      stages.find((s) => s.id_tahap === activeContainer) ?? null;
    const toStageObj = stages.find((s) => s.id_tahap === overContainer) ?? null;
    const draggedItem = normalizedTicketsByStage[activeContainer]?.[activeIndex];

    if (!draggedItem || !toStageObj) return;

    startMove({
      ticket: draggedItem,
      fromStage: fromStageObj,
      targetStage: toStageObj,
      targetIndex: overIndex,
    });
  };

  return {
    activeDraggedTicketId,
    activeHoldingStageId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    handleMove,
  };
}

