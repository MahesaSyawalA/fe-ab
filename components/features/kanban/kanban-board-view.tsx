'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, MoreHorizontal, Plus } from 'lucide-react';
import { arrayMove } from '@dnd-kit/sortable';
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from '@/components/reui/kanban';
import { Button } from '@/components/ui/button';
import { SearchFilterBar } from '@/components/ui/search-filter-bar';
import { ChipFilter, ChipFilterItem } from '@/components/ui/chip-filter';
import { KanbanPipelineCard } from './kanban-pipeline-card';
import { KanbanTicketCard } from './kanban-ticket-card';
import {
  INITIAL_KANBAN_FILTER,
  KanbanFilterDrawer,
  countActiveFilters,
  KanbanFilterState,
} from './kanban-filter-drawer';
import { TambahKolomDialog } from './tambah-kolom-dialog';
import { StageActivityDrawer, StageDrawerMode } from './stage-activity-drawer';
import { useKanbanStore } from '@/lib/kanban-store';
import { KanbanStageColumn, TEAM_CONTRIBUTIONS } from '@/constants/kanban-constants';
import { AktivitasWithDetails, TiketWithDetails } from '@/types/ticket.types';
import { cn, formatCompactRupiah } from '@/lib/utils';

export type KanbanUserRole = 'sales' | 'manager' | 'director';

interface KanbanBoardViewProps {
  role: KanbanUserRole;
  basePath: string;
}

interface PendingStageMove {
  ticket: TiketWithDetails;
  fromStage: KanbanStageColumn | null;
  targetStage: KanbanStageColumn;
  targetIndex?: number;
}

export function KanbanBoardView({ role, basePath }: KanbanBoardViewProps) {
  const router = useRouter();
  const {
    stages,
    ticketsByStage,
    setTicketsByStage,
    addTicket,
    moveTicketWithStageUpdate,
  } = useKanbanStore();

  const canCreateColumn = role === 'manager' || role === 'director';

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
          !ticket.nama_faskes.toLowerCase().includes(q) &&
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

  const handleSelectStageChip = (stageId: string) => {
    setSelectedStageId(stageId);
    const colEl = columnRefs.current[stageId];
    if (colEl) {
      colEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest',
      });
    }
  };

  // Next stage for floating quick-move pill
  const currentStageIndex = stages.findIndex(
    (s) => s.id_tahap === selectedStageId,
  );
  const nextStage =
    stages[(currentStageIndex + 1) % Math.max(stages.length, 1)] ?? stages[1];
  const activeStageTickets = filteredTicketsByStage[selectedStageId] ?? [];
  const quickMoveTicket = activeStageTickets[0];

  const handleQuickMove = () => {
    if (!quickMoveTicket || !nextStage) return;
    const currentStageObj =
      stages.find((s) => s.id_tahap === selectedStageId) ??
      stages.find((s) => s.id_tahap === quickMoveTicket.id_tahap) ??
      stages[0];

    setDrawerMode('move');
    setTargetStageForAction(nextStage);
    setPendingStageMove({
      ticket: quickMoveTicket,
      fromStage: currentStageObj,
      targetStage: nextStage,
      targetIndex: 0,
    });
    setIsStageDrawerOpen(true);
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
      setDrawerMode('move');
      setTargetStageForAction(toStageObj);
      setPendingStageMove({
        ticket: draggedTicket,
        fromStage: fromStageObj,
        targetStage: toStageObj,
        targetIndex: 0,
      });
      setIsStageDrawerOpen(true);
    }
  };

  // Confirm ticket move
  const handleConfirmStageMove = ({
    id_tiket,
    fromStageId,
    toStageId,
    targetIndex,
    ticketUpdates,
    activity,
  }: {
    id_tiket: string;
    fromStageId: string;
    toStageId: string;
    targetIndex?: number;
    ticketUpdates: Partial<TiketWithDetails>;
    activity: AktivitasWithDetails;
  }) => {
    moveTicketWithStageUpdate({
      id_tiket,
      fromStageId,
      toStageId,
      targetIndex,
      ticketUpdates,
      activity,
    });

    setSelectedStageId(toStageId);
    const colEl = columnRefs.current[toStageId];
    if (colEl) {
      colEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest',
      });
    }
    setPendingStageMove(null);
  };

  // Confirm new ticket creation in that stage
  const handleConfirmCreateTicket = (newTicket: TiketWithDetails) => {
    addTicket(newTicket);
    setSelectedStageId(newTicket.id_tahap);
    const colEl = columnRefs.current[newTicket.id_tahap];
    if (colEl) {
      colEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest',
      });
    }
    setPendingStageMove(null);
  };

  return (
    <div className='relative flex w-full max-w-full min-w-0 flex-col gap-3.5 pb-20'>
      {/* Page Title */}
      <div className='flex flex-col gap-0.5 w-full max-w-full'>
        <h1 className='text-lg font-bold tracking-tight text-foreground'>
          Papan Kanban
        </h1>
        <p className='text-xs text-muted-foreground'>
          Pipeline 7 Tahap Aktivitas Penjualan · Squad Jakarta 1
        </p>
      </div>

      {/* Search Bar + Filter Button */}
      <div className='w-full max-w-full min-w-0'>
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenFilterModal={() => setFilterOpen(true)}
          activeFilterCount={activeFilterCount}
        />
      </div>

      {/* Blue Pipeline Summary Card */}
      <div className='w-full max-w-full min-w-0'>
        <KanbanPipelineCard
          totalPipelineLabel={totalPipelineLabel}
          activeTicketsCount={activeTicketsCount}
          targetPercentage={68}
          showTeamContributions={canCreateColumn}
          teamContributions={TEAM_CONTRIBUTIONS}
        />
      </div>

      {/* Stage Filter Chips (7 Tahapan: Visit, Kebutuhan, Opportunity, Follow Up, Quotation, PO, Revenue) */}
      <div className='w-full max-w-full min-w-0 overflow-hidden'>
        <ChipFilter
          items={stageChips}
          selectedId={selectedStageId}
          onSelect={handleSelectStageChip}
        />
      </div>

      {/* Kanban Columns Board with drag-and-drop & automatic Bottom Drawer */}
      <div className='w-full max-w-full min-w-0'>
        <Kanban
          id='kanban-board-dnd'
          className='w-full max-w-full min-w-0'
          value={ticketsByStage}
          onValueChange={setTicketsByStage}
          getItemValue={(item) => item.id_tiket}
        onDragStart={(event) => {
          const activeId = event.active.id as string;
          setActiveDraggedTicketId(activeId);
          for (const [stageId, list] of Object.entries(ticketsByStage)) {
            if (list.some((t) => t.id_tiket === activeId)) {
              dragSourceStageRef.current = stageId;
              break;
            }
          }
        }}
        onDragEnd={(event) => {
          setActiveDraggedTicketId(null);
          if (event.over) {
            handleDragOrMoveEnd(String(event.active.id), String(event.over.id));
          }
          dragSourceStageRef.current = null;
        }}
        onDragCancel={() => {
          setActiveDraggedTicketId(null);
          dragSourceStageRef.current = null;
        }}
        onMove={({ activeContainer, activeIndex, overContainer, overIndex }) => {
          if (activeContainer === overContainer) {
            const list = ticketsByStage[activeContainer] ?? [];
            const reordered = arrayMove(list, activeIndex, overIndex);
            setTicketsByStage({
              ...ticketsByStage,
              [activeContainer]: reordered,
            });
            return;
          }

          const fromStageObj =
            stages.find((s) => s.id_tahap === activeContainer) ?? null;
          const toStageObj =
            stages.find((s) => s.id_tahap === overContainer) ?? null;
          const draggedItem = ticketsByStage[activeContainer]?.[activeIndex];

          if (!draggedItem || !toStageObj) return;

          setDrawerMode('move');
          setTargetStageForAction(toStageObj);
          setPendingStageMove({
            ticket: draggedItem,
            fromStage: fromStageObj,
            targetStage: toStageObj,
            targetIndex: overIndex,
          });
          setIsStageDrawerOpen(true);
        }}
      >
        <KanbanBoard className='no-scrollbar flex w-full min-w-0 items-start gap-3.5 overflow-x-auto pb-4'>
          {stages.map((stage) => {
            const items = filteredTicketsByStage[stage.id_tahap] ?? [];
            const isFocusedStage = selectedStageId === stage.id_tahap;
            const isHoldingInColumn = Boolean(
              activeHoldingStageId === stage.id_tahap,
            );

            return (
              <div
                key={stage.id_tahap}
                ref={(el) => {
                  columnRefs.current[stage.id_tahap] = el;
                }}
                className='w-[290px] shrink-0 sm:w-[310px]'
              >
                <KanbanColumn
                  value={stage.id_tahap}
                  className={cn(
                    'flex flex-col min-h-[440px] gap-3 rounded-2xl border p-3 transition-all',
                    isHoldingInColumn
                      ? 'border-2 border-dashed border-[#2563EB] bg-[#EFF6FF]/70'
                      : isFocusedStage
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
                        {stage.nama_tahap} ({items.length})
                      </h3>
                    </div>
                    <button
                      type='button'
                      onClick={() => setSelectedStageId(stage.id_tahap)}
                      className='rounded-lg p-1 text-muted-foreground hover:bg-background/60 hover:text-foreground cursor-pointer'
                      aria-label={`Opsi kolom ${stage.nama_tahap}`}
                    >
                      <MoreHorizontal className='size-4' />
                    </button>
                  </div>

                  {/* Ticket Cards List */}
                  <KanbanColumnContent
                    value={stage.id_tahap}
                    className='flex flex-1 flex-col gap-2.5 min-h-[140px]'
                  >
                    {items.map((ticket) => {
                      const isItemDragging =
                        ticket.id_tiket === activeDraggedTicketId;

                      return (
                        <KanbanItem
                          key={ticket.id_tiket}
                          value={ticket.id_tiket}
                          className='rounded-2xl'
                        >
                          <KanbanItemHandle className='rounded-2xl'>
                            {isItemDragging ? (
                              <div className='h-[126px] w-full rounded-2xl bg-[#3B82F6] transition-all' />
                            ) : (
                              <KanbanTicketCard
                                ticket={ticket}
                                onClick={() =>
                                  router.push(`${basePath}/${ticket.id_tiket}`)
                                }
                              />
                            )}
                          </KanbanItemHandle>
                        </KanbanItem>
                      );
                    })}
                  </KanbanColumnContent>

                  {/* + Add Card Button -> Automatically opens stage-specific form drawer! */}
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => handleOpenAddCardDrawer(stage)}
                    className='h-9 w-full gap-1.5 rounded-xl border-dashed border-border bg-white text-xs font-semibold text-muted-foreground shadow-none hover:border-primary/40 hover:bg-primary/5 hover:text-primary cursor-pointer'
                  >
                    <Plus className='size-3.5' />
                    Add Card
                  </Button>
                </KanbanColumn>
              </div>
            );
          })}

          {/* + Tambah List Button */}
          <div className='w-[270px] shrink-0 sm:w-[290px]'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsTambahKolomOpen(true)}
              className='h-11 w-full gap-1.5 rounded-xl border-dashed border-primary/50 bg-primary/5 text-xs font-semibold text-primary shadow-none hover:bg-primary/10 hover:text-primary cursor-pointer'
            >
              <Plus className='size-3.5' />
              Tambah List
            </Button>
          </div>
        </KanbanBoard>

        {/* Floating Tilted Drag Overlay */}
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
      </Kanban>
      </div>

      {/* Floating Bottom Quick-Move Pill (`→ Pindah ke [Tahap]`) */}
      {quickMoveTicket && nextStage && (
        <div className='fixed bottom-5 left-1/2 z-30 -translate-x-1/2'>
          <Button
            type='button'
            onClick={handleQuickMove}
            className='h-10 gap-2 rounded-full bg-[#1E293B] px-5 text-xs font-semibold text-white shadow-lg hover:bg-[#0F172A] cursor-pointer'
          >
            <ArrowRight className='size-3.5' />
            Pindah ke {nextStage.nama_tahap}
          </Button>
        </div>
      )}

      {/* Smooth Shadcn UI Bottom Drawer Form (for Move & Add Card) */}
      <StageActivityDrawer
        open={isStageDrawerOpen}
        onOpenChange={setIsStageDrawerOpen}
        mode={drawerMode}
        ticket={pendingStageMove?.ticket ?? null}
        fromStage={pendingStageMove?.fromStage ?? null}
        targetStage={
          drawerMode === 'create'
            ? targetStageForAction
            : pendingStageMove?.targetStage ?? targetStageForAction
        }
        targetIndex={pendingStageMove?.targetIndex}
        onConfirmMove={handleConfirmStageMove}
        onCreateTicket={handleConfirmCreateTicket}
        onCancelMove={() => {
          setPendingStageMove(null);
          setTargetStageForAction(null);
        }}
      />

      {/* Filter Tiket Bottom Sheet Drawer */}
      <KanbanFilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        value={filterState}
        onApply={setFilterState}
      />

      {/* Tambah Kolom Board Baru */}
      <TambahKolomDialog
        open={isTambahKolomOpen}
        onOpenChange={setIsTambahKolomOpen}
      />
    </div>
  );
}
