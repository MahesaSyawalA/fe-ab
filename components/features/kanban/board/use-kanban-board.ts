import * as React from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import type {
  KanbanMoveEvent,
  KanbanRootProps,
} from '@/components/reui/kanban';
import type { ChipFilterItem } from '@/components/ui/chip-filter';
import {
  INITIAL_KANBAN_FILTER,
  countActiveFilters,
  KanbanFilterState,
} from '../filter';
import { StageDrawerMode, StageActivityDrawerProps } from '../stage-activity-drawer';
import { useKanbanStore } from '@/lib/kanban-store';
import { KanbanStageColumn } from '@/constants/kanban-constants';
import { TiketWithDetails } from '@/types/ticket.types';
import { formatCompactRupiah } from '@/lib/utils';

type KanbanProps = KanbanRootProps<TiketWithDetails>;
type DragStartEvent = Parameters<NonNullable<KanbanProps['onDragStart']>>[0];
type DragEndEvent = Parameters<NonNullable<KanbanProps['onDragEnd']>>[0];

export interface PendingStageMove {
  ticket: TiketWithDetails;
  fromStage: KanbanStageColumn | null;
  targetStage: KanbanStageColumn;
  targetIndex?: number;
}

export function useKanbanBoard() {
  const {
    stages,
    ticketsByStage,
    setTicketsByStage,
    addTicket,
    moveTicketWithStageUpdate,
  } = useKanbanStore();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStageId, setSelectedStageId] = React.useState<string>(
    stages[0]?.id_tahap ?? 'visit',
  );
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filterState, setFilterState] = React.useState<KanbanFilterState>(
    INITIAL_KANBAN_FILTER,
  );
  const [isTambahKolomOpen, setIsTambahKolomOpen] = React.useState(false);

  // Dragging active states
  const [activeDraggedTicketId, setActiveDraggedTicketId] = React.useState<
    string | null
  >(null);
  const dragSourceStageRef = React.useRef<string | null>(null);

  // Stage Activity Drawer state (supports 'move' and 'create' modes)
  const [drawerMode, setDrawerMode] = React.useState<StageDrawerMode>('move');
  const [targetStageForAction, setTargetStageForAction] =
    React.useState<KanbanStageColumn | null>(null);
  const [pendingStageMove, setPendingStageMove] =
    React.useState<PendingStageMove | null>(null);
  const [isStageDrawerOpen, setIsStageDrawerOpen] = React.useState(false);

  const columnRefs = React.useRef<Record<string, HTMLElement | null>>({});

  // Active column holding the dragged item
  const activeHoldingStageId = React.useMemo(() => {
    if (!activeDraggedTicketId) return null;
    for (const [stageId, list] of Object.entries(ticketsByStage)) {
      if (list.some((item) => item.id_tiket === activeDraggedTicketId)) {
        return stageId;
      }
    }
    return null;
  }, [activeDraggedTicketId, ticketsByStage]);

  // Filtered tickets per stage
  const filteredTicketsByStage = React.useMemo(() => {
    const result: Record<string, TiketWithDetails[]> = {};
    const q = searchQuery.trim().toLowerCase();
    const minVal = filterState.minEstimate
      ? Number(filterState.minEstimate.replace(/\D/g, ''))
      : null;
    const maxVal = filterState.maxEstimate
      ? Number(filterState.maxEstimate.replace(/\D/g, ''))
      : null;

    stages.forEach((stage) => {
      const items = ticketsByStage[stage.id_tahap] ?? [];
      result[stage.id_tahap] = items.filter((ticket) => {
        if (
          q &&
          !ticket.judul.toLowerCase().includes(q) &&
          !ticket.nama_outlet.toLowerCase().includes(q) &&
          !ticket.kode_tiket.toLowerCase().includes(q)
        ) {
          return false;
        }
        if (
          filterState.stages.length > 0 &&
          !filterState.stages.includes(ticket.id_tahap) &&
          !filterState.stages.includes(ticket.status)
        ) {
          return false;
        }
        if (
          filterState.priorities.length > 0 &&
          !filterState.priorities.includes(ticket.prioritas)
        ) {
          return false;
        }
        if (minVal && ticket.estimasi_nilai < minVal) {
          return false;
        }
        if (maxVal && ticket.estimasi_nilai > maxVal) {
          return false;
        }
        if (
          filterState.salesId &&
          filterState.salesId !== 'all' &&
          ticket.id_user !== filterState.salesId
        ) {
          return false;
        }
        return true;
      });
    });

    return result;
  }, [stages, ticketsByStage, searchQuery, filterState]);

  // Calculate pipeline summary
  const { totalPipelineLabel, activeTicketsCount } = React.useMemo(() => {
    let total = 0;
    let count = 0;
    Object.values(ticketsByStage).forEach((list) => {
      list.forEach((t) => {
        total += t.estimasi_nilai;
        count += 1;
      });
    });
    return {
      totalPipelineLabel: total > 0 ? formatCompactRupiah(total) : 'Rp6,15 M',
      activeTicketsCount: count || 11,
    };
  }, [ticketsByStage]);

  // Stage filter chips (all 7 stages)
  const stageChips: ChipFilterItem[] = React.useMemo(
    () =>
      stages.map((stage) => ({
        id: stage.id_tahap,
        label: stage.nama_tahap,
        count: (filteredTicketsByStage[stage.id_tahap] ?? []).length,
        dotColor: stage.dotColor,
      })),
    [stages, filteredTicketsByStage],
  );

  const activeFilterCount = countActiveFilters(filterState);

  const scrollToStage = (stageId: string) => {
    columnRefs.current[stageId]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    });
  };

  const handleSelectStageChip = (stageId: string) => {
    setSelectedStageId(stageId);
    scrollToStage(stageId);
  };

  // Next stage for floating quick-move pill
  const currentStageIndex = stages.findIndex(
    (s) => s.id_tahap === selectedStageId,
  );
  const nextStage =
    stages[(currentStageIndex + 1) % Math.max(stages.length, 1)] ?? stages[1];
  const activeStageTickets = filteredTicketsByStage[selectedStageId] ?? [];
  const quickMoveTicket = activeStageTickets[0];

  const startMove = (pending: PendingStageMove) => {
    setDrawerMode('move');
    setTargetStageForAction(pending.targetStage);
    setPendingStageMove(pending);
    setIsStageDrawerOpen(true);
  };

  const handleQuickMove = () => {
    if (!quickMoveTicket || !nextStage) return;
    const currentStageObj =
      stages.find((s) => s.id_tahap === selectedStageId) ??
      stages.find((s) => s.id_tahap === quickMoveTicket.id_tahap) ??
      stages[0];

    startMove({
      ticket: quickMoveTicket,
      fromStage: currentStageObj,
      targetStage: nextStage,
      targetIndex: 0,
    });
  };

  // Trigger Add Card Drawer for a specific stage
  const handleOpenAddCardDrawer = (stage: KanbanStageColumn) => {
    setDrawerMode('create');
    setTargetStageForAction(stage);
    setPendingStageMove(null);
    setIsStageDrawerOpen(true);
  };

  // Drag-and-drop end resolution handler
  const handleDragOrMoveEnd = (
    activeId: string,
    overId: string | undefined,
  ) => {
    if (!overId) return;

    // Source stage identification
    let fromStageId = dragSourceStageRef.current;
    let draggedTicket: TiketWithDetails | null = null;

    for (const [stageId, list] of Object.entries(ticketsByStage)) {
      const match = list.find((t) => t.id_tiket === activeId);
      if (match) {
        if (!fromStageId) fromStageId = stageId;
        draggedTicket = match;
        break;
      }
    }

    // Target stage identification
    let toStageId: string | null = null;
    if (stages.some((s) => s.id_tahap === overId)) {
      toStageId = overId;
    } else {
      for (const [stageId, list] of Object.entries(ticketsByStage)) {
        if (list.some((t) => t.id_tiket === overId)) {
          toStageId = stageId;
          break;
        }
      }
    }

    if (!fromStageId || !toStageId || !draggedTicket) return;

    // If dropped in the SAME stage, perform item reordering
    if (fromStageId === toStageId) {
      const list = [...(ticketsByStage[fromStageId] ?? [])];
      const oldIdx = list.findIndex((t) => t.id_tiket === activeId);
      const newIdx = list.findIndex((t) => t.id_tiket === overId);
      if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
        setTicketsByStage({
          ...ticketsByStage,
          [fromStageId]: arrayMove(list, oldIdx, newIdx),
        });
      }
      return;
    }

    // Dropped into a DIFFERENT activity/stage! Trigger the bottom Drawer form!
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
    for (const [stageId, list] of Object.entries(ticketsByStage)) {
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
      const list = ticketsByStage[activeContainer] ?? [];
      setTicketsByStage({
        ...ticketsByStage,
        [activeContainer]: arrayMove(list, activeIndex, overIndex),
      });
      return;
    }

    const fromStageObj =
      stages.find((s) => s.id_tahap === activeContainer) ?? null;
    const toStageObj = stages.find((s) => s.id_tahap === overContainer) ?? null;
    const draggedItem = ticketsByStage[activeContainer]?.[activeIndex];

    if (!draggedItem || !toStageObj) return;

    startMove({
      ticket: draggedItem,
      fromStage: fromStageObj,
      targetStage: toStageObj,
      targetIndex: overIndex,
    });
  };

  // Confirm ticket move
  const handleConfirmStageMove: NonNullable<
    StageActivityDrawerProps['onConfirmMove']
  > = (params) => {
    moveTicketWithStageUpdate(params);
    setSelectedStageId(params.toStageId);
    scrollToStage(params.toStageId);
    setPendingStageMove(null);
  };

  // Confirm new ticket creation in that stage
  const handleConfirmCreateTicket = (newTicket: TiketWithDetails) => {
    addTicket(newTicket);
    setSelectedStageId(newTicket.id_tahap);
    scrollToStage(newTicket.id_tahap);
    setPendingStageMove(null);
  };

  const handleCancelMove = () => {
    setPendingStageMove(null);
    setTargetStageForAction(null);
  };

  return {
    stages,
    ticketsByStage,
    setTicketsByStage,
    columnRefs,
    searchQuery,
    setSearchQuery,
    selectedStageId,
    setSelectedStageId,
    filterOpen,
    setFilterOpen,
    filterState,
    setFilterState,
    isTambahKolomOpen,
    setIsTambahKolomOpen,
    activeDraggedTicketId,
    activeHoldingStageId,
    drawerMode,
    targetStageForAction,
    pendingStageMove,
    isStageDrawerOpen,
    setIsStageDrawerOpen,
    filteredTicketsByStage,
    totalPipelineLabel,
    activeTicketsCount,
    stageChips,
    activeFilterCount,
    nextStage,
    quickMoveTicket,
    handleSelectStageChip,
    handleQuickMove,
    handleOpenAddCardDrawer,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    handleMove,
    handleConfirmStageMove,
    handleConfirmCreateTicket,
    handleCancelMove,
  };
}
